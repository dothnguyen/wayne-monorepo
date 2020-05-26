import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post/post.component';

// define the routes in admin module
const adminRoutes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: PostListComponent },
      { path: 'posts/new', component: PostComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}



