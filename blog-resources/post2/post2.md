#### ⭐⭐Angular + Spectre CSS⭐⭐

I have used Bootstrap intensively for a project at work, and I must say that Bootstrap framework is very easy to understand and use. That’s why it is so popular these days. However, when it comes to angular apps, I feel that bootstrap is kind of heavy-weight with all the JavaScript code for the components to work. Although there are several implementations, I still feel somewhat the lack of native bootstrap experience. That’s why I was looking for a more light-weight CSS framework for my angular side projects. And I came across Spectre CSS 👍.

From the home page, it says:
**```A Lightweight, Responsive and Modern CSS Framework```**

Similar to bootstrap, it has grid layout, set of various components implemented using pure CSS. For some (modal, e.g.) you have to add your own JavaScript for it to work. But with angular, I can easily create a component to wrap that Spectre component very easily.

So for my blog (wayne-blog), I install Spectre as the primary CSS framework.
To install it, run:

`npm install spectre.css –save`

As I am going to use SASS for my CSS, instead on import spectre.css to my style, I can just import the component that I’m going to use. This will help reduce the CSS bundle of my project.

So in my project, I create a few more scss files to structure the css styles:

 - _theme.scss  : for theming variable (colors…)
 - _spectre-ext.scss: for extending spectre.
 
With _theme.scss, I’ll define my own colors, and also import spectre’s _variables.scss. This will ensure that my variables will override what are in spectre’s.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post2/1.png?raw=true)

With _spectre-ext.scss, I put my additional styles (the ones that are not in spectre CSS)
Some of them are as follow:

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post2/2.png?raw=true)

Finally I will include the two files along with Spectre modules in my styles.scss, and also add app-specific styles.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post2/3.png?raw=true)

This is how a Spectre CSS page look

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post2/4%20%28Small%29.png?raw=true)
