import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImgUploaderPage } from './img-uploader.page';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from '../environments/environment';
import { FileSizeFormatPipe } from './file-size-format.pipe';

const routes: Routes = [
  {
    path: '',
    component: ImgUploaderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularFireModule.initializeApp(environment.firebase, 'Teamerizer'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  declarations: [ImgUploaderPage, FileSizeFormatPipe]
})
export class ImgUploaderPageModule { }
