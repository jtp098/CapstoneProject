import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

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
    
    uid: string;

    selectedSkill = [];
    selectedLevel = [];
data: any;
selectedGrpName: any;
  constructor(private afs: AngularFirestore, private user: UserService, private router: Router, 
    private afAuth: AngularFireAuth, private route: ActivatedRoute,private navCtrl: NavController) {
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
      this.uid=event.uid
      console.log(this.selectedSkill);
    })
  }

  async addToGroup(user) {
    console.log(user + "Users");
    let observableUser$ = null;
    try {
      this.afs.collection('users', ref => ref.where('uid', '==', user)).valueChanges().subscribe((data) => {
        observableUser$ = data;
        this.userinfo$=observableUser$;
        console.log(this.userinfo$[0]);
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

}
