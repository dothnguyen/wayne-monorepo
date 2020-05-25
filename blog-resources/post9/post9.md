1️⃣ In my previous post, I have finished the loading of profile after user logs in. If user does not have a profile yet, I take them to profile page otherwise I take them to admin page.
Now what I have to do is updating user profile on profile page. I already setup profile page with a form that has username & avatar. So, I’m going to add method for saving the profile. 
But first, when user goes to profile page, I need to check if a profile was already setup or not to populate the form with the existing profile. So, similar to app component, I will subscribe to user services’s currentProfile$.
```javascript
currentProfile = new UserProfile();
  mode = 0;  // mode new by default
  ------------------------------------
  ngOnInit() {
    combineLatest([this.userService.currentProfile$, this.auth.currentUser$])
      .pipe(
        take(1),
      ).subscribe(([profile, user]) => {
        if (profile) {
          this.mode = 1; // update
          this.currentProfile = Object.assign({}, profile);
          this.profileForm.patchValue({
            username: profile.userName,
            avatarUrl: profile.avatarURL,
          });
        } else {
          this.currentProfile.id = user.uid;
          this.currentProfile.email = user.email;
        }
      });
  }
```
Now, let’s add method to save profile in profile component
```javascript
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
```
I also modified profile.component.html to add successful & error message
```html
<div class="column col-6 col-md-8 col-sm-12 col-mx-auto pt-5">
    <div class="toast toast-success" *ngIf="(saveSuccess$ | async) === 1">
      <button class="btn btn-clear float-right"></button>
      Profile saved successfully.
    </div>
    <div class="toast toast-danger" *ngIf="(saveSuccess$ | async) === 2">
      <button class="btn btn-clear float-right"></button>
      Error while saving, Please try again.
    </div>
    <form [formGroup]="profileForm" (submit)="saveProfile()">
```
The profile page is working as expected.

2️⃣  🐞🐞🐞 I found another problem with my blog. It is when you successfully login and then reload the page, your profile will not be loaded. Instead, it will display “Welcome” on the header. The reason is that in app.component.ts, I only subscribe to user service’s currentProfile$ . But after the page is initialized, the currentProfile$ has nothing to emit, although I can load user info from local storage.


Therefore, I will fix this problem, by check & load user profile at start up if user already logged in. To do this, in app.component.ts constructor, I will check auth’s currentUser$ and load user profile.
```javascript
ngOnInit() {
    this.auth.currentUser$
      .pipe(
        flatMap((user) => {
          if (user) {
            return this.userService.getUser(user.uid);
          } else {
            return of(new UserProfile());
          }
        }),
        take(1) // only take the first one that is from localstorage
      )
      .subscribe();

    this.userProfile$ = this.userService.currentProfile$;
  }
```

