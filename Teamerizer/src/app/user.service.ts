import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'

interface user {
	username: string,
	uid: string
}

@Injectable()
export class UserService {
	private user: user

	constructor() {

    }

    setUser(user: user) {
		this.user = user
	}
    
    getUID(): string {
		return this.user.uid
	}

}
