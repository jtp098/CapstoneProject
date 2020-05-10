import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router,NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {Observable} from "rxjs";
import { underline } from '@angular-devkit/core/src/terminal';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

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
    adminInfo$ = [];
    adminInfoMul$ ;
    admincount= 0;
    adminEmail;
    zip$ = [];
    zip2$ = [];
    username:string
    firstname:string
    lastname:string
    skillType:string
    skillLevel:string
    interests:string
    sub
    uid;
    groupname;
    ImageData$;
    hasImage;

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
                console.log("user image data:", user.uid);
                this.getUserImage(user.uid).subscribe(data => {
					console.log("user image data:", data);
                    this.ImageData$ = data;
                    if (this.ImageData$.length === 0) {
                        this.hasImage = true;
                    } else{
                        this.hasImage = false;
                    }
				});
                //method uses collection, adduserstogrp
                this.getUserPartOfOther(user.uid);
            }
        });
    }
    //methods
    getUserPartOfOther(uid) {
        this.getAllGroupsUserIsIn(uid).subscribe(data => {
            console.log("Group List Data:", data);
            this.team$ = data;
            //Bug Fix - CP-77 - JP- 2/24/2019 - Checking the length of the data before executing the code
            this.uid = uid;
            if(this.team$.length === 0) {
                console.log("no group");
            }else {
                console.log(data[0].grpname);

                //method uses collection, groupList
                this.getAllGroupListData().subscribe(adminData => {
                    this.allGroupListData$ = adminData;
                    for (let i = 0; i < adminData.length; i++) {
                        for(let j = 0; j < this.team$.length; j++) {
                            if(adminData[i].groupname === this.team$[j].grpname) {
                                this.teamName$ = adminData[i].groupname;
                                this.adminId$ = adminData[i].createdBy;
                                console.log("admin id: " + this.adminId$);
                                this.adminIds$.push(this.adminId$);
                                this.zip2$ = this.allGroupListData$.map(o => {
                                    return [{ team: o.groupname, admin: o.createdBy}];
                                });
                                //method uses collection, users
                                //make sure it executes only one..
                                this.getAdminGrpById(this.adminId$);
                                console.log(this.adminId$);
                                this.getGroupAdminUser(this.adminId$).subscribe(data => {
                                    this.adminUser$.push(data);
                                    this.adminUser$.map((x, i) => {
                                        for ( let k = 0; k < this.adminInfo$.length; k++) {
                                            if(x[0].uid === this.adminIds$[k]){
                                                //condition  to remove duplicate grpname
                                                if(k === this.admincount){
                                                    this.admincount++;
                                                    //Bug Fix - CP-71 - VG- 03/30/2020 - Looping Over multiple froups created by admin and remove duplicates if any.
                                                    for(let m=0;m<this.adminInfo$[k].length;m++){
                                                        if(k === m||this.adminInfo$[k].length==1){
                                                            this.zip$.push( [{ firstname: x[0].firstName, lastname: x[0].lastName,  grpname: (this.adminInfo$[k])[m].groupname }]);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    }

                });

            }


        });
    }

    getAdminGrpById(uid): any[] {
        this.getAdminGrpName(uid).subscribe(data  => {
            this.adminInfoMul$ = data ;
            this.adminInfo$.push(this.adminInfoMul$);
            console.log(this.adminInfo$);
        });
        return this.adminInfo$;
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

//3/23/2020 - Updated to pull on active groups back
    getAllGroupsUserIsIn(uid): Observable<any> {
        return this.afs.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid).where('status','==', 'Active')).valueChanges()
    }

    getAllGroupListData(): Observable<any> {
        return this.afs.collection<any>('grouplist').valueChanges()
    }
    getAdminGrpName(createdBy): Observable<any> {
        return this.afs.collection<any>('grouplist', ref => ref.where('createdBy', '==', createdBy)).valueChanges()
    }
    getGroupAdminUser(adminId): Observable<any> {
        return this.afs.collection<any>('users', ref => ref.where('uid', '==', adminId)).valueChanges()
    }

    getGroupAdminUserDetails(adminId): Observable<any> {
        return this.afs.collection<any>('adduserstogrp', ref => ref.where('uid', '==', adminId)).valueChanges()
    }


    async UpdateProfilePicture(uid:string){
    
        let navigationExtras: NavigationExtras = {
          state: {
            uid:this.uid
          }
        };
    
        this.router.navigate(['/img-uploader'],navigationExtras)
      }
      //JP - 3/24/2020 - Pulls back images by user
      getUserImage(uid): Observable<any> {
        return this.afs.collection<any>('TeamerizerImages', ref => ref.where('uid', '==', uid)).valueChanges()
    }   

    async cancel(){
        this.router.navigate(['/home'])
    }
    resetPassword() {
        this.router.navigate(['/passwordreset']);
    }

}
