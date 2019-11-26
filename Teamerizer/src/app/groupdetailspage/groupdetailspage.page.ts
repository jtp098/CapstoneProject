import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';


@Component({
    selector: 'app-groupdetailspage',
    templateUrl: './groupdetailspage.page.html',
    styleUrls: ['./groupdetailspage.page.scss'],
})
export class GroupdetailspagePage implements OnInit {
    uid: string;
    selectedName;
    group$;
    grouponSelectedname$;
    grouplist: any;
    constructor(private navCtrl: NavController,
                public afstore: AngularFirestore,
                public afAuth: AngularFireAuth,
                public alertController: AlertController,
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
    }
    gropudetailsDisplay(event) {
        console.log("selected" + event.target.value)
        this.getDetails(event.target.value).subscribe(data => {
            this.grouponSelectedname$ = data;
        });
    }
    getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
        return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges();
    }
    getDetails(grpName): Observable<any> {
        return this.afstore.collection<any>('grouplist', ref => ref.where('groupname', '==', grpName)).valueChanges();

    }
}
