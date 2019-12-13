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
		public useridtodel;
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

				this.groupUsers = this.userService.getGroupUsers();
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

		addToGroup(user) {
			this.useridtodel = user;
			console.log(user+ "Users");
			//this.userService.addUsers(user);
			this.afstore.collection('users', ref => ref.where('uid', '==', user)).valueChanges().subscribe(userList => {
				this.userinfo$ = userList;
				console.log("user list add",this.userinfo$);
			})
			for(var userinfoobs$ in this.userinfo$) {
				console.log(this.userinfo$[userinfoobs$].firstName+""+this.userinfo$[userinfoobs$].lastName)
				this.afstore.collection('adduserstogrp').add({
					firstName: this.userinfo$[userinfoobs$].firstName,
					lastName: this.userinfo$[userinfoobs$].lastName,
					//skills: this.userinfo$[userinfoobs$].skills,
					grpname: this.selectedGrpName,
					addflag: true,
					uid: user,

				})

			}
		}

    groupDetailsDisplay(event) {
    	this.selectedGrpName=event.target.value;
        console.log("selected" + event.target.value)
        this.getDetails(event.target.value).subscribe(data => {
            this.grouponSelectedname$ = data;
        });
    }
	async delay(ms: number) {
		await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
	}
remove(no){
let size;
	this.delay(5000).then(any=>{
		this.afstore.collection('adduserstogrp', ref => ref.where('uid', '==', this.useridtodel)).valueChanges().subscribe(data => {
			console.log('remove'+this.useridtodel);
			console.log(data);
			if(data){
				(this.userList).splice(no, 1);
			} });
	});
    }

    getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
        return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges();
    }
    getDetails(grpName): Observable<any> {
        return this.afstore.collection<any>('grouplist', ref => ref.where('groupname', '==', grpName)).valueChanges();
		}
	getUserInfo(firstName): Observable<any> {
		return this.afstore.collection('users', ref => ref.where('firstName', '==', firstName)).valueChanges();
	}
		async cancel() {
			this.router.navigate(['/home']);
		}
}
