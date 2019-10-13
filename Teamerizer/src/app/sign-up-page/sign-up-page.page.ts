import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.page.html',
  styleUrls: ['./sign-up-page.page.scss'],
})
export class SignUpPagePage implements OnInit {

  username: string = ""
  password: string = ""
  cpassword: string =""

  constructor(public afAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public user: UserService,
    public alertController: AlertController, 
    public router: Router
    ) { }



  ngOnInit() {
  }

  async presentAlert(title: string, content:string){
    const alert = await this.alertController.create({
      header: title, 
      message:content, 
      buttons:['Ok']
    })
    await alert.present();
  }

  async register(){
    const{username,password, cpassword} = this 
    if(password!==cpassword){
      return console.error("password does not match")
    }

try {
  const res = await this.afAuth.auth.createUserWithEmailAndPassword(username + '@pace.edu', password)

  this.afstore.doc(`users/${res.user.uid}`).set({
    username

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
