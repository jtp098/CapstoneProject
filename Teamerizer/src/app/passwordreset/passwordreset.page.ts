import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../user.service";
import {MenuController} from "@ionic/angular";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.page.html',
  styleUrls: ['./passwordreset.page.scss'],
})
export class PasswordresetPage implements OnInit {
loginData: { username: '', oldPassword: '', newPassword: '', confirmPassword: '' };
   username: AbstractControl ;
  oldPassword: AbstractControl;
  newPassword: AbstractControl;
  confirmPassword: AbstractControl;
  authReset: FormGroup ;
  passwordtype:string='password';
  passeye:string ='eye';

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private afAuth: AngularFireAuth, public user: UserService,  private menu: MenuController, public fb: FormBuilder ) {
    this.authReset = this.fb.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.username = this.authReset.controls['username'];
    this.oldPassword = this.authReset.controls['oldPassword'];
    this.newPassword = this.authReset.controls['newPassword'];
    this.confirmPassword = this.authReset.controls['confirmPassword'];
  }
  async resetPassword() {
    try {
      debugger;
      console.log(this.username.value,this.oldPassword.value, this.newPassword.value ,this.confirmPassword.value);
      // tslint:disable-next-line:prefer-const
      let res = await this.afAuth.auth.signInWithEmailAndPassword(this.username.value, this.oldPassword.value);
      if (res.user) {
        if( this.newPassword.value === this.confirmPassword.value) {
          await res.user.updatePassword(this.newPassword.value).then(function() {
            this.router.navigate(['/home']);
          }).catch(function(error) {
            // An error happened.
          });;
        }
      }
    } catch (error) {
      console.dir(error);

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

  backEvent(){
    this.router.navigate(['/login'])
  }
  ngOnInit() {
  }

}
