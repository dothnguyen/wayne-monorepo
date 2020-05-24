import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserProfile } from '../../../core/models/user-profile';

@Component({
  selector: 'wayne-monorepo-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  loading = false;

  profileForm: FormGroup;

  destroy$ = new Subject();

  saveSuccess$ = new BehaviorSubject(0);

  currentProfile = new UserProfile();
  mode = 0;  // mode new by default

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {
    this.profileForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      avatarUrl: new FormControl('', [
        Validators.pattern(
          '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        ),
      ]),
    });
  }

  ngOnInit() {
    combineLatest([this.userService.currentProfile$, this.auth.currentUser$])
      .pipe(take(1))
      .subscribe(([profile, user]) => {
        if (profile) {
          this.mode = 1; // update
          this.currentProfile = Object.assign({}, profile);
          this.profileForm.patchValue({
            username: profile.userName,
            avatarUrl: profile.avatarURL,
          });
        } else {
          // if profile does not exist, initialize it with user's info
          this.currentProfile.id = user.uid;
          this.currentProfile.email = user.email;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveProfile() {
    const values = this.profileForm.value;

    // get value from form
    this.currentProfile.userName = values.username;
    this.currentProfile.avatarURL = values.avatarUrl;

    // save
    this.userService
      .updateUser(this.mode === 1? this.currentProfile.id : null, this.currentProfile)
      .subscribe(
        (ret) => {
          // save successfully
          this.saveSuccess$.next(1);
          // change mode to modify
          this.mode = 1;

          // send new profile to all that subscribe
          this.userService.currentProfile$.next(this.currentProfile);

          setTimeout(() => {
            this.saveSuccess$.next(0);
          }, 2000);
        },
        (error) => {
          // error
          this.saveSuccess$.next(2);
          setTimeout(() => {
            this.saveSuccess$.next(0);
          }, 2000);
        }
      );
  }
}
