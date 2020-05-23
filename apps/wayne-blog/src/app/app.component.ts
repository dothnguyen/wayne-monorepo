import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './core/services/user.service';
import { switchMap, filter, tap } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { UserProfile } from './core/models/user-profile';

@Component({
  selector: 'wayne-monorepo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userProfile$: Observable<UserProfile>;

  constructor(
    public auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // this.userProfile$ = this.auth.currentUser$.pipe(
    //   switchMap((userInfo) => {
    //     if (!userInfo)
    //       return of(null);
    //     return this.userService.getUser(userInfo.uid);
    //   })
    // );

    this.userProfile$ = this.userService.currentProfile$;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
