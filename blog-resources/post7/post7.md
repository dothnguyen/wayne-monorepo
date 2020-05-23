1️⃣ In my previous post, I successfully logged in using firebase authentication. However, I have not handled the situation when there are errors (lost connection), or login failure (wrong credentials). So in this post I am going to add that.
First, I will add a variable in LoginComponent, and code to check for error. In RxJs, when we subscribe to a stream, beside the success callback, we have option to pass an error callback which will be called if error happens.
```javascript
export class LoginComponent implements OnInit {
  // if there is error
  hasError = false;
  ----------------------------------
  login() {
    -------------------------------
        (error) => {
          // capture login error -> to show error message
          this.hasError = true;
          // wait for 2s before close the error message
          setTimeout(() => this.hasError = false, 2000);

          ------------------------------------
        }
}
```
Then I’ll add an error message in login.component.html.
```html
<div class="panel-body">
          <div class="toast toast-error mb-5" *ngIf="hasError">
            Error. Invalid email or password.
          </div>
         ----------------------------------------------
```

To use Spectre’s toast, I need to import the toast module to my styles too in styles.scss
```css
@import '../../../node_modules/spectre.css/src/toasts';
```
With this implementation, I will display only 1 message no matter what error did occur. To be more specific on the error that can help users to understand, I will add code to check for the error and display error message accordingly.
So in login.component.ts, I will add another variable for error message:
```javascript
errorMsg = "";
```
Then in error check, it will be
```javascript
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
          // wait for 5s before close the error message
          setTimeout(() => this.hasError = false, 5000);

          // finish processing
          this.loading = false;
        }
```
Let’s test

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post7/post7.gif?raw=true)

2️⃣ Another scenario in my blog is that when I reload the page, I don’t want to login again if I already logged in. To do that, I already store user information in localStorage if you still remember the login method in AuthService
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
      })
    );
  }
```
What I need to do now is that when the app is loading I will check if user information exists in localStorage or not. If yes, then I will set user to logged in state (user profile will come in another post). Otherwise, user will be with not logged in state.
To handle user information state, I will user an RxJs BehaviourSubject to emit the user information every time it changes (start with whatever in localStorage, change to user information after login…). 
```javascript
export class AuthService {
  currentUser$ = new BehaviorSubject(
    JSON.parse(localStorage.getItem('user'))
  );
------------------------------------------
```
Now, after I login successfully, I’ll emit the new user information I got from firebase
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
        this.currentUser$.next(user);  // <= add here
      })
    );
  }
```
I will write a new method in AuthService to return authenticate state.
```javascript
isLoggedIn() {
   return !!this.currentUser$.value;
 }
```
Now I will change the header. If user already logged in, I will display menu for admin access, otherwise it will be only a login button. First, I need to inject my authservice into app component.
```javascript
export class AppComponent {
  constructor(public auth: AuthService) {}
}
```
Then change the header in app.component.html
```html
<section class="navbar-section navbuttons">
      <ul class="nav nav-horizontal">
        <li class="nav-item active"><a class="btn btn-link" routerLink="/">Home</a></li>
        <li class="nav-item"><a href="https://waynedo.azurewebsites.net/" target="_blank" class="btn btn-link">Resume</a></li>
        <li class="nav-item"><a href="https://github.com/dothnguyen" target="_blank" class="btn btn-link">Github</a></li>
        <li class="nav-item" *ngIf="!auth.isLoggedIn()"><a class="btn btn-link" routerLink="/login">Login</a></li>
        <li class="nav-item" *ngIf="auth.isLoggedIn()">
          <div class="dropdown" ><a class="btn btn-link dropdown-toggle" tabindex="0" >
            <span >UserName</span> <i class="icon icon-caret"></i></a>
            <ul class="menu">
              <li class="menu-item" ><a [routerLink]="['/admin']">Admin</a></li>
              <li class="menu-item"><a [routerLink]="['/profile']">Profile</a></li>
              <li class="divider"></li>
              <li class="menu-item"><a href="javascript:void(0);" (click)="logout()">Logout</a></li>
            </ul>
          </div>
        </li>
      </ul> 
    </section>
```
I also added function to handle user logging out
```javascript
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
```
And modify the logout method in authservice to emit empty user information
```javascript
logout() {
    this.fireAuth.signOut();
    localStorage.removeItem('user');
    this.currentUser$.next(null);
  }
```
Now let’s test

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post7/post7_2.gif?raw=true)