import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateProfilePage } from './update-profile.page';

import { FileSizeFormatPipe } from './file-size-format.pipe';

import { UpdateProfileComponent } from './update-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateProfileComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UpdateProfilePage, UpdateProfileComponent, FileSizeFormatPipe]
})
export class UpdateProfilePageModule {}
