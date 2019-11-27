import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
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
      title: 'Group Details',
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
    public user: UserService
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