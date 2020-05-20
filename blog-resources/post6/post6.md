For my blog, I don’t want to implement a user management feature as I am the only one who post on the page. Therefore, I will use firebase authentication to handle the login process.
I’ll be following the tutorial [here](https://angular-templates.io/tutorials/about/firebase-authentication-with-angular) for working with firebase.
First thing first, I need to register for firebase, which is detailed in the tutorial.
Then, I need to install firebase lib in my project. So, I run this:
```npm install @angular/fire firebase -save```

With this simple blog, I will configure to user firebase’s username/password authentication. To that, I will go to my firebase console, in Authentication tab I will enable the option, and add a default admin user.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post6/1.png?raw=true)
![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post6/2.png?raw=true)

Now, for authentication I am going to create a service to handle login/logout/check if login logic. I create auth.service.ts in core/services folder. I will also inject an AngularFireAuth to the service to help connect with firebase authentication.
```typescript
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth) {}
}
```
Don’t forget to add firebase configuration to environment.ts too.
Next is to import AngularFire in app main module (app.module.ts):
```typescript
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
```

In AuthService, I will add method for login & logout
```typescript
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
      })
    );
  }
```
I call ```signInWithEmailAndPassword``` and convert it to an RxJs’s observable. When the method return, subcribe method will be called and I’ll save user information in ```localStorage``` for future reference.
The logout method is simple, just call ```logout``` of fireAuth, and remove user information from localStorage.
```typescript
logout() {
  this.fireAuth.signOut();
  localStorage.removeItem('user');
}
```

Now it is time to modify login component to call to auth service and do firebase authentication. But first, I need to inject authService & router to login component.

```typescript
constructor(private auth: AuthService, private router: Router) {}
```
Then add login method:
```typescript
login() {
    this.auth.login(this.loginForm.value).subscribe(u => {
      // if login succesfully => go to admin module
      this.router.navigate(['/admin']);
    },
    error => {
      // capture login error -> to show error message
      
    });
  }
```
Lets test to see if login works, but need to add a call to login() in login.component.html
```html
<form [formGroup]="loginForm" (submit)="login()">
```
And,

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post6/post6_1.gif?raw=true)

The call to firebase takes some time to finish, and when I pressed Enter in the Password, I thought nothing happened. I need to add some kind of indication that the page is processing. Luckily, Spectre CSS has a [.loading class](https://picturepan2.github.io/spectre/utilities/loading.html)
So, lets add loading to login component. For this, I need to declare a loading variable in login.component.ts, and update my login.component.html accordingly.
```typescript
export class LoginComponent implements OnInit {
  // loading status
  loading = false;
--------------------------------------------
login() {
    // change to loading status
    this.loading = true;

    this.auth.login(this.loginForm.value).subscribe(
      (u) => {
        // finish processing
        this.loading = false;

        // if login successfully => go to admin module
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
-----------------------------------------
```
```html
<button
   type="submit"
   [disabled]="!loginForm.valid || loading"
   class="btn btn-primary btn-block"
   [class.loading]="loading">
   Login
 </button>
```

Lets test again

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post6/post6_2.gif?raw=true)

That's it!
Github: [wayne-monorepo](https://github.com/dothnguyen/wayne-monorepo)
