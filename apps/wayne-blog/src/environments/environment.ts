// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebaseConfig: {
    apiKey: 'AIzaSyBEb7XFTMSx7ja6RAEPyxV6A9xuwnMuuP0',
    authDomain: 'wayne-blog-75738.firebaseapp.com',
    databaseURL: 'https://wayne-blog-75738.firebaseio.com',
    projectId: 'wayne-blog-75738',
    storageBucket: 'wayne-blog-75738.appspot.com',
    messagingSenderId: '77668368203',
    appId: '1:77668368203:web:11b341f8165969fc8ef2ce',
  },
};

export const BASE_API_URL = 'http://localhost:5000/api';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
