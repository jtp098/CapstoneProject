import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateProfilePage } from './update-profile.page';

import { FileSizeFormatPipe } from './file-size-format.pipe';

const routes: Routes = [
  {
    path: '',
    component: UpdateProfilePage
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
  declarations: [UpdateProfilePage, FileSizeFormatPipe]
})
export class UpdateProfilePageModule {}
