import { Component, OnInit } from '@angular/core';
import { AngularFirestore,AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FireStoreFetchService } from '../fire-store-fetch.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  

  mainuser: AngularFirestoreDocument

    firstname: string
    lastname: string
    skillType: string
    skillLevel: string
    username: string
    busy: boolean = false
    password: string
    newpassword: string
    sub;
    allSkills: any;
    allSkillLevels: any;
    skill = '';
    selectedSkill = [];
    selectedLevel = [];

  constructor(
    public afstore: AngularFirestore,
    private afs: AngularFirestore,
		private alertController: AlertController,
    private router: Router,
    public user: UserService,
    private pickerCtrl: PickerController,
    private afAuth: AngularFireAuth,
    public firestoreFetchService: FireStoreFetchService) { 
      

    }

  ngOnInit() {
    let self = this;
    this.afAuth.auth.onAuthStateChanged(function(user) {
      console.log("User",user);
      if (user) {
        self.setUserProfileData();
      } else {
        
      }
    });

    this.firestoreFetchService.getSkills().subscribe((data) => {
      console.log("All Skills :",data);
      this.allSkills = data;
    });

    this.firestoreFetchService.getSkillLevels().subscribe((data) => {
      console.log("All Levels :",data);
      this.allSkillLevels = data;
    });
  }

  setUserProfileData(){
    this.mainuser = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.username = event.username
      this.firstname = event.firstName
      this.lastname = event.lastName
      this.selectedSkill = event.skillType
      this.selectedLevel = event.skillLevel
    })
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
          cssClass: 'special-done',
          handler: (value : any): void => {
            console.log(value, 'ok');

            this.selectedSkill.push(value.skillType);
            this.selectedLevel.push(value.skillLevel);
          } 
        }
      ],
      columns: [ 
        {
          name: 'skillType',
          options: this.allSkills
        },
        {
          name: 'skillLevel',
          options: this.allSkillLevels
        }
      ]
    };

    let picker = await this.pickerCtrl.create(opts);
    picker.present();
    
    // picker.onDidDismiss().then(async data => {
    //   let skillType = await picker.getColumn('skillType');
    //   let skillLevel = await picker.getColumn('skillLevel');
    //   console.log('col: ', skillType);
    //   this.selectedSkill.push(skillType.options[skillType.selectedIndex]);
    //   this.selectedLevel.push(skillLevel.options[skillLevel.selectedIndex]);
    // });

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
        skillType: this.selectedSkill, 
        skillLevel:this.selectedLevel
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

  deleteSkill(i){
    this.selectedSkill.splice(i,1);
    this.selectedLevel.splice(i,1);
  }

  async cancel(){
    this.router.navigate(['/home'])
  }

}
