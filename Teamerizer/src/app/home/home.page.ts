import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router,NavigationExtras } from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public groupList: any[];
  uid: string;
  group$;
  groupname:string;
  selectedGrpName:any;
  grouptf;
  userInvites = [];
  userGroups$;
  constructor(public afstore: AngularFirestore,public menu: MenuController, private fireStore: AngularFirestore,public router: Router, public afAuth: AngularFireAuth ) {

  }
 
  ngOnInit() {
    this.menu.enable(true);

    this.afAuth.authState.subscribe(user => {
      if(user){
        this.getAllGroupsCreatedByCurrentUser(user.uid).subscribe(data => {
          console.log("Group List Data:", data);
          this.group$ = data;
          if(this.group$.length === 0){
            this.grouptf = true;
          }
          this.uid = user.uid;
          console.log("UserID1",user.uid);

          this.getPendingInvites(user.uid).subscribe(data => {
            this.userInvites = data;
            console.log("Pending",data);
          });


        });
        //Getting all groups that user is part of
        this.getAllGroupsCurrentUserIsIn(user.uid).subscribe(data => {
          this.userGroups$ = data;
          console.log("Active",data);
        });
      }
    });

    this.fireStore.collection('grouplist').valueChanges().subscribe(groupList => {
      this.groupList = groupList;
      if (groupList.length > 0){
        this.grouptf = false;
      }
    })
   
    

  }

  getPendingInvites(uid): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid).where( 'status', '==', 'Pending')).valueChanges();
	}
  getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
    return this.fireStore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges()
}

getAllGroupsCurrentUserIsIn(uid): Observable<any> {
  return this.fireStore.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid).where( 'status', '==', 'Active')).valueChanges();
}

 


  async createGroup(){
    this.router.navigate(['/group-creation'])
  }

  async groupdetail(groupname:string,uid:string){
    
    let navigationExtras: NavigationExtras = {
      state: {
        groupname:groupname,
        uid:uid
      }
    };

    this.router.navigate(['/groupdetailspage'],navigationExtras)
  }

  async pendingInvites(uid:string){
    
    let navigationExtras: NavigationExtras = {
      state: {
        uid:uid
      }
    };

    this.router.navigate(['/pending-invites'],navigationExtras)
  }



}
