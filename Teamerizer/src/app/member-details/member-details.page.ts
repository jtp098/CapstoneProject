import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.page.html',
  styleUrls: ['./member-details.page.scss'],
})
export class MemberDetailsPage implements OnInit {
  mainuser: AngularFirestoreDocument
    
    username:string
    firstname:string
    lastname:string
    skillType:string
    skillLevel:string
    sub

    selectedSkill = [];
    selectedLevel = [];
data: any;
  constructor(private afs: AngularFirestore, private user: UserService, private router: Router, 
    private afAuth: AngularFireAuth, private route: ActivatedRoute,private navCtrl: NavController) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.data = this.router.getCurrentNavigation().extras.state.user;
          console.log("passedData",this.data);
        }
      });
      
     }

  ngOnInit() {
    let self = this;
    this.afAuth.auth.onAuthStateChanged(function(user) {
      console.log("User",user);
      if (user) {
        self.setUserProfileData();
      } else {
        
      }
    });
  }

  setUserProfileData(){
    this.mainuser = this.afs.doc(`users/${this.data}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.username = event.username
      this.firstname = event.firstName
      this.lastname = event.lastName
      this.selectedSkill = event.skillType
      this.selectedLevel = event.skillLevel
      console.log(this.selectedSkill);
    })
  }

  goBack() {
    this.navCtrl.back();
    }

  back(){
    this.router.navigate(['/group-creation'])
  }

}
