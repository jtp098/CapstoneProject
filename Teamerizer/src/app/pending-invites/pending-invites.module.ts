import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PendingInvitesPage } from './pending-invites.page';

const routes: Routes = [
  {
    path: '',
    component: PendingInvitesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PendingInvitesPage]
})
export class PendingInvitesPageModule {} 
