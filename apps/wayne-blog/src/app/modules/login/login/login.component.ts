import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'wayne-monorepo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // if there is error
  hasError = false;
  errorMsg = "";

  // loading status
  loading = false;

  // login form
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    // change to loading status
    this.loading = true;

    this.auth
      .login(this.loginForm.value)
      .subscribe(
        (u) => {
          // finish processing
          this.loading = false;

          // if login succesfully => go to admin module
          this.router.navigate(['/admin']);
        },
        (error) => {
          // capture login error -> to show error message
          this.hasError = true;
          this.errorMsg = "Something went wrong. Please try again.";

          if (
            (error.code && (error.code === 'auth/user-not-found') ||
            error.code === 'auth/wrong-password')
          ) {
            this.errorMsg = "Wrong username or password";
          }
          // wait for 2s before close the error message
          setTimeout(() => this.hasError = false, 5000);

          // finish processing
          this.loading = false;
        }
      );
  }
}
