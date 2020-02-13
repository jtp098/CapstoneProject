import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    mainuser: AngularFirestoreDocument
    team$;
    teamName$;
    allGroupListData$;
    group$;
    adminId$;
    adminIds$ = [];
    adminUser$ = [];
    zip$ = [];
    zip2$ = [];
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

    this.afAuth.authState.subscribe(user => {
      if(user){

        //method uses collection, adduserstogrp
        this.getAllGroupsUserIsIn(user.uid).subscribe(data => {
          console.log("Group List Data:", data);
          this.team$ = data;
          console.log(data[0].grpname);
    
          //method uses collection, groupList to set admin ids
          this.getAllGroupListData().subscribe(adminData => {
            this.allGroupListData$ = adminData;
            for (let i = 0; i < adminData.length; i++) {
              for(let j = 0; j < this.team$.length; j++) {
                if(adminData[i].groupname === this.team$[j].grpname) {
                  this.teamName$ = adminData[i].groupname;
                  this.adminId$ = adminData[i].createdBy;
                  console.log("admin id: " + this.adminId$);
                  this.adminIds$.push(this.adminId$);

                  /*this.zip2$ = this.allGroupListData$.map(o => {
                    return { team: o.groupname, admin: o.createdBy};
                  });*/
        
                    //console.log("Admin Id Map: " + this.zip2$);

                  //method uses collection, users. Call function to get all admin users
                  this.getGroupAdminUser(this.adminId$).subscribe(data => {
                    this.adminUser$.push(data);
                    console.log("Admin Users " + this.adminUser$);

                    this.zip$ = this.adminUser$.map((x, i) => {
                      //for(j = 0; j < this.adminIds$.length; j++) {
                        //if(this.adminId$ === x[0].uid) {
                          console.log("true!");
                          console.log(x[0].firstName);
                          return  [x[0].firstName, this.team$[i].grpname]
                        //}
                      //}
                    });
          
                    //console.log("Admin Id Map: " + this.zip$);
                  });
                }
              }
            }
            console.log(this.adminIds$);

          });

        });
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

  getAllGroupsUserIsIn(uid): Observable<any> {
    return this.afs.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid)).valueChanges()
  }

  getAllGroupListData(): Observable<any> {
    return this.afs.collection<any>('grouplist').valueChanges()
  }

  getGroupAdminUser(adminId): Observable<any> {
    return this.afs.collection<any>('users', ref => ref.where('uid', '==', adminId)).valueChanges()
  }
  

  async cancel(){
    this.router.navigate(['/home'])
  }

}
