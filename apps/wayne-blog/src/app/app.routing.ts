import { Routes, RouterModule } from '@angular/router';
import { BlogHomeComponent } from './modules/blog/blog-home/blog-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsHomeComponent } from './modules/blog/posts-home/posts-home.component';
import { PostReadComponent } from './modules/blog/post-read/post-read.component';

const appRoutes: Routes = [
  {
    path: '',
    component: BlogHomeComponent,
    children: [
      {path: '', component: PostsHomeComponent},
      {path: 'post/:id', component: PostReadComponent}
    ]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {} 




