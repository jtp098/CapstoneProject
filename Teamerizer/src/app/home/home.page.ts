import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public groupList: any[]; 

  constructor(public menu: MenuController, private fireStore: AngularFirestore,public router: Router ) {

  }

  ngOnInit() {
    this.menu.enable(true);

    this.fireStore.collection('grouplist').valueChanges().subscribe(groupList => {
      this.groupList = groupList;
    })
  }

  async createGroup(){
    this.router.navigate(['/group-creation'])
  }


}
