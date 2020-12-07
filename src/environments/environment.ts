// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyC-I_iX9Z3WmWu55FPVu-wO7FcMmomCf2Q",
    authDomain: "dfg-firebase.firebaseapp.com",
    databaseURL: "https://dfg-firebase.firebaseio.com",
    projectId: "dfg-firebase",
    storageBucket: "dfg-firebase.appspot.com",
    messagingSenderId: "20702031947",
    appId: "1:20702031947:web:125bc26378e8bb22269dce",
    measurementId: "G-KHYHXRQRZW"
  },
  djangourl : "http://127.0.0.1:8000/app/",
  OpenPay :{
    private_key: "sk_c32d4da0ab4b4ef0a2fa777a4b125f8e",
    public_key: "pk_fce4be578c3047618a6a92e47f2df328",
    merchant_id: "m1ohcxub6gkzqxlrvhae",
    url: "https://sandbox-api.openpay.mx/v1/",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
