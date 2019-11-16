import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public groupList: any[]; 

  constructor(public menu: MenuController, private fireStore: AngularFirestore) {

  }

  ngOnInit() {
    this.menu.enable(true);

    this.fireStore.collection('grouplist').valueChanges().subscribe(groupList => {
      this.groupList = groupList;
    })
  }


}
