import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    mainuser: AngularFirestoreDocument
    
    username:string
    firstname:string
    lastname:string
    skillType:string
    skillLevel:string
    interests:string
    sub

    selectedSkill = [];
    selectedLevel = [];



    constructor(private afs: AngularFirestore, private user: UserService, private router: Router, 
      private afAuth: AngularFireAuth) {
     
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
    this.mainuser = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.username = event.username
      this.firstname = event.firstName
      this.lastname = event.lastName
      this.selectedSkill = event.skillType
      this.selectedLevel = event.skillLevel
      this.interests =event.interests
      console.log(this.selectedSkill);
    })
  }

  updateProfile(){
    this.router.navigate(['/update-profile'])
  }

  async cancel(){
    this.router.navigate(['/home'])
  }

}
