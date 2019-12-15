import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    mainuser: AngularFirestoreDocument
    
    username:string
    firstname:string
    lastname:string
    skillType:string
    skillLevel:string
    sub
    

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
    this.mainuser = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.firstname = event.firstName
      this.lastname = event.lastName
    })
  }
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    /*{
      title: 'SignUp',
      url: '/sign-up-page',
      icon: 'list'
    },*/
  
    {
      title: 'Update Profile Page',
      url: '/update-profile',
      icon: 'list'
    },
    /*{
      title: 'Log in',
      url: '/login',
      icon: 'list'
    },*/
    {
      title: 'Profile',
      url: '/profile',
      icon: 'list'
    },
 {
      title: 'Team Management',
      url: '/groupdetailspage',
      icon: 'list'
    },
    {
      title: 'Log Out',
      url: '/login',
      icon: 'list'
    },    

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public user: UserService,
    private afs: AngularFirestore,
    private router: Router, 
    private afAuth: AngularFireAuth
  ) {
    this.initializeApp();
  }
  

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  menuClicked(item){
    console.log("Menu Clicked",item.title);
    if (item.title === "Log Out") {
      this.user.logout();
    }

  }
  
}