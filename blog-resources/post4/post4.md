1️⃣ **Angular project structure**

I adopt the folder structure described [here](https://itnext.io/choosing-a-highly-scalable-folder-structure-in-angular-d987de65ec7) as I find it easy to understand and navigate around the project.
So in the project’s app folder, I added the modules, core & shared folders. My blog will have 2 modules: user-facing module and admin module. The user-facing module will be in blog folder, the other will be in admin folder.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post4/1.png?raw=true)

For the blog module, as it will be the first one displayed when user opens my blog, I will not lazy-load it.
With the admin module, it will be open be me only and lazy-load is a good thing to do for it.

2️⃣ **Create modules**

I create module file in each folder that needs a module (admin, core, shared). They are similar, like admin.module.ts,… and the code as follow
```typescript
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AdminModule { }
```
Let leave core & shared aside as I want to configure the basic routing of my app only.

3️⃣ **Create container component**

For each module, if it is a single page, then I only need one single component to display the content of the page. But if it has several parts navigate back and forth (list page & detail page), then I will need to add a container component with a router-outlet and a child routing configuration for it.
For now, as I want to create the basic routing only, I will create simple component for each route.
So I will need:

- A Blog Home component for the user-facing page
- An Admin Home component for admin page

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post4/2.png?raw=true)

Code of the components are simple as I have not added anything yet.
```typescript
@Component({
  selector: 'wayne-monorepo-blog-home',
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss']
})
export class BlogHomeComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
}
```

```html
<p>
  blog-home works!
</p>
```
The BlogHomeComponent is not configure to be lazy-load, so it needs to be defined in app.module.ts, in the declarations.

4️⃣  **Routing Setup**

It’s a good practice to keep routing configuration in a separate module. So for the application, I create a main routing module, which is app.routing.ts at the same level of app.module.ts

In app.routing.ts, I need to define my routing structure, like this
```typescript
const appRoutes: Routes = [
  {
      path: '',
      component: BlogHomeComponent
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
];
```

In the configuration:

- The path ```/``` will be handle by BlogHomeComponent
- The path ```/admin``` will be delegated to admin module, by using loadChildren()

Because admin module is lazy-loaded, it needs to defined its own routing structure, which will be children of the parent “/admin” path. So I will create a admin.routing.ts file in admin module.
```typescript
// define the routes in admin module
const adminRoutes: Routes = [
  {
      path: '',
      component: AdminHomeComponent
  }
];

@NgModule({
  declarations: [AdminHomeComponent],
  imports: [CommonModule, RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
```

The ```path:’’``` is equivalent to the root of admin module, which is the /admin. So when we navigate to ```/admin```, AdminHomeComponent will be display.

Finally, I have to import those routing configuration to the modules
```typescript
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [AdminHomeComponent],
  exports: [AdminHomeComponent]
})
export class AdminModule { }
```

```typescript
@NgModule({
  declarations: [AppComponent, BlogHomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Running the app now, we’ll see

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post4/post4.gif?raw=true)

Github: [wayne-monorepo](https://github.com/dothnguyen/wayne-monorepo)