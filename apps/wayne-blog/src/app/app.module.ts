import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';

import { AppComponent } from './app.component';
import { BlogHomeComponent } from './modules/blog/blog-home/blog-home.component';
import { AppRoutingModule } from './app.routing';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, BlogHomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
