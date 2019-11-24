import { Component, OnInit } from '@angular/core';
import { AngularFirestore,AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  skill = '';
  selected = ['', '', ''];

  mainuser: AngularFirestoreDocument

    firstname: string
    lastname: string
    skillType: string
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
    public user: UserService,
    private pickerCtrl: PickerController) { 
      this.mainuser = afs.doc(`users/${user.getUID()}`)
      this.sub = this.mainuser.valueChanges().subscribe(event => {
        this.username = event.username
        this.firstname = event.firstName
        this.lastname = event.lastName
        this.skillType = event.skillType
        this.skillLevel = event.skillLevel

      })

    }

  ngOnInit() {
  }

  ngOnDestroy() {
		//this.sub.unsubscribe()
  }

  async showAdvancedPicker() {
    let opts: PickerOptions = {
      cssClass: 'academy-picker',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done',
          cssClass: 'special-done'
        }
      ],
      columns: [ 
        {
          name: 'skillType',
          options: [
            { text: 'Angular', value: 'Angular' },
            { text: 'Vue', value: 'Vue' },
            { text: 'React', value: 'React' }
          ]
        },
        {
          name: 'skillLevel',
          options: [
            { text: 'Beginner', value: 'Beginner' },
            { text: 'Intermediate', value: 'Intermediate' },
            { text: 'Advanced', value: 'Advanced' }
          ]
        }
      ]
    };

    let picker = await this.pickerCtrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data => {
      let skillType = await picker.getColumn('skillType');
      let skillLevel = await picker.getColumn('skillLevel');
      console.log('col: ', skillType);
      this.selected = [
        skillType.options[skillType.selectedIndex].value,
        skillLevel.options[skillLevel.selectedIndex].value
      ]
    });

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
        skillType: this.selected[0], 
        skillLevel:this.selected[1]
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
