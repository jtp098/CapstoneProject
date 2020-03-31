import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AngularFirestore,AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import { UserService } from '../user.service';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import {forEach} from "@angular-devkit/schematics";


@Component({
  selector: 'app-pending-invites',
  templateUrl: './pending-invites.page.html',
  styleUrls: ['./pending-invites.page.scss'],
})
export class PendingInvitesPage implements OnInit {
	public userList: any[];
	public loadedUserList: any[];
	userinfo$ :any[];
	selectedGrpName:any;
	groupUsers = [];
  groupUsersPending = [];
  pendingList$ = [];
  selectedGrpDocID: any;


	sliderConfig = {
		spaceBetween: 10,
		centeredSlides: true,
		slidesPerView: 1.8
	}

	uid: string;
	selectedName;
	group$;
	grouponSelectedname$;
	grouponSelectednamePending$;
  grouplist: any;
  userInvites = [];
  docID;
  mainuser: AngularFirestoreDocument
	constructor(private navCtrl: NavController,
				public afstore: AngularFirestore,
				public afAuth: AngularFireAuth,
				public alertController: AlertController,
				private userService: UserService,
				private router: Router,
				private route: ActivatedRoute
	) {
		this.route.queryParams.subscribe(params => {
			if (this.router.getCurrentNavigation().extras.state) {
			  
			  this.uid = this.router.getCurrentNavigation().extras.state.uid;
			  this.selectedGrpDocID = this.router.getCurrentNavigation().extras.state.DocID;
			  
			  console.log("passedData",this.uid);
			}else{
				console.log("no Extras")
			}
		  });
		  

	}

	ngOnInit() {
		this.afAuth.authState.subscribe(user => {
			if(user){
				this.getPendingInvites(user.uid).subscribe(data => {
          this.userInvites = data;
          this.pendingList$ =data;
          console.log("Pending",data);
				});
			}
		});
  }
  getPendingInvites(uid): Observable<any> {
    console.log("UID",uid);
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid).where( 'status', '==', 'Pending')).valueChanges();
	}

	openDetailsWithState(firstName: string) {
		let navigationExtras: NavigationExtras = {
			state: {
				user: firstName,
				groupname:this.selectedGrpName
			}
		};
		this.router.navigate(['/member-details'], navigationExtras);
	}

	 delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
  }
  deleteDocument(uid:string){
	this.afstore.doc("adduserstogrp/" + docID).delete();
	console.log("Removed From Group", docID);

}
  //user accepts and this sets the status to active
	 async Accept(uid, grpName) {
     console.log(uid + "Users");
     console.log(grpName + "group name");
		 let observableUser$ = null;
		 try {
			 this.afstore.collection('users', ref => ref.where('uid', '==', uid)).valueChanges().subscribe((data) => {
				 observableUser$ = data;
				 console.log(data);
				 this.userinfo$=observableUser$;
				 console.log(this.userinfo$[0]);
			 });
		 } finally {
			 await this.delay(2000);
			 console.log("Fianl"+observableUser$);
			 //debugger;
			 this.afstore.collection('users', ref => ref.where('uid', '==', uid)).valueChanges().subscribe((data) => {
					 observableUser$ = data;
					 console.log(observableUser$);
				 }
			 );
		 }
		      this.afstore.collection('adduserstogrp', ref => ref.where('grpname', '==', grpName).where( 'uid', '==', uid)).get()
       
      var db = this.afstore.firestore; 
      db.collection("adduserstogrp").where('grpname', '==', grpName).where( 'uid', '==', uid).get()
      .then(function(ref) {
        ref.forEach(function (doc) {
          console.log("adduserstogrp "+ doc.id)
          db.collection("adduserstogrp").doc(doc.id).update({status: "Active"});    
        })
      })
	 }
  async groupdetail(groupname:string){
    
    let navigationExtras: NavigationExtras = {
      state: {
        groupname:groupname
      }
    };

    this.router.navigate(['/groupdetailspage'],navigationExtras)
  }


	getPendingDetails(grpName): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('grpname', '==', grpName).where( 'status', '==', 'Pending')).valueChanges();
	}
	getUserInfo(firstName): Observable<any> {
		return this.afstore.collection('users', ref => ref.where('firstName', '==', firstName)).valueChanges();
	}
	async cancel() {
		this.router.navigate(['/home']);
	}
	
}
