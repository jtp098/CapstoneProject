import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import { UserService } from '../user.service';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import {forEach} from "@angular-devkit/schematics";
import { map } from 'rxjs/operators';


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
	groupUsers = [];

	sliderConfig = {
		spaceBetween: 10,
		centeredSlides: true,
		slidesPerView: 1.8
	}

	uid: string;
	selectedName;
	group$;
	grouponSelectedname$;
	grouplist: any;
	isAdminUser = false;
	selectedGroup : any;
	isEditGroupDetail = false;
	newAddedUsers = [];
	deletedUsers = [];
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
			  this.selectedGroup = this.router.getCurrentNavigation().extras.state.group;
			  this.selectedGrpName = this.selectedGroup.groupname;
			  this.selectedGroup.desc = this.selectedGroup["desc"];
			  console.log("passedData",this.selectedGroup);
			}else{
				console.log("no Extras")
			}
		  });
		  

	}

	ngOnInit() {
		this.afAuth.authState.subscribe(user => {
			if(user){
				if (user.uid === this.selectedGroup.createdBy) {
					this.isAdminUser = true;
				} else {
					this.isAdminUser = false;
				}
			}
		});
		this.afstore.collection('users').valueChanges().subscribe(userList => {
			this.userList = userList;
			this.loadedUserList = userList;
			console.log("userlist",userList);
		})

		//this.groupUsers = this.userService.getGroupUsers();

		this.getDetails(this.selectedGrpName).subscribe(data => {
			this.grouponSelectedname$ = data;
		});
	}

	editGroupDesc() {
		this.isEditGroupDetail = !this.isEditGroupDetail;
		if (this.isEditGroupDetail) {
			this.groupDescInput.setFocus();
		}
	}

	updateGroup() {
		let updateGroup = this.afstore.doc(`grouplist/${this.selectedGroup.id}`)
		updateGroup.update({
			desc:this.selectedGroup.desc
		});

		//Newly added user adding in group on firebase
		 for(var newUserIndex in this.newAddedUsers) {
			 this.afstore.collection('adduserstogrp').add(this.newAddedUsers[newUserIndex]);
		 }

		 //What ever user deleted from array which is alreay added on firebase we need to delete from firebase
		 for(const deleteUserIndex in this.deletedUsers){
		 	this.afstore.collection("adduserstogrp").doc(this.deletedUsers[deleteUserIndex]["id"])
			.delete();
		 }

		this.router.navigate(['/home']);
	}

	deleteUser(i) {
		let selectedUser = this.grouponSelectedname$[i];

		if (selectedUser.id !== undefined) {
			this.deletedUsers.push(selectedUser);
			this.grouponSelectedname$.splice(i,1);
		} else {
			//Find Index of selected user for delete from Newly added array
			let foundIndex = this.newAddedUsers.findIndex(item => { return item.uid === selectedUser.uid});
			this.newAddedUsers.splice(foundIndex,1);
			this.grouponSelectedname$.splice(i,1);
		}
		// if (selectedUser) {
		// 	this.afstore.collection("adduserstogrp").doc(selectedUser.id)
		// 	.delete();
		// }
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

		let newUser = {
			firstName: user.firstName,
			lastName:user.lastName,
			skillLevel: user.skillLevel,
			skillType: user.skillType,
			grpname: this.selectedGrpName,
			addflag: true,
			uid: user.uid,
		};

		this.grouponSelectedname$.push(newUser);
		this.newAddedUsers.push(newUser);
		
		//  for(var userinfoobs$ in this.userinfo$) {
		// 	 console.log(this.userinfo$[userinfoobs$].firstName+""+this.userinfo$[userinfoobs$].lastName)
		// 	 this.afstore.collection('adduserstogrp').add({
		// 		 firstName: this.userinfo$[userinfoobs$].firstName,
		// 		 lastName: this.userinfo$[userinfoobs$].lastName,
		// 		 skillLevel: this.userinfo$[userinfoobs$].skillLevel,
		// 		 skillType: this.userinfo$[userinfoobs$].skillType,
		// 		 grpname: this.selectedGrpName,
		// 		 addflag: true,
		// 		 uid: user.uid,
		// 	 })
		//  }
		
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
		});
	}

	getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
		return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges();
	}
	getDetails(grpName): Observable<any> {
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('grpname', '==', grpName)).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data();
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}
	getUserInfo(firstName): Observable<any> {
		return this.afstore.collection('users', ref => ref.where('firstName', '==', firstName)).valueChanges();
	}
	async cancel() {
		this.router.navigate(['/home']);
	}
}
