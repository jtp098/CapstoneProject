import { Component, OnInit } from '@angular/core';
import { AngularFirestore,AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {

  mainuser: AngularFirestoreDocument

    firstname: string
    lastname: string
    skills: string
    skillLevel: string
    username: string
    busy: boolean = false
    password: string
    newpassword: string
    sub

  constructor(
    public afstore: AngularFirestore,
    private afs: AngularFirestore,
		private alertController: AlertController,
    private router: Router,
    public user: UserService) { 
      this.mainuser = afs.doc(`users/${user.getUID()}`)
      this.sub = this.mainuser.valueChanges().subscribe(event => {
        this.username = event.username
        this.firstname = event.firstName
        this.lastname = event.lastName
        this.skills = event.skills
        this.skillLevel = event.skillLevel

        })

      


    }

  ngOnInit() {
  }

  ngOnDestroy() {
		//this.sub.unsubscribe()
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
        
      

        firstName: this.firstname,
       lastName: this.lastname, 
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
