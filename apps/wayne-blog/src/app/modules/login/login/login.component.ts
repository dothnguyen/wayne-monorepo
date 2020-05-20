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

    this.auth.login(this.loginForm.value).pipe(delay(2000)).subscribe(
      (u) => {
        // finish processing
        this.loading = false;

        // if login succesfully => go to admin module
        this.router.navigate(['/admin']);
      },
      (error) => {
        // capture login error -> to show error message
        // TODO 

        // finish processing
        this.loading = false;
      }
    );
  }
}
