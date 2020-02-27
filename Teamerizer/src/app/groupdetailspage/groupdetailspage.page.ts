import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
	selector: 'app-groupdetailspage',
	templateUrl: './groupdetailspage.page.html',
	styleUrls: ['./groupdetailspage.page.scss'],
})
export class GroupdetailspagePage implements OnInit {
	@ViewChild('groupDesc') groupDescInput;
	public userList: any[];
	public loadedUserList: any[];
	userinfo$ :any[];
	selectedGrpName:any;
	selectedGrpDesc:any;
	selectedGrpDocID:any;
	uidPassed:any;
	groupUsers = [];
	groupUsersPending = [];


	sliderConfig = {
		spaceBetween: 10,
		centeredSlides: true,
		slidesPerView: 1.8
	}
	mainuser: AngularFirestoreDocument;
	ref: string;
	uid: string;
	groupUserID: string;
	selectedName;
	group$;
	grouponSelectedname$;
	grouponSelectednamePending$
	grouplist: any;
	adminCheck$;
	isadmin;
	inGroupData$;
	isInGroup;
	docID;
	isEditGroupDetail = false;
	editIcon = 'create';
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
			  
			  this.selectedGrpName = this.router.getCurrentNavigation().extras.state.groupname;
			  this.uidPassed = this.router.getCurrentNavigation().extras.state.uid;
			  this.selectedGrpDesc = this.router.getCurrentNavigation().extras.state.desc;
			  this.selectedGrpDocID = this.router.getCurrentNavigation().extras.state.DocID;
			  console.log("passedData",this.selectedGrpName, this.uidPassed);
			}else{
				console.log("no Extras")
			}
		  });
		  

	}

	ngOnInit() {
		this.afAuth.authState.subscribe(user => {
			if(user){
				this.getAllGroupsCreatedByCurrentUser(user.uid).subscribe(data => {
					console.log("Group List Data:", data);
					this.group$ = data;
				});
			}
		});
		

		//this.groupUsers = this.userService.getGroupUsers();

		this.getDetails(this.selectedGrpName).subscribe(data => {
			this.grouponSelectedname$ = data;
			this.groupUsers = data;
			console.log("Members",data);
		});
		this.getPendingDetails(this.selectedGrpName).subscribe(dataPending => {
			this.grouponSelectednamePending$ = dataPending;
			this.groupUsersPending = dataPending;
			console.log("Pending Members",dataPending);
		});
		//CP-25-JP-2/23/2020:Checking is the current user created the group, if they did they can add members
		this.isAdmin(this.uidPassed, this.selectedGrpName).subscribe(data =>{
			console.log("Admin Data:", data);
			this.adminCheck$=data;
			if(this.adminCheck$.length === 0){
				this.isadmin = false;
			}else{
		//CP-25-JP-2/23/2020:If the user is the admin, isadmin is set to true, this will display the adding people section and the below will populate with users.
				this.isadmin = true;
				this.afstore.collection('users').valueChanges().subscribe(userList => {
					this.userList = userList;
					this.loadedUserList = userList;
					console.log("userlist",userList);
				});
			}
		});
		//CP-25-JP-2/23/2020:Checking if the current user is in the group
		this.isUserInGroup(this.uidPassed, this.selectedGrpName).subscribe(data =>{
			console.log("Is user in group:", data);
			this.inGroupData$=data;
			if(this.inGroupData$.length === 0){
				this.isInGroup = false;
			}else{
		//CP-25-JP-2/23/2020:If the user is in the group, this is used to display the leave group button.
		//CP-25-JP-2/23/2020:Doc.ID is the document ID from FireBase, it can be used to delte a document. 
				this.isInGroup = true;
				this.docID = this.inGroupData$[0].DocID;
				console.log("DocID", this.docID);
			}
		});



	}
	//CP-45-RH- now you can press on icon "create(pencil)" and it converts the description to edit mode
	//and then if you want to remove editing just press on "done-all (checkmarks)."
	editGroupDesc() {
		this.isEditGroupDetail = !this.isEditGroupDetail;
		if (this.isEditGroupDetail) {
			this.groupDescInput.setFocus();
			this.editIcon = "done-all";
		} else {
			this.editIcon = "create";
			let updateGroup = this.afstore.doc(`grouplist/${this.selectedGrpDocID}`)
			updateGroup.update({
				desc:this.selectedGrpDesc
			});
		}
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

	intializeItems(): void {
		this.userList = this.loadedUserList;
	}

	filterList(evt) {
		this.intializeItems();

		const searchTerm = evt.srcElement.value;

		if(!searchTerm) {
			return;
		}

		this.userList = this.userList.filter(currentUser => {
			if(currentUser.firstName && searchTerm) {
				if (currentUser.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
					return true;
				}
				return false;
			}
		});
	}
	 delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	 async addToGroup(user) {
		 console.log(user + "Users");
		 let observableUser$ = null;
		 try {
			 this.afstore.collection('users', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe((data) => {
				 observableUser$ = data;
				 console.log(data);
				 this.userinfo$=observableUser$;
				 console.log(this.userinfo$[0]);
			 });
		 } finally {
			 await this.delay(2000);
			 console.log("Fianl"+observableUser$);
			 //debugger;
			 this.afstore.collection('users', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe((data) => {
					 observableUser$ = data;
					 console.log(observableUser$);
				 }
			 );
		 }
		 for(var userinfoobs$ in this.userinfo$) {
			 
			 console.log(this.userinfo$[userinfoobs$].firstName+""+this.userinfo$[userinfoobs$].lastName)
			 this.afstore.collection('adduserstogrp').add({
				 firstName: this.userinfo$[userinfoobs$].firstName,
				 lastName: this.userinfo$[userinfoobs$].lastName,
				 skillLevel: this.userinfo$[userinfoobs$].skillLevel,
				 skillType: this.userinfo$[userinfoobs$].skillType,
				 grpname: this.selectedGrpName,
				 addflag: true,
				 uid: user.uid,
				 status: "Pending"
			 }).then( function(docref) {	  
				 console.log("reference" + docref.id)
			 });
		 }

		 
		 this.afstore.collection('adduserstogrp', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe(data => {
			 console.log(data.length>1);
			 if(data.length>0){
				this.removeList(user);
			 } });
	 }

	 
	async removeList(user){
		await this.delay(300);
		(this.userList).splice(this.userList.indexOf(user), 1);
	}

	groupDetailsDisplay(event) {
		this.selectedGrpName=event.target.value;
		console.log("selected" + event.target.value)
		this.getDetails(event.target.value).subscribe(data => {
			this.grouponSelectedname$ = data;
			this.groupUsers = data;
		});
	}

	getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
		return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges();
	}
	getDetails(grpName): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref
		.where('grpname', '==', grpName)
		.where( 'status', '==', 'Active')).valueChanges({idField:'DocID'});
	}
	getPendingDetails(grpName): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('grpname', '==', grpName).where( 'status', '==', 'Pending')).valueChanges();
	}
	getUserInfo(firstName): Observable<any> {
		return this.afstore.collection('users', ref => ref.where('firstName', '==', firstName)).valueChanges();
	}
	//CP-25-JP-2/23/2020:This section is used to verify is the current user created the group
	isAdmin(uid,grpName): Observable<any> {
		
		return this.afstore.collection<any>('grouplist', ref => ref.where('groupname', '==', grpName).where( 'createdBy', '==', uid)).valueChanges();
	}
	//CP-25-JP-2/23/2020:Checking if current user is in the group so that they can leave the group. 
	isUserInGroup(uid,grpName): Observable<any>{
		return this.afstore.collection<any>('adduserstogrp', ref => ref
		.where('grpname', '==', grpName)
		.where( 'status', '==', 'Active')
		.where('uid','==',uid)).valueChanges({idField:'DocID'});
	}
	//CP-45-RH-delete user document and delete user in general from the group
	async removeFromGroup(docID){
		this.afstore.doc("adduserstogrp/"+docID).delete();
		console.log("Removed From Group" ,docID);
	}
	//CP-25-JP-2/23/2020:This method is used to delte users from the group
	async leaveGroup(docID){
		this.afstore.doc("adduserstogrp/"+docID).delete();
		console.log("Left Group Executed" ,docID);
		this.router.navigate(['/home']);
	}
	async cancel() {
		this.router.navigate(['/home']);
	}
}
