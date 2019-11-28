import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireStoreFetchService {

  constructor(public afstore: AngularFirestore,) { }

  getSkills() : Observable <any> {
    return this.afstore.collection<any>("Skills").valueChanges();
  }

  getSkillLevels(): Observable<any> {
    return this.afstore.collection<any>("Skill_level").valueChanges();
  }
}
