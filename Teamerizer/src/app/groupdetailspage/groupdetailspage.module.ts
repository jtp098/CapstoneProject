import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GroupdetailspagePage } from './groupdetailspage.page';

const routes: Routes = [
  {
    path: '',
    component: GroupdetailspagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GroupdetailspagePage]
})
export class GroupdetailspagePageModule {}
