import { Component, OnInit } from '@angular/core';
import { AngularFirestore,AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {

  mainuser: AngularFirestoreDocument

    firstName: string
    lastName: string
    skills: string
    skillLevel: string
    username: string
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

      
		if(this.firstName !== this.user.getUsername()) {
			await this.user.updateEmail(this.firstName)
			this.mainuser.set({
				firstName: this.firstName
			})
		}


		this.busy = false

		await this.presentAlert('Done!', 'Your profile was updated!')

		this.router.navigate(['/home'])




  }

}
