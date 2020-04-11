import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router,NavigationExtras } from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import { delay } from 'rxjs/operators';
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
  userRequests = [];
  pendingUserInvites = [];
  userGroups$;
  notification = 0;
  public loadedTeamList: any[];
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
          console.log("User UID",this.uid);
          //Gets A list of pending inivtes for the user so this can be used for the notifications 
          this.getPendingInvites(user.uid).subscribe(data => {
           this.userInvites = data;
            this.pendingUserInvites[0] = this.userInvites[0];
            console.log("Pending",this.userInvites);
            this.notification = this.notification + this.userInvites.length;
            console.log("Pending invites",this.pendingUserInvites);
          });


        });
        //Getting all groups that user is part of
        this.getAllGroupsCurrentUserIsIn(user.uid).subscribe(data => {
          this.userGroups$ = data;
          console.log("Active",data);
        });

        //CP-81 - Amending User invite list with requested invites
        
      this.getRequests(user.uid).subscribe(data => {
        this.userRequests = data;
        console.log("requested",this.userRequests);
        this.notification = this.notification + this.userRequests.length;
        console.log("Notification Length",this.notification);
      }); 

     
     
      }
    });

    this.fireStore.collection('grouplist').valueChanges().subscribe(groupList => {
      this.groupList = groupList;
      this.loadedTeamList =groupList
      if (groupList.length > 0){
        this.grouptf = false;
      }
    })
   
    

  }

  getPendingInvites(uid): Observable<any> {
    return this.afstore.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid).where( 'status', '==', 'Pending')).valueChanges();
    //where( 'status', '==', 'Pending')
	}
  getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
    return this.fireStore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges({idField:'DocID'});
}

getAllGroupsCurrentUserIsIn(uid): Observable<any> {
  return this.fireStore.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid).where( 'status', '==', 'Active')).valueChanges();
}

 


  async createGroup(){
    this.router.navigate(['/group-creation'])
  }

  async groupdetail(groupname:string,desc:string,DocID:string){
    
    let navigationExtras: NavigationExtras = {
      state: {
        groupname:groupname,
        desc: desc,
        DocID : DocID,
        uid:this.uid
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

  //CP-55 - Search Teams
	intializeItems(): void {
		this.groupList = this.loadedTeamList;

	}

	filterList(evt) {
		this.intializeItems();

		const searchTerm = evt.srcElement.value;

		if (!searchTerm) {
			return;
		}

		this.groupList = this.groupList.filter(currentUser => {
			if (currentUser.groupname && searchTerm) {
				if (currentUser.groupname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
					return true;
				}
				return false;
			}
    });
  }

//CP-81 - 4/5/2020
getRequests(uid): Observable<any> {
  return this.afstore.collection<any>('adduserstogrp', ref => ref.where('groupCreator', '==', uid).where( 'status', '==', 'Requested')).valueChanges();
  
}

}
