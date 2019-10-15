import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    mainuser: AngularFirestoreDocument
    username:string
    firstname:string
    lastname:string
    skills:string
    skillLevel:string
    sub



    constructor(private afs: AngularFirestore, private user: UserService, private router: Router) {
      this.mainuser = afs.doc(`users/${user.getUID()}`)
      this.sub = this.mainuser.valueChanges().subscribe(event => {
            this.username = event.username
            this.firstname = event.firstName
            this.lastname = event.lastName
            this.skills = event.skills
            this.skillLevel = event.skillLevel

            })
    }

  ngOnInit() {
  }

  updateProfile(){
    this.router.navigate(['/update-profile'])
  }

  async cancel(){
    this.router.navigate(['/home'])
  }

}
