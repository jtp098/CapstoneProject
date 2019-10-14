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
    
    async isAuthenticated() {
		if(this.user) return true

		const user = await this.afAuth.authState.pipe(first()).toPromise()

		if(user) {
			this.setUser({
				username: user.email.split('@')[0],
				uid: user.uid
			})

			return true
		}
		return false
	}
    
    getUID(): string {
       
            return this.user.username
        
	
    }
    
    reAuth(username: string, password: string) {
		return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(username + '@pace.edu', password))
    }
    updatePassword(newpassword: string){
      return this.afAuth.auth.currentUser.updatePassword(newpassword)
    }
    
    getUsername(): string {
		  return this.user.username
    }
    
    updateEmail(newemail: string) {
		  return this.afAuth.auth.currentUser.updateEmail(newemail + '@pace.edu')
	}

}
