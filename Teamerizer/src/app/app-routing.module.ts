import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service';

const routes: Routes = [
  {
    path: '',redirectTo: 'login',pathMatch: 'full',canActivate: [AuthService]},
  {path: 'home',loadChildren: './home/home.module#HomePageModule'},
  { path: 'sign-up-page', loadChildren: './sign-up-page/sign-up-page.module#SignUpPagePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'group-creation', loadChildren: './group-creation/group-creation.module#GroupCreationPageModule' },
  { path: 'group-details', loadChildren: './group-details/group-details.module#GroupDetailsPageModule' },
  { path: 'member-details', loadChildren: './member-details/member-details.module#MemberDetailsPageModule' },
  { path: 'member-match', loadChildren: './member-match/member-match.module#MemberMatchPageModule' },
  { path: 'update-profile', loadChildren: './update-profile/update-profile.module#UpdateProfilePageModule' },
  { path: 'groupdetailspage', loadChildren: './groupdetailspage/groupdetailspage.module#GroupdetailspagePageModule' },  { path: 'pending-invites', loadChildren: './pending-invites/pending-invites.module#PendingInvitesPageModule' },
  { path: 'img-uploader', loadChildren: './img-uploader/img-uploader.module#ImgUploaderPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
