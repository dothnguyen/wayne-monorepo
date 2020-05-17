##### Monorepo and Angular project
I've spent some time experimenting angular app, and come across monorepo achitecture. To me, it's quite intriguing. Basically you'll have all of you projects in one big repository. The pros are that it's easy to manage as everything is in one place; and it's also easy to share configurations among apps & libs (help to reduce the incompatible issue when different apps & libs use different version of a library).

In Angular, there is a tool to manage monorepo with angular projects (and its not just for angular but basically for any Javascript - Typescript kind of projects). It is [Nrwl](https://nx.dev/)

So, I install Nrwl client, which is easy enough with 

**```npm  install -g @nrwl/cli```**

The first step is to generate a monorepo workspace. 
Head to your project folder and run:

**```npx create-nx-workspace@latest```**

Input your workspace name, and select empty workspace. If you are to use Angular, then select the Angular CLI as the CLI to power the Nx workspace. This will be the result:

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post1/1.png?raw=true)

Now, if we open the workspace in VSCode,

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post1/2.png?raw=true )

The next step is to add Angular plugin to the workspace. This will add angular dependencies to the package.json created in the workspace. Without doing this, if you create an angular project, the project will not be able to build.
Run **```nx add @nrwl/angular```**, you'll see Angular dependencies were added.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post1/4.png?raw=true)

Now, we are ready to generate the first angular app in our workspace.

**```nx generate @nrwl/angular:app wayne-blog```**

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post1/6.png?raw=true)

We can use ```ng serve``` to run the app, but have to add the ```--project``` param to specify which project we want to run

**```ng serve --project=wayne-blog```**

And that's it.

![enter image description here](https://github.com/dothnguyen/wayne-monorepo/blob/blog-posts/blog-resources/post1/8.png?raw=true)
