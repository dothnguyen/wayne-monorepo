import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';
import { ProfileRoutingModule } from './profile.routing';

@NgModule({
  imports: [CommonModule, ProfileRoutingModule, ReactiveFormsModule],
  declarations: [ProfileComponent],
  exports: [],
})
export class ProfileModule {}
