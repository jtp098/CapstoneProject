import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap, delay } from 'rxjs/operators';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
  uid:string;
}

@Component({
  selector: 'app-img-uploader',
  templateUrl: './img-uploader.page.html',
  styleUrls: ['./img-uploader.page.scss'],
})
export class ImgUploaderPage {

  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  // File details
  fileName: string;
  fileSize: number;

  // Status check
  isUploading: boolean;
  isUploaded: boolean;

  uidPassed: any;
  userHasImage;
  ImageData$ = [];
  docID;
  public user: any[];
  


  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(private storage: AngularFireStorage, private database: AngularFirestore,private router: Router,
		private route: ActivatedRoute) {
    this.isUploading = false;
    this.isUploaded = false;
    // Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('TeamerizerImages');
    this.images = this.imageCollection.valueChanges();

    this.route.queryParams.subscribe(params => {
			if (this.router.getCurrentNavigation().extras.state) {

			
				this.uidPassed = this.router.getCurrentNavigation().extras.state.uid;
			
				console.log("passedData", this.uidPassed);
			} else {
				console.log("no Extras")
			}
		});
  }
  ngOnInit() {
delay(2000);
    this.GetCurrentImage(this.uidPassed).subscribe(data => {
      delay(2000);
      console.log("user image data:", data);
      this.ImageData$ = data;
      if (this.ImageData$.length === 0) {
        console.log("no matching images");
        this.userHasImage = false;
        console.log("userHasImage set to false", this.userHasImage);
      }else{
        this.docID = this.ImageData$[0].DocID;
        console.log("DocID", this.docID);
        console.log("Length", this.ImageData$.length);
        this.userHasImage = true;
          console.log("userHasImage set to true", this.userHasImage);
        

      }
      
        
    });

    this.getUser(this.uidPassed).subscribe(data => {
      this.user = data;
    
       console.log("Pending",data);
 });
    

  }



  uploadFile(event: FileList) { 
    if(this.userHasImage)
    {
      this.removeImage(this.docID);
      this.userHasImage = false;
    }
    if(this.userHasImage == false)
    {
    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `Teamerizer-Storage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Teamerizer' };

    // File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        console.log(this.UploadedFileURL);

        

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize,
            uid: this.uidPassed
          });
           //CP-82 Changes
          this.imagePathUpdate(this.uidPassed,resp);
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        });
      }),
      

      
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    );
    }
    //this.back();
  }

  addImagetoDB(image: MyData) {
    // Create an ID for document
    const id = this.database.createId();

    // Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }
//JP-3/25/2020 - Gets the current images and DOCID
  GetCurrentImage(uid): Observable<any> {
		return this.database.collection<any>('TeamerizerImages', ref => ref
            .where('uid', '==', uid)).valueChanges({ idField: 'DocID' });
            
    }
    //JP-3/25/2020 - This deletes any document before adding a new one
    async removeImage(docID) {
      this.database.doc("TeamerizerImages/" + docID).delete();
      console.log("Image Deleted", docID);
    }

    async back(){
      this.router.navigate(['/profile'])
  }

  getUser(uidPassed): Observable<any> {
		return this.database.collection('users', ref => ref.where('uid', '==', uidPassed)).valueChanges({idField: 'DocID'});
  }
  //CP-82 Changes
  async imagePathUpdate(DocID,resp) {
		var db = this.database.firestore;
		db.collection("users").doc(DocID).update({imagePath: resp});
	 }
}
