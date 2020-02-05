import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router,NavigationExtras } from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  groupList;

  constructor(public menu: MenuController,
    public afstore: AngularFirestore,
        public afAuth: AngularFireAuth,
        private router: Router,) {}

  ngOnInit() {
    this.menu.enable(true);

    this.afAuth.authState.subscribe(user => {
      if(user){
        // this.getAllGroupsCreatedByCurrentUser(user.uid).subscribe(data => {
        //   console.log("Group List Data:", data);
        //   this.group$ = data;
        // });
      }
    });
    
    this.getAllGroup().subscribe(groupList => {
      this.groupList = groupList;
    })
  }

  getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
    return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==', uid)).valueChanges()
}

getAllGroup() {

  return this.afstore.collection<any>('grouplist').snapshotChanges().pipe(
    map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    });
    })
  );
}

  async createGroup(){
    this.router.navigate(['/group-creation'])
  }

  async groupdetail(group){
    
    let navigationExtras: NavigationExtras = {
      state: {
        group:group
      }
    };

    this.router.navigate(['/groupdetailspage'],navigationExtras)
  }
}