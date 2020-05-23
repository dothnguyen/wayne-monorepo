import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import {
  delay,
  switchMap,
  map,
  takeUntil,
  filter,
  take,
  flatMap,
} from 'rxjs/operators';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/user-profile';

@Component({
  selector: 'wayne-monorepo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // if there is error
  hasError = false;
  errorMsg = '';

  // loading status
  loading = false;

  loginSuccess$ = new BehaviorSubject(null);
  destroy$ = new Subject();

  // login form
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    // for unsubscribing the streams
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    combineLatest(
      [this.loginSuccess$.pipe(
        filter((success) => success),
        takeUntil(this.destroy$)
      ),
      this.auth.currentUser$.pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$)
      )]
    )
      .pipe(
        take(1),
        flatMap(([success, user]) => {
          return this.userService.getUser(user.uid);
        })
      )
      .subscribe((userProfile) => {
        if (!userProfile) {
          // login successful but does not have profile => go to profile page
          this.router.navigate(['/profile']);
        } else {
          // if login succesfully && have profile => go to admin module
          this.router.navigate(['/admin']);
        }
      });
  }

  login() {
    // change to loading status
    this.loading = true;

    this.auth.login(this.loginForm.value).subscribe(
      (u) => {
        // finish processing
        this.loading = false;
        this.loginSuccess$.next(true);
      },
      (error) => {
        // capture login error -> to show error message
        this.hasError = true;
        this.errorMsg = 'Something went wrong. Please try again.';

        if (
          (error.code && error.code === 'auth/user-not-found') ||
          error.code === 'auth/wrong-password'
        ) {
          this.errorMsg = 'Wrong username or password';
        }
        // wait for 2s before close the error message
        setTimeout(() => (this.hasError = false), 5000);

        // finish processing
        this.loading = false;
      }
    );
  }
}
