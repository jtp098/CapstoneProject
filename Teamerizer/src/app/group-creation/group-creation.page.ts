import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.page.html',
  styleUrls: ['./group-creation.page.scss'],
})
export class GroupCreationPage implements OnInit {

  groupname: string;
  desc: string;
  skill: string;
  skill_level: string;
  newFormGroup : FormGroup;
  newGroupData = { groupname: '', desc: '' };
  groupnameAC: AbstractControl;
	descAC: AbstractControl;
  constructor(
    public fb: FormBuilder,
    private navCtrl: NavController, 
    public afstore: AngularFirestore,
    public afAuth: AngularFireAuth,
  ) 
  
  { 
    // <!-- <This is form validation where we can define the required fields -->
    this.newFormGroup = this.fb.group({
      'groupname' : [null, Validators.compose([Validators.required])],
      'desc': [null, Validators.compose([Validators.required])]
    }); 

    this.groupnameAC = this.newFormGroup.controls['groupname'];
    this.descAC = this.newFormGroup.controls['desc'];
  }

  ngOnInit() {
  }

  addGroup(){
    let id = this.afstore.createId();
    this.afstore.doc("grouplist/"+id).set({
      groupname:this.newGroupData.groupname,
      desc:this.newGroupData.desc,
      createdBy: this.afAuth.auth.currentUser.uid
    });
  }

  cancel(){
    this.navCtrl.navigateBack('/list');
  }

}
