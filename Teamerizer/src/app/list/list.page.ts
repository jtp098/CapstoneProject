import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
 
  grouplist : any;
  constructor(public router: Router,
    public afstore: AngularFirestore,
    public afAuth: AngularFireAuth,) {
   
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }

  ionViewWillEnter(){

    this.afAuth.authState.subscribe(user => {
      if(user){
        //Get Group list created bycurrent user by passing uid as createdBy
        this.getAllGroupsCreatedByCurrentUser(user.uid).subscribe(data => {
          console.log("Group List Data:",data);
          this.grouplist = data;
        });
      }
    });
  }

  gotoCreateGroupPage(){
    this.router.navigate(['/group-creation']);
  }

  getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
    return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==',uid)).valueChanges();
  }
}
