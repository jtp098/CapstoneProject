import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'

interface user {
    username: string,
    //firstName: String,
   // lastName: String,
   // skills: String,
   // skillLevel: String,
	uid: string
}

@Injectable()
export class UserService {
    private user: user
    //private fname: fname
    //private lname: lname
    //private skills: skills
    //private skillLevel: skillLevel



	constructor(private afAuth: AngularFireAuth) {

    }

    setUser(user: user) {
        this.user = user
    }

    setFistName(fname: user){
      this.user = fname
    }
    
    async isAuthenticated() {
      
      console.log("Current User :", this.user);
		if(this.user) return true
    console.log("Current User :", this.user);
		const user = await this.afAuth.authState.pipe(first()).toPromise()

		if(user) {
			this.setUser({
				username: user.email.split('@')[0],
        uid: user.uid, 
        //firstName: null
			})

			return true
		}
		return false
	}
    
    getUID(): string {
       
            return this.user.uid;
        
	
    }
    
    reAuth(username: string, password: string) {
		return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(username + '@pace.edu', password))
    }
    
    getUsername(): string {
		return this.user.username
    }
    
    updateEmail(newemail: string) {
		return this.afAuth.auth.currentUser.updateEmail(newemail + '@pace.edu')
  }
  
  //updatefirstName(newfirstName: string){
    //return this.afAuth.auth.currentUser.updatefirstName(newfirstName)
 // }

  updatelastName(newLastName: string){
    return this.afAuth.auth.currentUser.updateEmail(newLastName)
  }

  updateSkills(newSkills: string){
    return this.afAuth.auth.currentUser.updateEmail(newSkills)
  }

  updateSkillLevel(newSkillLevel: string){
    return this.afAuth.auth.currentUser.updateEmail(newSkillLevel)
  }

  logout() {
    this.afAuth.auth.signOut();
    this.user = null;
  }

  updatePassword(newpassword: string){
    return this.afAuth.auth.currentUser.updatePassword(newpassword)
  }

}
