One of the features in my blog is to allow me to login and manage my posts. So, I am going to implement that page now.

Firstly, because the login page is not part of the user-facing module, I will configure it to be lazy-load. It is part of admin module, but I don’t want it to be loaded when I already logged in. Therefore, I will not include it in the admin module either. That means I will create a new login module for it, and configure child route for the module at ```“/login”```.

1️⃣ Lets begin be create a login folder in modules folder and add a login.module.ts in that folder. I also add a login.routing.ts for this module too.
```typescript
@NgModule({
  imports: [CommonModule, LoginRoutingModule],
  declarations: [],
  exports: [],
})
export class LoginModule {}
```
```typescript
// define the routes in login module, which is only one page
const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
```

I will go on to create a LoginComponent for my login page

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post5/1.png?raw=true)

The next step is to configure the admin route in the app routing module. So go to app.routing.ts, and add one more path configuration:
```typescript
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
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
];
```
Testing the app now, we will see:

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post5/post5.gif?raw=true)

2️⃣ Now, I will design the login page by putting HTML code in login.component.html
```html
<div class="columns col-gapless">
  <div class="column col-6 col-md-8 col-sm-12 col-mx-auto">
    <form>
      <div class="panel mt-5">
        <div class="panel-header">
          <div class="panel-title text-primary"><h2>Login to Post</h2></div>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label" for="username">User Name</label>
            <input
              class="form-input"
              type="email"
              id="username"
              placeholder="User Name"
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              class="form-input"
              type="password"
              id="password"
              placeholder="Password"
            />
          </div>
        </div>
        <div class="panel-footer">
          <button
            type="submit"
            class="btn btn-primary btn-block"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
```

And the page looks like this

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post5/2.png?raw=true)

3️⃣ I will add reactive form to the page to handle validations and submission. First I need to add ReactiveFormsModule in my admin module imports, then in login.component.ts, I will add form declaration, and finally I will modify login.component.html to add validations
```typescript
@NgModule({
  imports: [CommonModule, LoginRoutingModule, ReactiveFormsModule],
  declarations: [],
  exports: [],
})
export class LoginModule {}
```
```typescript
export class LoginComponent implements OnInit {
  // login form
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {}
  ngOnInit() {}
}
```
```html
<div class="columns col-gapless">
  <div class="column col-6 col-md-8 col-sm-12 col-mx-auto">
    <form [formGroup]="loginForm">
      <div class="panel mt-5">
        <div class="panel-header">
          <div class="panel-title text-primary"><h2>Login to Post</h2></div>
        </div>
        <div class="panel-body">
          <div class="form-group" [class.has-error]="loginForm.get('username').touched && !loginForm.get('username').valid">
            <label class="form-label" for="username">User Name</label>
            <input
              class="form-input"
              type="email"
              id="username"
              placeholder="User Name"
              formControlName="username"
            />
            <p *ngIf="loginForm.get('username').touched && !loginForm.get('username').valid"
                class="form-input-hint">
                Please enter a valid email.
            </p>
          </div>
          <div class="form-group" [class.has-error]="loginForm.get('password').touched && !loginForm.get('password').valid">
            <label class="form-label" for="password">Password</label>
            <input
              class="form-input"
              type="password"
              id="password"
              placeholder="Password"
              formControlName="password"
            />
          </div>
        </div>
        <div class="panel-footer">
          <button
            type="submit"
            [disabled]="!loginForm.valid"
            class="btn btn-primary btn-block"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
```
Run the application now we will see:

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post5/post5_2.gif?raw=true)

Github: [wayne-monorepo](https://github.com/dothnguyen/wayne-monorepo)