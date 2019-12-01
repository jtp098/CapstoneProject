import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import {PickerController} from '@ionic/angular';
import{PickerOptions} from '@ionic/core'
import { Router,NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.page.html',
  styleUrls: ['./group-creation.page.scss'],
})
export class GroupCreationPage implements OnInit {
  Framework = '';
  selected =['','','']

  groupname: string;
  desc: string;
  skill: string;
  skill_level: string;
  newFormGroup : FormGroup;
  newGroupData = { groupname: '', desc: '' };
  groupnameAC: AbstractControl;
  descAC: AbstractControl;
  skillAC: AbstractControl;
  levelAC: AbstractControl;
  allSkills: any;
  allSkillLevels: any;
  authUserStateSub: any;
  selectedSkill = [];
  selectedLevel = [];
  matchedUsers = [];

  



  constructor( 
    public fb: FormBuilder,
    private navCtrl: NavController, 
    public afstore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public alertController: AlertController, 
    private pickerCtrl: PickerController,
    private router: Router
  ) 
   
  
  { 
    // <!-- <This is form validation where we can define the required fields -->
    this.newFormGroup = this.fb.group({
      'groupname' : [null, Validators.compose([Validators.required])],
      'desc': [null, Validators.compose([Validators.required])]
      // 'skill': [null, Validators.compose([Validators.required])],
      // 'level': [null, Validators.compose([Validators.required])]
    }); 

    this.groupnameAC = this.newFormGroup.controls['groupname'];
    this.descAC = this.newFormGroup.controls['desc'];
    // this.skillAC = this.selectedSkill['skill'];
    // this.levelAC = this.newFormGroup.controls['level'];
  }

  openDetailsWithState(firstName: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: firstName
      }
    };
    this.router.navigate(['/member-details'], navigationExtras);
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
  async showAdvancedPicker() {
    let opts: PickerOptions = {
      cssClass: 'academy-picker',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done',
          cssClass: 'special-done',
          handler: (value : any): void => {
            console.log(value, 'ok');

            this.selectedSkill.push(value.skillType);
            this.selectedLevel.push(value.skillLevel);
          } 
        }
      ],
      columns: [ 
        {
          name: 'skillType',
          options: this.allSkills
        },
        {
          name: 'skillLevel',
          options: this.allSkillLevels
        }
      ]
    };

    let picker = await this.pickerCtrl.create(opts);
    picker.present();
    
    // picker.onDidDismiss().then(async data => {
    //   let skillType = await picker.getColumn('skillType');
    //   let skillLevel = await picker.getColumn('skillLevel');
    //   console.log('col: ', skillType);
    //   this.selectedSkill.push(skillType.options[skillType.selectedIndex]);
    //   this.selectedLevel.push(skillLevel.options[skillLevel.selectedIndex]);
    // });

  }

  addGroup(){

    let self = this;
        //Get Group list created bycurrent user by passing uid as createdBy
        this.authUserStateSub = this.getAllGroups().subscribe(data => {
          console.log("Group List Data:",data);
          let grouplist = data;
          var groupNameFound = grouplist.find(function(group){
            return group.groupname == self.newGroupData.groupname;
          });
          console.log(groupNameFound);
          if(groupNameFound){
            this.presentAlert("Error","Group name already exists!");
          } else {
            this.addGroupAfterVerfyingGroupList();
          }

        });

  }

  getSkillMatchedUser(){
    if (this.selectedSkill.length > 0) {
      this.getMatchedSkillUsers().subscribe( data  => {
        console.log("Match users",data);
        this.matchedUsers = data;
      });

    } else {
      
    }
  }

  addGroupAfterVerfyingGroupList(){
    let id = this.afstore.createId();
    this.authUserStateSub.unsubscribe();
    this.afstore.doc("grouplist/"+id).set({
      groupname:this.newGroupData.groupname,
      desc:this.newGroupData.desc,
      selectedSkill: this.selectedSkill,
      selectedLevel: this.selectedLevel,
      createdBy: this.afAuth.auth.currentUser.uid
    }).then(() => {
      console.log("New Group added successfully!");
      this.presentAlert("Sucess","Group has been created!");
      
      this.navCtrl.navigateBack('/home');
     }, err => {
       this.presentAlert("Error","Group has not been created!")
    });
  }

  getAllGroupsCreatedByCurrentUser(uid): Observable<any> {
    return this.afstore.collection<any>('grouplist', ref => ref.where('createdBy', '==',uid)).valueChanges();
  }

  getMatchedSkillUsers(): Observable<any> {
    //return this.afstore.collection<any>('user', ref => ref.
    return this.afstore.collection<any>('users', ref => ref.where('skillType', "array-contains-any",this.selectedSkill)).valueChanges();
    
  }


  async cancel(){
    this.router.navigate(['/home'])
  }

  getSkills() : Observable <any> {
    return this.afstore.collection<any>("Skills").valueChanges();
  }

  getSkillLevels(): Observable<any> {
    return this.afstore.collection<any>("Skill_level").valueChanges();
  }

  
  getAllGroups(): Observable<any> {
    return this.afstore.collection<any>("grouplist").valueChanges();
  }



async showBasicPicker(){
  let opts:PickerOptions = {
    buttons: [
      {
      text:'Cancel',
      role: 'cancel'
      },
      {
        text: 'Done'
      }
    ],
    columns:[
      {
      name: 'Framework',
      options:[
        {text:'Angular', value: 1},
        {text:'Vue', value: 2},
        {text:'React', value: 3}
      ]
    }

    ]
  };
  let picker = await this.pickerCtrl.create(opts);
  picker.present();
  picker.onDidDismiss().then(async data => {
    let col = await picker.getColumn('Framework');
    console.log('col: ', col);
    this.Framework = col.options[col.selectedIndex].text;

  });


}
deleteSkill(i){
    this.selectedSkill.splice(i,1);
    this.selectedLevel.splice(i,1);
  }

  skillMatched(userSkills: any[]) {
      return userSkills.filter((skill:any) => this.selectedSkill.findIndex((selectedSkill: any) => selectedSkill.text === skill.text) > -1).map((skill:any) => skill.text).join(', ');
      //filter will go and check what is the exact skill exist in selectedSkill, then map so it can only show the text, so put it in the string you do join of skill with coma separate.

      
  }

}
