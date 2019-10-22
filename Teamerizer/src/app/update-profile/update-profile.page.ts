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

      


    }


  ngOnInit() {
  }
  
  

  async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
      buttons: ['OK']
      
		})

    await alert.present()
	}

  async updateProfile(){
    this.busy = true

      
    
      //await this.user.updatefirstName(this.firstName)
			this.mainuser.update({
        firstName: this.firstName,
       lastName: this.lastName, 
        skills: this.skills, 
        skillLevel:this.skillLevel
        


        
			})
		


    if(this.newpassword){
        await this.user.updatePassword(this.newpassword)
    }


    this.password = ""
    this.newpassword = ""
		this.busy = false
		await this.presentAlert('Done!', 'Your profile was updated!')

		this.router.navigate(['/home'])




  }

  async cancel(){
    this.router.navigate(['/home'])
  }

}
