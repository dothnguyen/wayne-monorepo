For starters, I would like my simple blog to have this layout:
![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post3/1.png?raw=true)

For the main container, I have 2 different layout for user-facing page and admin page.
![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post3/2.png?raw=true)

With admin page, I will keep it simple as the main layout without topic panel.

From the layout, my angular app will have header, footer and a main container that has router-outlet as a placeholder for user-facing page module or admin module.
So, let’s go on and setup the main app page.
I start with app.component.html, adding the basic layout.
```html
<div class="container grid-xl">
  <header class="navbar bg-light p-3 pl-5 pr-5">
  </header>
  <progress class="progress" max="100" ></progress>
  <div class="main-panel">
    <router-outlet></router-outlet>
  </div>
  <footer>
  </footer>
</div>
```

When running the app, I get a page like this
![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post3/3.png?raw=true)

So I will go on and add basic styling for the page to look the way I expected.
```css
// for the header
header {
  height: 150px;
  background-color: #3582c4;
}

// for the progressbar
progress {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
}

// form main-panel
.main-panel {
  background-color: #f6f8f9;
  min-height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
}

// for footer
footer {
  height: 150px;
  background-color: #001f3f;
  display: flex;
  padding: 0.3rem;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}
```
The page now becomes like this
![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post3/5.png?raw=true)

In the header, I’ll add the blog name and a navigation as follow
```html
<header class="navbar bg-light p-3 pl-5 pr-5">
    <section class="navbar-section navtitle">
      <a routerLink="/" class="navbar-brand text-uppercase mr-2 d-block "><h1 class="mb-0">wayne do</h1></a>
      <span class="text-large">coding is fun</span>
    </section>
    <section class="navbar-section navbuttons">
      <ul class="nav nav-horizontal">
        <li class="nav-item active"><a class="btn btn-link" routerLink="/">Home</a></li>
        <li class="nav-item"><a href="https://waynedo.azurewebsites.net/" target="_blank" class="btn btn-link">Resume</a></li>
        <li class="nav-item"><a href="https://github.com/dothnguyen" target="_blank" class="btn btn-link">Github</a></li>
        <li class="nav-item">
          <div class="dropdown" ><a class="btn btn-link dropdown-toggle" tabindex="0" >
          <span >UserName</span> <i class="icon icon-caret"></i></a>
          <ul class="menu">
            <li class="menu-item" ><a [routerLink]="['/admin']">Admin</a></li>
            <li class="menu-item"><a [routerLink]="['/profile']">Profile</a></li>
            <li class="divider"></li>
            <li class="menu-item"><a href="javascript:void(0);">Logout</a></li>
          </ul>
        </div>
        </li>
      </ul>
    </section>
  </header>
```
And styling the elements in the header:
```css
header {
  height: 150px;
  background-color: #3582c4;

  & .navtitle * {
    color: white;
  }

  & .nav-item > a,
  & .nav-item > .dropdown > a {
    color: white;
  }

  & .nav-item > a:hover,
  & .nav-item > .dropdown > a:hover {
    color: #f0f3bd;
  }

  & .nav-item.active > a {
    color: rgb(5, 102, 141);
    background-color: white;
  }

  .navtitle {
    align-items: start;
    flex-direction: column;
  }

  .navbuttons {
    align-items: end;
  }
}
```
Now, the header will look like this
![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post3/8.png?raw=true)

I also use some of font-awesome’s icons for my footer, so I need to install **font-awesome** too by running ```npm install font-awesome –save``` and import it to styles.scss with
```css
@import '../../../node_modules/font-awesome/css/font-awesome.css';
```
The footer now looks like
![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post3/9.png?raw=true)

**Note**: I added both header and footer inside my app-component. The reason is I have only one layout for the whole system, It’s ok to put them in the app-component as I will not change header & footer on the user-facing module as well as the admin module. If I have different layouts for different modules, I would create header & footer as a separate component and reuse them on those modules.