import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BlogHomeComponent } from './modules/blog/blog-home/blog-home.component';
import { AppRoutingModule } from './app.routing';

@NgModule({
  declarations: [AppComponent, BlogHomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
