import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = ""
  //password: string = ""
  loginData = { email:'', password:'' };
  authForm : FormGroup;
  email: AbstractControl;
	password: AbstractControl;
  passwordtype:string='password';
  passeye:string ='eye';
  
  constructor(private afAuth: AngularFireAuth, public user: UserService,public router: Router, private menu: MenuController, public fb: FormBuilder ) { 
    this.authForm = this.fb.group({
      'email' : [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required])],
    });

        this.email = this.authForm.controls['email'];
        this.password = this.authForm.controls['password'];

  }

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

 

  async login(loginData){
    const { username} = this

    try {
      
      const res = await this.afAuth.auth.signInWithEmailAndPassword(loginData.email,loginData.password)

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


  showPassword() {
    if(this.passwordtype == 'password'){
      this.passwordtype='text';
      this.passeye='eye-off';
    }else{
      this.passwordtype='password';
      this.passeye = 'eye';
    }
  }

}
