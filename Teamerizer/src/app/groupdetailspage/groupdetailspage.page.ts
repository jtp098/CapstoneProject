import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import { UserService } from '../user.service';
import { Router,NavigationExtras } from '@angular/router';
import {forEach} from "@angular-devkit/schematics";


@Component({
	selector: 'app-groupdetailspage',
	templateUrl: './groupdetailspage.page.html',
	styleUrls: ['./groupdetailspage.page.scss'],
})
export class GroupdetailspagePage implements OnInit {
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
	constructor(private navCtrl: NavController,
				public afstore: AngularFirestore,
				public afAuth: AngularFireAuth,
				public alertController: AlertController,
				private userService: UserService,
				private router: Router
	) {}

	ngOnInit() {
		this.afAuth.authState.subscribe(user => {
			if(user){
				this.getAllGroupsCreatedByCurrentUser(user.uid).subscribe(data => {
					console.log("Group List Data:", data);
					this.group$ = data;
				});
			}
		});
		this.afstore.collection('users').valueChanges().subscribe(userList => {
			this.userList = userList;
			this.loadedUserList = userList;
			console.log("userlist",userList);
		})

		//this.groupUsers = this.userService.getGroupUsers();
	}

	openDetailsWithState(firstName: string) {
		let navigationExtras: NavigationExtras = {
			state: {
				user: firstName
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
				 this.userinfo$=observableUser$;
				 console.log(this.userinfo$[0]);
			 });
		 } finally {
			 await this.delay(2000);
			 console.log("Fianl"+observableUser$);
			 debugger;
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
			 })
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
		return this.afstore.collection<any>('adduserstogrp', ref => ref.where('grpname', '==', grpName)).valueChanges();
	}
	getUserInfo(firstName): Observable<any> {
		return this.afstore.collection('users', ref => ref.where('firstName', '==', firstName)).valueChanges();
	}
	async cancel() {
		this.router.navigate(['/home']);
	}
}
