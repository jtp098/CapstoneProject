import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { ProfilePage } from "../profile/profile.page";
import { Observable } from 'rxjs';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.page.html',
  styleUrls: ['./member-details.page.scss'],
})
export class MemberDetailsPage implements OnInit {
  mainuser: AngularFirestoreDocument

    username:string
    firstname:string
    lastname:string
    skillType:string
    skillLevel:string
    interests:string
    sub
    userinfo$ :any[];
    status: string
  profilePage: any
    uid: string;
    selectedSkill = [];
    selectedLevel = [];
data: any;
selectedGrpName: any;
 grpsPartOf$: any [ ];
  constructor(private afs: AngularFirestore, private user: UserService, private router: Router, private afAuth: AngularFireAuth, private route: ActivatedRoute,private navCtrl: NavController,public alertController: AlertController, private emailComposer: EmailComposer) {
    this.profilePage = new ProfilePage(afs, user , router , afAuth, emailComposer );
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.data = this.router.getCurrentNavigation().extras.state.user;
          this.selectedGrpName = this.router.getCurrentNavigation().extras.state.groupname;
          console.log("passedData",this.data);
          console.log("passedData",this.selectedGrpName);
        }
      });
      
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


  }

  setUserProfileData(){
    this.mainuser = this.afs.doc(`users/${this.data}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.username = event.username
      this.firstname = event.firstName
      this.lastname = event.lastName
      this.selectedSkill = event.skillType
      this.selectedLevel = event.skillLevel
      this.interests=event.interests
      this.uid= event.uid
      console.log(this.selectedSkill);
      console.log(this.uid, this.profilePage)
      this.profilePage.getUserPartOfOther(this.uid);
      console.log( this.profilePage.zip$);
    })
  }

  async addToGroup(user) {
    console.log(user + "Users");
    let observableUser$ = null;
    let inPendingGroupData$ = null;
		let inActiveGroupData$ = null;
		let inAdminInGroupData$ = null;
		let isPendingInGroup;
		let isActiveInGroup;
		let isInAdminInGroup;
    try {
      this.afs.collection('users', ref => ref.where('uid', '==', user)).valueChanges().subscribe((data) => {
        observableUser$ = data;
        this.userinfo$=observableUser$;
        console.log(this.userinfo$[0]);
      });
      //CP-78-JP-3/19/2020:This method is used to check if user is pending
			this.afs.collection('adduserstogrp', ref => ref
      .where('grpname', '==', this.selectedGrpName)
      .where('uid', '==', user)
      .where('status', '==', 'Pending')
    ).valueChanges().subscribe((data) => {
      console.log("Is user in pending group:", data);
      inPendingGroupData$ = data;
      console.log("Is user in pending group:", inPendingGroupData$[0]);
      if (inPendingGroupData$.length === 0) {
        isPendingInGroup = false;
      } else {
        isPendingInGroup = true;

      }
      console.log("Is pending boolen value" + isPendingInGroup)
    });

    //CP-78-JP-3/19/2020:This method is used to check if user is active in group
    this.afs.collection('adduserstogrp', ref => ref
      .where('grpname', '==', this.selectedGrpName)
      .where('uid', '==', user)
      .where('status', '==', 'Active')
    ).valueChanges().subscribe((data) => {
      console.log("Is user in active group:", data);
      inActiveGroupData$ = data;
      console.log("Is user in active group:", inActiveGroupData$[0]);
      if (inActiveGroupData$.length === 0) {
        isActiveInGroup = false;
      } else {
        isActiveInGroup = true;

      }
      console.log("Is pending boolen value" + isActiveInGroup)
    });
    //CP-78-JP-3/19/2020:This method is used to check if user is admin
    this.afs.collection('grouplist', ref => ref
      .where('groupname', '==', this.selectedGrpName)
      .where('createdBy', '==', user)
    ).valueChanges().subscribe((data) => {
      console.log("Is user in admin group:", data);
      inAdminInGroupData$ = data;
      console.log("Is user in admin group:", inAdminInGroupData$[0]);
      if (inAdminInGroupData$.length === 0) {
        isInAdminInGroup = false;
      } else {
        isInAdminInGroup = true;

      }
      console.log("Is pending boolen value" + isActiveInGroup)

    });


    } finally {
      await this.delay(2000);
      console.log("Fianl"+observableUser$);
      //debugger;
      this.afs.collection('users', ref => ref.where('uid', '==', user)).valueChanges().subscribe((data) => {
          observableUser$ = data;
          console.log(observableUser$);
        }
      );
    }

    for(var userinfoobs$ in this.userinfo$) {
      if (isPendingInGroup) {
				this.presentAlert('Opps', 'Looks like this user is already invited')
				console.log("User is pending IF");
			} else if (isActiveInGroup) {
				this.presentAlert('Opps', 'Looks like this user is already in the group')
				console.log("User is  in group IF");
			} else if (isInAdminInGroup) {
				this.presentAlert('Opps', 'You can not invite yourself')
				console.log("User is  in admin in group IF");
			}
			else {
      console.log(this.userinfo$[userinfoobs$].firstName+""+this.userinfo$[userinfoobs$].lastName)
      this.afs.collection('adduserstogrp').add({
        firstName: this.userinfo$[userinfoobs$].firstName,
        lastName: this.userinfo$[userinfoobs$].lastName,
        skillLevel: this.userinfo$[userinfoobs$].skillLevel,
        skillType: this.userinfo$[userinfoobs$].skillType,
        grpname: this.selectedGrpName,
        addflag: true,
        uid: user,
        status: "Pending"
      })
    }
    }

    this.afs.collection('adduserstogrp', ref => ref.where('uid', '==', user)).valueChanges().subscribe(data => {
      console.log(data.length>1);
   });
  }

  delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}

  goBack() {
    this.navCtrl.back();
    }

  back(){
    this.router.navigate(['/group-creation'])
  }

  //CP-25-JP-2/23/2020:Checking if current user is in the group so that they can leave the group. 
	isUserInGroup(uid, grpName): Observable<any> {
		return this.afs.collection<any>('adduserstogrp', ref => ref
			.where('grpname', '==', grpName)
			.where('status', '==', 'Active')
			.where('uid', '==', uid)).valueChanges({ idField: 'DocID' });
  }

  //CP-78 - 3/21/2020 - Alert for members already in group 
	async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['Ok']
		})
		await alert.present();
	}
  
  
}
