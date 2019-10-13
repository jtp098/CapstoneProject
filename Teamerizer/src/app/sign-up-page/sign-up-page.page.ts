import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.page.html',
  styleUrls: ['./sign-up-page.page.scss'],
})
export class SignUpPagePage implements OnInit {

  username: string = ""
  password: string = ""
  cpassword: string =""

  constructor(public afAuth: AngularFireAuth) { }



  ngOnInit() {
  }

  async register(){
    const{username,password, cpassword} = this 
    if(password!==cpassword){
      return console.error("password does not match")
    }

try {
  const res = await this.afAuth.auth.createUserWithEmailAndPassword(username + '@pace.edu', password)
} catch (error) {
  console.dir(error)
}



      
    
  }

}
