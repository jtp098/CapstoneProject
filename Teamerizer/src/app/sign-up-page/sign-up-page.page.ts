import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.page.html',
  styleUrls: ['./sign-up-page.page.scss'],
})
export class SignUpPagePage implements OnInit {

  username: string = ""
  //password: string = ""
  cpassword: string =""
  regData = { name: '', mail: '', pass: '', cnfpass: '' };
  authForm : FormGroup;
	username2: AbstractControl;
	email: AbstractControl;
	password: AbstractControl;
  cnfpass: AbstractControl;  
  passwordtype:string='password';
  cnfpasswordtype:string='password';
  cnfpasseye:string='eye';
  passeye:string ='eye';


  constructor(public afAuth: AngularFireAuth, public fb: FormBuilder,
    public afstore: AngularFirestore,
    public user: UserService,
    public alertController: AlertController, 
    public router: Router, 
    public menu: MenuController
    ) {
      
      this.authForm = this.fb.group({
        'username' : [null, Validators.compose([Validators.required])],
        /*'email': [null, Validators.compose([Validators.required])], */
        'email': new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@pace.edu$')
        ])),
        'password': [null, Validators.compose([Validators.required])],
        'cnfpass': [null, Validators.compose([Validators.required])]
        
    });

      this.username2 = this.authForm.controls['username'];
      this.email = this.authForm.controls['email'];
      this.password = this.authForm.controls['password'];
      this.cnfpass = this.authForm.controls['cnfpass'];
     }



  ngOnInit() {
    this.menu.enable(false);
  }

  async presentAlert(title: string, content:string){
    const alert = await this.alertController.create({
      header: title, 
      message:content, 
      buttons:['Ok']
    })
    await alert.present();
  }

  backEvent(){
    this.router.navigate(['/login'])
  }


  async register(regData){
    const { username} = this
    if(regData.pass == regData.cnfpass){
      
      
      
try {
  const res = await this.afAuth.auth.createUserWithEmailAndPassword(regData.mail, regData.pass);
  
  this.afstore.doc(`users/${res.user.uid}`).set({
    username: this.regData.name,
    uid: res.user.uid

  })
  this.user.setUser({
    username,
    uid: res.user.uid
  })
  
  this.presentAlert('Success','You are registered')
//this will need to go to the profile later for set up
  this.router.navigate(['/update-profile'])

} catch (error) {
  console.dir(error)
}
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
showcnfPassword() {
  if(this.cnfpasswordtype == 'password'){
    this.cnfpasswordtype='text';
    this.cnfpasseye='eye-off';
  }else{
    this.cnfpasswordtype='password';
    this.cnfpasseye = 'eye';
  }
}

}
