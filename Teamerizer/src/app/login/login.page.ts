import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = ""
  password: string = ""

  constructor(private afAuth: AngularFireAuth, public user: UserService,public router: Router, private menu: MenuController ) { }

  ngOnInit() {
  }

  async signUp(){
    this.router.navigate(['/sign-up-page'])
  }

  
  ionViewWillEnter() {
    console.log("ionViewWillEnter");
let self: any = this;
this.afAuth.auth.onAuthStateChanged(function(user) {
  console.log("User",user);
  if (user) {
    self.router.navigate(['/home'])
  } else {
    self.menu.enable(false);
  }
})
    
  }

  async login(){
    const { username, password} = this

    try {
      //update later..
      const res = await this.afAuth.auth.signInWithEmailAndPassword(username + '@pace.edu',password)

      if(res.user){
        this.user.setUser({
          username,
          uid: res.user.uid

        })
        this.router.navigate(['/home'])

      }
    } catch (error) {
      console.dir(error)
      
    }
  }

}
