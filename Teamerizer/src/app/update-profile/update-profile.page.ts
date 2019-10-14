import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore,AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  /**@ViewChild('filebtn') filebtn: {
    nativeElement: HTMLInputElement
  }**/

  mainuser: AngularFirestoreDocument
    sub
    firstName: string
    lastName: string
    skills: string
    skillLevel: string
    username: string

    password: string
    newpassword: string
    busy: boolean = false


  constructor(
    public afstore: AngularFirestore,
    private afs: AngularFirestore,
		private alertController: AlertController,
    private router: Router,
    public user: UserService) { 
      this.mainuser = afs.doc(`users/${user.getUID()}`)
      this.sub = this.mainuser.valueChanges().subscribe(event => {
        this.firstName = event.firstName
        this.lastName = event.lastName
        this.skills = event.skills
        this.skillLevel = event.skills
         
      })
    }


  ngOnInit() {
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe()

  }

  async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['OK']
		})

		await alert.present()
  }
  /**updateProfilePic(){
    this.filebtn.nativeElement.click()
  }
  uploadPic(event){
     const files = event.target.files
     
     const data = new FormData()
     data.append('file', files[0])
  }**/

  async updateProfile(){
    this.busy = true

    
		if(this.username !== this.user.getUsername()) {
			await this.user.updateEmail(this.username)
			this.mainuser.set({
				username: this.username
			})
    }
    if(!this.password){
      this.busy = false
      return this.presentAlert('Error!','You have to enter a password')
    }
    try{
      await this.user.reAuth(this.user.getUsername(),this.password)
    } catch(error){
      this.busy = false
      return this.presentAlert('Error!', 'Wrong password!')
    }


    if(this.newpassword){
        await this.user.updatePassword(this.newpassword)
    }


    this.password = ""
    this.newpassword = ""
		this.busy = false
		await this.presentAlert('Done!', 'Your profile was updated!')

		this.router.navigate(['/home'])




  }

}
