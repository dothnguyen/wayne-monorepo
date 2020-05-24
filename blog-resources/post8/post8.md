Up until now, I can login in my blog using email/password that I added in firebase. However, firebase only return basic user information (id, email, token). I want to configure user profile with more information (name, avatar…). So, I need to have a profile management feature that allow user to update their own profile. 
For this feature, I need to have a backend api to handle & store user profile, along with a database for storing that information. I am going into details about my backend here, it will be in another post. What I have done is a .net core backend deployed on Heroku and used Heroku Postgres database. I am using free plan for those with some limitations, but still good enough for this project.
Let’s say I run my backend on my localhost, the endpoints for user profile are:
-	GET ```http://localhost:5000/api/users/{id}``` getting profile of user with id
-	POST ```http://localhost:5000/api/users``` create new user profile
-	PUT ```http://localhost:5000/api/users/{id}``` update an existing profile
For those endpoints, I’ll pass user profile model with information of the user as follow, in core/models/user-profile.ts:
```javascript
export class UserProfile {
  id: string;
  userName: string;
  email: string;
  avatarURL: string;
}
```
I will create a new service (user.service.ts) to handle user profile. In that service, I will have method for getting profile and saving profile
```javascript
@Injectable({
  providedIn: 'root',
})
export class UserService {
  USER_ENPOINT = `${BASE_API_URL}/users`;

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<UserProfile> {
    return this.http.get<ServiceResult>(`${this.USER_ENPOINT}/${id}`).pipe(
      map((result) => result.result),
      shareReplay()
    );
  }

  updateUser(id: string, profile: UserProfile) {
    if (!id) {
      // new profile
      return this.http.post<boolean>(`${this.USER_ENPOINT}`, profile);
    } else {
      // update existing profile
      return this.http.put<boolean>(`${this.USER_ENPOINT}/${id}`, profile);
    }
  }
}
```
1️⃣ Now what I need to do is, after I logged in, I will use the information returned from firebase and fetch user profile, then use that to display the name on the header.
Remember in auth service, after I logged in, I will emit the basic user information from firebase
```javascript
login(value: { username: string; password: string }) {
    return from(
      this.fireAuth.signInWithEmailAndPassword(value.username, value.password)
    ).pipe(
      first(),
      tap((u) => {
        const user = {
          uid: u.user.uid,
          email: u.user.email,
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser$.next(user);      // <== this
      })
    );
  }
```
So, in app.component.ts, I just need to subscribe to this stream and call user service to get user profile.
```javascript
export class AppComponent implements OnInit {
  userProfile$: Observable<UserProfile>;

  constructor(
    public auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userProfile$ = this.auth.currentUser$.pipe(
      switchMap((userInfo) => {
        if (!userInfo)
          return of(null);
        return this.userService.getUser(userInfo.uid);
      })
    );
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
```
Let’s see if profile is loaded or not:

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post8/post8.gif?raw=true)

2️⃣ When you are a new user, I want that right after you login you will be redirect to a profile page for updating your profile if you haven’t done so. 
For this, I’ll create a new profile page, which looks like this

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post8/1.png?raw=true)

I will setup this page in a separate module as it will be rarely accessed. And it’s not in Login module either as once you have logged in you will still be able to access it.
So, I will create a profile folder in modules, and create a new profile.module.ts in there. I will also create a profile.routing.ts to configure routing for this module. Then, I will create a profile component.
```javascript
@NgModule({
  imports: [CommonModule, ProfileRoutingModule, ReactiveFormsModule],
  declarations: [ProfileComponent],
  exports: [],
})
export class ProfileModule {}
```

```javascript
// define the routes in login module, which is only one page
const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(profileRoutes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
```
Now, configure the profile module for path  /profile, in app.routing.ts
```javascript
const appRoutes: Routes = [
  {
    path: '',
    component: BlogHomeComponent,
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
];
```
With the profile component
```javascript
export class ProfileComponent implements OnInit {
  loading = false;

  profileForm: FormGroup;

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

  ngOnInit() {}
}
```
and html code
```html
<div class="columns col-gapless">
  <div class="column col-6 col-md-8 col-sm-12 col-mx-auto">
      <form [formGroup]="profileForm">
        <div class="panel mt-5">
          <div class="panel-header">
            <div class="panel-title text-primary"><h2>Update your profile</h2></div>
          </div>
          <div class="panel-body">
              <div class="form-group"
                [class.has-error]="profileForm.get('username').touched && !profileForm.get('username').valid">
      
                <label class="form-label" for="username">User Name</label>
                <input
                    class="form-input"
                    type="text"
                    id="username"
                    placeholder="User Name"
                    formControlName="username"/>
        
                <p *ngIf="profileForm.get('username').touched && !profileForm.get('username').valid"
                    class="form-input-hint">
                    Please enter a your name.
                </p>
              </div>
              <div class="form-group">
                <label class="form-label" for="avatarUrl">Avatar Url</label>
                <input type="url" id="avatarUrl" class="form-input" formControlName="avatarUrl" placeholder="Avatar Url"/>
                <p *ngIf="profileForm.get('avatarUrl').touched && !profileForm.get('avatarUrl').valid"
                    class="form-input-hint">
                    Please enter a valid url.
                </p>
              </div>
              <div *ngIf="profileForm.get('avatarUrl').valid">
                  <img class="s-circle" [src]="profileForm.get('avatarUrl').value" alt="" width="100" height="100">
              </div>
          </div>
          <div class="panel-footer">
            <button type="submit" [disabled]="!profileForm.valid || loading" [class.loading]="loading" class="btn btn-primary btn-block">
              Save
            </button>
          </div>
        </div>
      </form>
  </div>
</div>
```
Next thing is to check after user logs in, if a profile exists then redirect user to /admin page, otherwise redirect to /profile page.
To do this, I will change login.component.ts, adding these 2 variables
```javascript
loginSuccess$ = new BehaviorSubject(null);
destroy$ = new Subject();
```
And modify login method to instead of redirect to admin page, I will just raise a signal that user logs in successfully.
```javascript
this.auth.login(this.loginForm.value).subscribe(
      (u) => {
        // finish processing
        this.loading = false;
        this.loginSuccess$.next(true);
      },
---------------------------------------
```
The signal will be capture in ngOnInit method where I subscribe to a stream:
```javascript
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
```
The app now runs as I expected:

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post8/post8_2.gif?raw=true)

There is one problem. As app.component.ts subscribes to auth.currentUser$ to reload user profile for displaying in the header. That combines with the new login check result in 2 identical calls to the backend to load user profile.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post8/2.png?raw=true)

I have to fix it to not wasting my resource.
To fix this, I declare a new stream in user service. Whenever the method getUser returns, the stream will emit and cache that value.

```javascript
currentProfile$ = new BehaviorSubject<UserProfile>(null);

  getUser(id: string): Observable<UserProfile> {
    return this.http.get<ServiceResult>(`${this.USER_ENPOINT}/${id}`).pipe(
      map((result) => {
        if (result.code === ResultCode.OK)
          return result.result;
        return null;
      }),
      tap(user => {
        this.currentProfile$.next(user);		// emit the loaded profile
      }),
      shareReplay()
    );
  }
```
And modify my app.component.ts to use this new stream, instead of the auth’s currentUser$
```javascript
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
```
The result is that the app works the same way, but with only one call to the backend.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post8/3.png?raw=true)

Github: [wayne-monorepo](https://github.com/dothnguyen/wayne-monorepo/commit/33d5f6d22215c5003ba7e83021cdf5acac69c8f6)
