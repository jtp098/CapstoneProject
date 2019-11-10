import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

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
  newGroupData = { groupname: '', desc: '', skill: null, level: null };
  groupnameAC: AbstractControl;
  descAC: AbstractControl;
  skillAC: AbstractControl;
  levelAC: AbstractControl;
  allSkills: any;
  allSkillLevels: any;
  authUserStateSub: any;
  constructor( 
    public fb: FormBuilder,
    private navCtrl: NavController, 
    public afstore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public alertController: AlertController
  ) 
   
  
  { 
    // <!-- <This is form validation where we can define the required fields -->
    this.newFormGroup = this.fb.group({
      'groupname' : [null, Validators.compose([Validators.required])],
      'desc': [null, Validators.compose([Validators.required])],
      'skill': [null, Validators.compose([Validators.required])],
      'level': [null, Validators.compose([Validators.required])]
    }); 

    this.groupnameAC = this.newFormGroup.controls['groupname'];
    this.descAC = this.newFormGroup.controls['desc'];
    this.skillAC = this.newFormGroup.controls['skill'];
    this.levelAC = this.newFormGroup.controls['level'];
  }
  async presentAlert(title: string, content:string){
    const alert = await this.alertController.create({
      header: title, 
      message:content, 
      buttons:['Ok']
    })
    await alert.present();
  }

  ngOnInit() {

    this.getSkills().subscribe((data) => {
      console.log("All Skills :",data);
      this.allSkills = data;
    });

    this.getSkillLevels().subscribe((data) => {
      console.log("All Levels :",data);
      this.allSkillLevels = data;
    });
  }

  addGroup(){

    let self = this;
    this.authUserStateSub = this.afAuth.authState.subscribe(user => {
      if(user){
        //Get Group list created bycurrent user by passing uid as createdBy
        this.getAllGroupsCreatedByCurrentUser(user.uid).subscribe(data => {
          console.log("Group List Data:",data);
          let grouplist = data;
          var groupNameFound = grouplist.find(function(group){
            return group.groupname == self.newGroupData.groupname;
          });
          console.log(groupNameFound);
          if(groupNameFound){
            this.presentAlert("Error","Group name already exists!");
          } else {
            this.addGropAfterVerfyingGroupList();
          }

        });
      }
    });

    
   
  }

  addGropAfterVerfyingGroupList(){
    let id = this.afstore.createId();
    this.afstore.doc("grouplist/"+id).set({
      groupname:this.newGroupData.groupname,
      desc:this.newGroupData.desc,
      skill: this.newGroupData.skill,
      level: this.newGroupData.level,
      createdBy: this.afAuth.auth.currentUser.uid
    }).then(() => {
      console.log("New Group added successfully!");
      this.presentAlert("Sucess","Group has been created!");
      this.authUserStateSub.unsubscribe();
      this.navCtrl.navigateBack('/list');
    }, err => {
      this.presentAlert("Error","Group has not been created!")
    });
  }

  getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
    return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==',uid)).valueChanges();
  }


  cancel(){
    this.navCtrl.navigateBack('/list');
  }

  getSkills() : Observable <any> {
    return this.afstore.collection<any>("Skills").valueChanges();
  }

  getSkillLevels(): Observable<any> {
    return this.afstore.collection<any>("Skill_level").valueChanges();
  }

}
