import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service';

const routes: Routes = [
  {
    path: '',redirectTo: 'login',pathMatch: 'full',canActivate: [AuthService]},
  {path: 'home',loadChildren: './home/home.module#HomePageModule'},
  {path: 'list',loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)},
  { path: 'sign-up-page', loadChildren: './sign-up-page/sign-up-page.module#SignUpPagePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'group-creation', loadChildren: './group-creation/group-creation.module#GroupCreationPageModule' },
  { path: 'group-details', loadChildren: './group-details/group-details.module#GroupDetailsPageModule' },
  { path: 'member-details', loadChildren: './member-details/member-details.module#MemberDetailsPageModule' },
  { path: 'member-match', loadChildren: './member-match/member-match.module#MemberMatchPageModule' },
  { path: 'update-profile', loadChildren: './update-profile/update-profile.module#UpdateProfilePageModule' },  { path: 'group-create', loadChildren: './group-create/group-create.module#GroupCreatePageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
