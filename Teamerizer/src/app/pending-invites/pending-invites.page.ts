import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AngularFirestore,AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import { UserService } from '../user.service';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import {forEach} from "@angular-devkit/schematics";


@Component({
  selector: 'app-pending-invites',
  templateUrl: './pending-invites.page.html',
  styleUrls: ['./pending-invites.page.scss'],
})
export class PendingInvitesPage implements OnInit {
	public userList: any[];
	public loadedUserList: any[];
	userinfo$ :any[];
	selectedGrpName:any;
	groupUsers = [];
  groupUsersPending = [];
  pendingList$ = [];


	sliderConfig = {
		spaceBetween: 10,
		centeredSlides: true,
		slidesPerView: 1.8
	}

	uid: string;
	selectedName;
	group$;
	grouponSelectedname$;
	grouponSelectednamePending$;
  grouplist: any;
  userInvites = [];
  userRequests = [];
  mainuser: AngularFirestoreDocument
	constructor(private navCtrl: NavController,
				public afstore: AngularFirestore,
				public afAuth: AngularFireAuth,
				public alertController: AlertController,
				private userService: UserService,
				private router: Router,
				private route: ActivatedRoute
	) {
		this.route.queryParams.subscribe(params => {
			if (this.router.getCurrentNavigation().extras.state) {
			  
			  this.uid = this.router.getCurrentNavigation().extras.state.uid;
			  
			  console.log("passedData",this.uid);
			}else{
				console.log("no Extras")
			}
		  });
		  

	}

	ngOnInit() {
		this.afAuth.authState.subscribe(user => {
			if(user){
				this.getPendingInvites(user.uid).subscribe(data => {
         		this.userInvites = data;
          		this.pendingList$ =data;
          		console.log("Pending",data);
				});


				this.getRequests(user.uid).subscribe(data => {
					this.userRequests = data;
				
					console.log("requested",data);
					console.log("Pending with Requested added",this.userRequests);
			 
				  }); 

			}
		});
		

  }
  getPendingInvites(uid): Observable<any> {
    console.log("UID",uid);
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('uid', '==', uid).where( 'status', '==', 'Pending')).valueChanges({ idField: 'DocID' });
	}

	openDetailsWithState(firstName: string) {
		let navigationExtras: NavigationExtras = {
			state: {
				user: firstName,
				groupname:this.selectedGrpName
			}
		};
		this.router.navigate(['/member-details'], navigationExtras);
	}

	 delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
  }
  //user accepts and this sets the status to active
	 async Accept(DocID) {
		var db = this.afstore.firestore;
		db.collection("adduserstogrp").doc(DocID).update({status: "Active"});
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


	getPendingDetails(grpName): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('grpname', '==', grpName).where( 'status', '==', 'Pending')).valueChanges({ idField: 'DocID' });
	}
	getUserInfo(firstName): Observable<any> {
		return this.afstore.collection('users', ref => ref.where('firstName', '==', firstName)).valueChanges();
	}
	async cancel() {
		this.router.navigate(['/home']);
	}

	//cp-81 - 4/5/2020 - Request to be in group - Get requests
	getRequests(uid): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('groupCreator', '==', uid).where( 'status', '==', 'Requested')).valueChanges({ idField: 'DocID' });
		
	  }

	  //CP-80-RH-3/31/2020 Decline/delete function is completed
	 async decline(DocID) {
		var db = this.afstore.firestore;
		db.collection("adduserstogrp").doc(DocID).delete();
	 }
}
