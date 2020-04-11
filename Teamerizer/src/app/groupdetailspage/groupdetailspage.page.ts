import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { forEach } from "@angular-devkit/schematics";


@Component({
	selector: 'app-groupdetailspage',
	templateUrl: './groupdetailspage.page.html',
	styleUrls: ['./groupdetailspage.page.scss'],
})
export class GroupdetailspagePage implements OnInit {
	@ViewChild('groupDesc') groupDescInput;
	public userList: any[];
	public loadedUserList: any[];
	currentuser;
	userinfo$: any[];
	selectedGrpName: any;
	selectedGrpDesc: any;
	selectedGrpDocID: any;
	uidPassed: any;
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
	grouponSelectedname$ = [];
	grouponSelectednamePending$ = [];
	AdminUser$ = [];
	grouplist: any;
	status: string;
	adminCheck$;
	isadmin;
	inGroupData$;
	isInGroup;
	isInNotGroup = true;


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
				console.log("passedData", this.selectedGrpName, this.uidPassed);
			} else {
				console.log("no Extras")
			}
		});


	}

	ngOnInit() {
		this.afAuth.authState.subscribe(user => {
			if (user) {
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
			console.log("Members", data);
		});
		this.getPendingDetails(this.selectedGrpName).subscribe(dataPending => {
			this.grouponSelectednamePending$ = dataPending;
			this.groupUsersPending = dataPending;
			console.log("Pending Members", dataPending);
		});
		//CP-25-JP-2/23/2020:Checking is the current user created the group, if they did they can add members
		this.isAdmin(this.uidPassed, this.selectedGrpName).subscribe(data => {
			console.log("Admin Data:", data);
			this.adminCheck$ = data;
			if (this.adminCheck$.length === 0) {
				this.isadmin = false;
			} else {
				//CP-25-JP-2/23/2020:If the user is the admin, isadmin is set to true, this will display the adding people section and the below will populate with users.
				this.isadmin = true;
				this.isInNotGroup = false;
				this.afstore.collection('users').valueChanges().subscribe(userList => {
					this.userList = userList;
					this.loadedUserList = userList;
					console.log("userlist", userList);
					this.getAdminDetails(this.uidPassed).subscribe(dataPending => {
						this.AdminUser$ = dataPending;

						console.log("Admin Members", dataPending);

						this.removeAdmin(this.uidPassed);
						console.log("userlist new", userList);
					});

				});
			}
		});

		//CP-25-JP-2/23/2020:Checking if the current user is in the group
		this.isUserInGroup(this.uidPassed, this.selectedGrpName).subscribe(data => {
			console.log("Is user in group:", data);
			this.inGroupData$ = data;
			if (this.inGroupData$.length === 0) {
				this.isInGroup = false;
			} else {
				//CP-25-JP-2/23/2020:If the user is in the group, this is used to display the leave group button.
				//CP-25-JP-2/23/2020:Doc.ID is the document ID from FireBase, it can be used to delte a document. 
				this.isInGroup = true;
				this.isInNotGroup = false;
				this.docID = this.inGroupData$[0].DocID;
				console.log("DocID", this.docID);
			}
		});

	//CP-81 - 4/5/2020 - Member can request to be in group

		this.afstore.collection('users', ref => ref.where('uid', '==', this.uidPassed)).valueChanges().subscribe(currentuser => {
			this.currentuser = currentuser;
			
			console.log("currentuser", currentuser);
		

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
				desc: this.selectedGrpDesc
			});
		}
	}

	openDetailsWithState(firstName: string) {
		let navigationExtras: NavigationExtras = {
			state: {
				user: firstName,
				groupname: this.selectedGrpName
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

		if (!searchTerm) {
			return;
		}

		this.userList = this.userList.filter(currentUser => {
			if (currentUser.firstName && searchTerm) {
				if (currentUser.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
					return true;
				}
				return false;
			}
		});
	}
	delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
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
	
		//await this.delay(2000);
		try {
			this.afstore.collection('users', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe((data) => {
				observableUser$ = data;
				console.log(data);
				this.userinfo$ = observableUser$;
				console.log(this.userinfo$[0]);
			});
			//CP-78-JP-3/19/2020:This method is used to check if user is pending
			this.afstore.collection('adduserstogrp', ref => ref
				.where('grpname', '==', this.selectedGrpName)
				.where('uid', '==', user.uid)
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
			this.afstore.collection('adduserstogrp', ref => ref
				.where('grpname', '==', this.selectedGrpName)
				.where('uid', '==', user.uid)
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
			this.afstore.collection('grouplist', ref => ref
				.where('groupname', '==', this.selectedGrpName)
				.where('createdBy', '==', user.uid)
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
			await this.delay(200);
			console.log("Fianl" + observableUser$);
			//debugger;
			this.afstore.collection('users', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe((data) => {
				observableUser$ = data;
				console.log(observableUser$);
			}
			);
		}
		for (var userinfoobs$ in this.userinfo$) {
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
				console.log(this.userinfo$[userinfoobs$].firstName + "" + this.userinfo$[userinfoobs$].lastName)
				this.afstore.collection('adduserstogrp').add({
					firstName: this.userinfo$[userinfoobs$].firstName,
					lastName: this.userinfo$[userinfoobs$].lastName,
					skillLevel: this.userinfo$[userinfoobs$].skillLevel,
					skillType: this.userinfo$[userinfoobs$].skillType,
					grpname: this.selectedGrpName,
					desc: this.selectedGrpDesc,
					addflag: true,
					uid: user.uid,
					status: "Pending"
				}).then(function (docref) {
					console.log("reference" + docref.id)
				});

			}


		}

		this.afstore.collection('adduserstogrp', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe(data => {
			console.log(data.length > 1);
			if (data.length > 0) {
				this.removeList(user);
				console.log("user removed" + user)
			}
		});
	}


	async removeList(user) {
		await this.delay(300);
		(this.userList).splice(this.userList.indexOf(user), 1);
		console.log("remove user from list" + user);
	}
	async removeAdmin(user) {
		await this.delay(300);
		console.log("remove Admin user from list" + user);

		(this.userList).splice(this.userList.indexOf(user), 1);
		console.log("remove Admin user from list new list" + this.userList);

	}


	groupDetailsDisplay(event) {
		this.selectedGrpName = event.target.value;
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
			.where('status', '==', 'Active')).valueChanges({ idField: 'DocID' });
	}
	getPendingDetails(grpName): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('grpname', '==', grpName).where('status', '==', 'Pending')).valueChanges();
	}
	getAdminDetails(uid): Observable<any> {
		return this.afstore.collection<any>('users', ref => ref.where('uid', '==', uid)).valueChanges();
	}
	getUserInfo(firstName): Observable<any> {
		return this.afstore.collection('users', ref => ref.where('firstName', '==', firstName)).valueChanges();
	}
	//CP-25-JP-2/23/2020:This section is used to verify is the current user created the group
	isAdmin(uid, grpName): Observable<any> {

		return this.afstore.collection<any>('grouplist', ref => ref.where('groupname', '==', grpName).where('createdBy', '==', uid)).valueChanges();
	}
	//CP-25-JP-2/23/2020:Checking if current user is in the group so that they can leave the group. 
	isUserInGroup(uid, grpName): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref
			.where('grpname', '==', grpName)
			.where('status', '==', 'Active')
			.where('uid', '==', uid)).valueChanges({ idField: 'DocID' });
	}
	//CP-45-RH-delete user document and delete user in general from the group
	async removeFromGroup(docID) {
		this.afstore.doc("adduserstogrp/" + docID).delete();
		console.log("Removed From Group", docID);
	}
	//CP-25-JP-2/23/2020:This method is used to delte users from the group
	async leaveGroup(docID) {
		this.afstore.doc("adduserstogrp/" + docID).delete();
		console.log("Left Group Executed", docID);
		this.router.navigate(['/home']);
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
	//CP-81 - 4/5/2020 - Member can request to be in group
	async RequestToBeInGroup(user) {
		console.log(user + "Users");
		let observableUser$ = null;
		let inPendingGroupData$ = null;
		let inActiveGroupData$ = null;
		let inAdminInGroupData$ = null;
		let isPendingInGroup;
		let isActiveInGroup;
		let isInAdminInGroup;
		let isRequestedInGroup;
		let groupCreator;
	
		//await this.delay(2000);
		try {
			this.afstore.collection('users', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe((data) => {
				observableUser$ = data;
				console.log(data);
				this.userinfo$ = observableUser$;
				console.log(this.userinfo$[0]);
			});
			//CP-78-JP-3/19/2020:This method is used to check if user is pending
			this.afstore.collection('adduserstogrp', ref => ref
				.where('grpname', '==', this.selectedGrpName)
				.where('uid', '==', user.uid)
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

			//CP-81 - 4/5/2020This checks if user has already requested to be in group
			this.afstore.collection('adduserstogrp', ref => ref
				.where('grpname', '==', this.selectedGrpName)
				.where('uid', '==', user.uid)
				.where('status', '==', 'Requested')
			).valueChanges().subscribe((data) => {
				console.log("Is user in pending group:", data);
				inPendingGroupData$ = data;
				console.log("Is user in pending group:", inPendingGroupData$[0]);
				if (inPendingGroupData$.length === 0) {
					isRequestedInGroup = false;
				} else {
					isRequestedInGroup = true;

				}
				console.log("Is pending boolen value" + isPendingInGroup)
			});

			//CP-78-JP-3/19/2020:This method is used to check if user is active in group
			this.afstore.collection('adduserstogrp', ref => ref
				.where('grpname', '==', this.selectedGrpName)
				.where('uid', '==', user.uid)
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
			this.afstore.collection('grouplist', ref => ref
				.where('groupname', '==', this.selectedGrpName)
				.where('createdBy', '==', user.uid)
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

			//CP-81 - 4/5/2020 - This gets the group creator
			this.afstore.collection('grouplist', ref => ref
			.where('groupname', '==', this.selectedGrpName)
			//.where('createdBy', '==', user.uid)
		).valueChanges().subscribe((data) => {
			//console.log("Is user in admin group:", data);
			groupCreator = data;
			console.log("Group Creator", groupCreator);
			groupCreator = groupCreator[0].createdBy;
			console.log("Group Creator", groupCreator);

			
			

		});

		} finally {
			await this.delay(200);
			console.log("Fianl" + observableUser$);
			//debugger;
			this.afstore.collection('users', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe((data) => {
				observableUser$ = data;
				console.log(observableUser$);
			}
			);
		}
		for (var userinfoobs$ in this.userinfo$) {
			if (isPendingInGroup) {
				this.presentAlert('Opps', 'Looks like this user is already invited')
				console.log("User is pending IF");
			} 
			// else if (isActiveInGroup) {
			// 	this.presentAlert('Opps', 'Looks like this user is already in the group')
			// 	console.log("User is  in group IF");
			// } 
			else if (isInAdminInGroup) {
				this.presentAlert('Opps', 'You can not invite yourself')
				console.log("User is  in admin in group IF");
			}
			else if(isRequestedInGroup)
			{
				this.presentAlert('Opps', 'You already requested to be in the group')
				
			}
			else {
				console.log(this.userinfo$[userinfoobs$].firstName + "" + this.userinfo$[userinfoobs$].lastName)
				this.afstore.collection('adduserstogrp').add({
					firstName: this.userinfo$[userinfoobs$].firstName,
					lastName: this.userinfo$[userinfoobs$].lastName,
					skillLevel: this.userinfo$[userinfoobs$].skillLevel,
					skillType: this.userinfo$[userinfoobs$].skillType,
					grpname: this.selectedGrpName,
					desc: this.selectedGrpDesc,
					addflag: true,
					uid: user.uid,
					status: "Requested",
					groupCreator: groupCreator
				}).then(function (docref) {
					console.log("reference" + docref.id)
				});

			}


		}

		// this.afstore.collection('adduserstogrp', ref => ref.where('uid', '==', user.uid)).valueChanges().subscribe(data => {
		// 	console.log(data.length > 1);
		// 	if (data.length > 0) {
		// 		this.removeList(user);
		// 		console.log("user removed" + user)
		// 	}
		// });
	}

	async cancel() {
		this.router.navigate(['/home']);
	}
}
