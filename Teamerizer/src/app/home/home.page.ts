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
  constructor(public menu: MenuController, private fireStore: AngularFirestore,public router: Router, public afAuth: AngularFireAuth ) {

  }

  ngOnInit() {
    this.menu.enable(true);

    this.afAuth.authState.subscribe(user => {
      if(user){
        this.getAllGroupsCreatedByCurrentUser(user.uid).subscribe(data => {
          console.log("Group List Data:", data);
          this.group$ = data;
        });
      }
    });

    this.fireStore.collection('grouplist').valueChanges().subscribe(groupList => {
      this.groupList = groupList;
    })
  }

  getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
    return this.fireStore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges()
}

  async createGroup(){
    this.router.navigate(['/group-creation'])
  }

  async groupdetail(groupname:string){
    
    let navigationExtras: NavigationExtras = {
      state: {
        groupname:groupname
      }
    };

    this.router.navigate(['/groupdetailspage'],navigationExtras)
  }

}
