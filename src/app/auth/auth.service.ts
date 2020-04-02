import { Injectable } from '@angular/core';
import { GraphqlService } from '../graphql/graphql.service';
import { Subject, Subscription, BehaviorSubject, Observable, of, from, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { take, map, tap, delay, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { registerWebPlugin } from '@capacitor/core';
import { FacebookLogin } from '@rdlabo/capacitor-facebook-login';
import { Plugins } from '@capacitor/core';
import * as JWT from 'jwt-decode';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';

declare const FB: any;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: User;
  private userId: string;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<{ isAuthenticated: boolean; isAdmin: boolean }>();
  private isAdmin = false;
  facebookResponse: FacebookLoginResponse;

  constructor(
    private graphqlService: GraphqlService,
    public router: Router, 
    private fb: Facebook,
    public platform: Platform) {
    // FB.init({
    //   appId :  environment.FACEBOOK_APP_ID,
    //   status : true,
    //   cookie : true,
    //   xfbml  : true,
    //   version : 'v6.0'
    // });
   // registerWebPlugin(FacebookLogin);
   console.log('this.platform: ', this.platform);

   this.platform.is('desktop') ? console.log('is desktop'): false ;
   this.platform.is('android') ? console.log('is android'): false;
   this.platform.is('capacitor') ? console.log('is capacitor'): false;
   this.platform.is('cordova') ? console.log('is cordova'): false;
   this.platform.is('hybrid') ? console.log('is hybrid'): false;
   this.platform.is('mobile') ? console.log('is mobile'): false;
   this.platform.is('pwa') ? console.log('is pwa'): false;
   this.platform.is('hybrid') ? console.log('is pwa'): false;

   if (!this.platform.is('hybrid')) {
    this.loadFBSDK();
   }
   
  }

  login(email: string, password: string) {
    console.log('login');
    //this.clearAuthData();
    // const authData: AuthData = { email, password };
    return this.graphqlService.login(email, password).pipe(
      map((result) => {
        if (result.errors && result.errors[0]) {
          console.log('login error data: ', result.errors[0].message);
          throw new Error(result.errors[0].message);
        }
        return result.data.login;
      }),
      map((response) => {
        console.log('user login: ', response.userId);
        if (!response) {
          throw new Error('could not login');
        }
        this.user = { _id: response.userId, email, username: response.username, password: 'n/a' };

        // this.user = result;
        // console.log('user login2: ', this.user);
        // this.router.navigate(['list']);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          console.log('expiresInDuration', response);
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          const tokenPayload: any = JWT(token);
          this.isAdmin = tokenPayload.role === 'admin' ? true : false;

          this.authStatusListener.next({ isAuthenticated: true, isAdmin: this.isAdmin });
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          // console.log(expirationDate);
          this.saveAuthData(token, expirationDate);

          return true;
        }
      }),
    );
  }

  statusChangeCallback = (response) => {
    // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response); // The current login status of the person.
    if (response.status === 'connected') {
      // Logged into your webpage and Facebook.
      this.testAPI();
    } else {
      // Not logged into your webpage or we are unable to tell.
      // document.getElementById('status').innerHTML = 'Please log ' +
      //   'into this webpage.';
      console.log('status please log');
    }
  }

  checkLoginState() {
    // Called when a person is finished with the Login Button.

    FB.getLoginStatus(function (response) {
      // See the onlogin handler
      console.log('statusChangeCallback');
      console.log(response); // The current login status of the person.
      if (response.status === 'connected') {
        // Logged into your webpage and Facebook.
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
          console.log('Successful login for: ' + response.name);
          // document.getElementById('status').innerHTML =
          //   'Thanks for logging in, ' + response.name + '!';
          console.log('Thanks for logging in', response.name);
        });
      } else {
        // Not logged into your webpage or we are unable to tell.
        // document.getElementById('status').innerHTML = 'Please log ' +
        //   'into this webpage.';
        console.log('status please log');
      }
    });
  }

  testAPI() {
    // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
      console.log('Successful login for: ' + response.name);
      // document.getElementById('status').innerHTML =
      //   'Thanks for logging in, ' + response.name + '!';
      console.log('Thanks for logging in', response.name);
    });
  }

  loadFBSDK() {
    let self = this;
    (<any>window).fbAsyncInit = () => {
      FB.init({
        appId: environment.FACEBOOK_APP_ID,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v6.0',
      });
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-js-sdk');
  }

  fbLogin() {

    
    console.log('fbLogin1');

   
      // 'hybrid' detects both Cordova and Capacitor
      if (this.platform.is('hybrid')) {
        console.log('hybrid');

        return from(
          new Promise<boolean>((resolve, reject) => {
          this.fb.login(['public_profile', 'email'])
            .then((resData: FacebookLoginResponse) => {
              console.log('Logged into Ffacebook!', resData);
              
              
                  this.fb.api('/' + resData.authResponse.userID + '/?fields=id,email,name', ['public_profile']).then( resData => {
                    console.log('Successful login for: ' + resData.name);
                    // document.getElementById('status').innerHTML =
                    //   'Thanks for logging in, ' + response.name + '!';
                    console.log('Thanks for logging in', resData);
                    
    
                    this.login(resData.email, resData.id).subscribe(
                      (success) => {
                        resolve(success);
                      },
                      (error) => {
                        console.log('in fb login auth error', error);
                        reject(error);
                      },
                    );
                  
                  //resolve(success);
                },
                (error) => {
                  console.log('in fb login auth error', error);
                  reject(error);
                },
              );
            
            })
            .catch(e => {
              console.log('Error logging into Facebook', e)
              reject(e);
            })
          })
            );
        // make your native API calls
      } else {
        console.log('browser');
         return from(
      new Promise<boolean>((resolve, reject) => {
        FB.login(
          (response) => {
            // Called after the JS SDK has been initialized.
            console.log('statusChangeCallback');
            console.log(response); // The current login status of the person.
            if (response.status === 'connected') {
              // Logged into your webpage and Facebook.
              console.log('Login Welcome!  Fetching your information.... ');
              FB.api('/me?fields=id,name,email', (resData) => {
                console.log('Successful login for: ' + resData.name);
                // document.getElementById('status').innerHTML =
                //   'Thanks for logging in, ' + response.name + '!';
                console.log('Thanks for logging in', resData);

                this.login(resData.email, resData.id).subscribe(
                  (success) => {
                    resolve(success);
                  },
                  (error) => {
                    console.log('in fb login auth error', error);
                    reject(error);
                  },
                );
              });
            } else {
              // Not logged into your webpage or we are unable to tell.
              // document.getElementById('status').innerHTML = 'Please log ' +
              //   'into this webpage.';
              console.log('status NOt connect please log');
              reject('could not fetch Fb profile');
            }
          },
          { scope: 'public_profile,email' },
        );
      })
         );
    
        // fallback to browser APIs
      }
   
  }

  fbSignup() {
    console.log('fbSignup1');

   
      // 'hybrid' detects both Cordova and Capacitor
      if (this.platform.is('hybrid')) {
        console.log('hybrid');

        return from(
          new Promise<boolean>((resolve, reject) => {
          this.fb.login(['public_profile', 'email'])
            .then((resData: FacebookLoginResponse) => {
              console.log('Logged into Facebook!', resData);
              
              
                  this.fb.api('/' + resData.authResponse.userID + '/?fields=id,email,name', ['public_profile']).then( resData => {
                    console.log('Successful fb signup for: ' + resData.name);
                    // document.getElementById('status').innerHTML =
                    //   'Thanks for logging in, ' + response.name + '!';
                    console.log('Thanks for signup', resData);
                    
    
                    this.signup(resData.name,resData.email, resData.id).subscribe(
                      (success) => {
                        resolve(success);
                      },
                      (error) => {
                        console.log('in fb signup auth error', error);
                        reject(error);
                      },
                    );
                  
                 
                },
                (error) => {
                  console.log('in fb signup auth error', error);
                  reject(error);
                },
              );
            
            })
            .catch(e => {
              console.log('Error logging into Facebook', e)
              reject(e);
            })
          })
            );
        // make your native API calls
      } else {
        console.log('browser');
         return from(
      new Promise<boolean>((resolve, reject) => {
        FB.login(
          (response) => {
            // Called after the JS SDK has been initialized.
            console.log('statusChangeCallback');
            console.log(response); // The current login status of the person.
            if (response.status === 'connected') {
              // Logged into your webpage and Facebook.
              console.log('FB Sigup Welcome!  Fetching your information.... ');
              FB.api('/me?fields=id,name,email', (resData) => {
                console.log('Successful login for: ' + resData.name);
                // document.getElementById('status').innerHTML =
                //   'Thanks for logging in, ' + response.name + '!';
                console.log('Thanks for logging in', resData);

                this.signup(resData.name, resData.email, resData.id).subscribe(
                  (success) => {
                    resolve(success);
                  },
                  (error) => {
                    console.log('in fb login auth error', error);
                    reject(error);
                  },
                );
              });
            } else {
              // Not logged into your webpage or we are unable to tell.
              // document.getElementById('status').innerHTML = 'Please log ' +
              //   'into this webpage.';
              console.log('status NOt connect please log');
              reject('could not fetch Fb profile');
            }
          },
          { scope: 'public_profile,email' },
        );
      })
         );
    
        // fallback to browser APIs
      }
  }

  getUserInfo() {
    return this.graphqlService.getUserInfo().pipe(map((response) => response.data.getUserInfo));
  }

  checkPasswordToken(token: string) {
    return this.graphqlService.checkPasswordToken(token).pipe(map((response) => response.data.checkPasswordToken));
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  get currentUser() {
    console.log('get currentUser(): ', this.user);
    return this.user;
  }

  signup(userName: string, email: string, password: string) {
    console.log('in signup');
    return this.graphqlService.signup(userName, email, password).pipe(
      map((result) => {
        console.log('signup data: ', result);
        if (result.errors && result.errors[0]) {
          console.log('signup data: ', result.errors[0].message);
          throw new Error(result.errors[0].message);
        }
        return result.data.createUser;
      }),
      map((result) => {
        console.log('user signup1: ', result);
        if (!result) {
          alert('error');
          return false;
        }
        this.user = result;
        console.log('user signup2: ', this.user);
        return true;
      }),
      switchMap((response) => {
        console.log('within switchmap, response: ', response);
        return this.login(email, password);
      }),
    );
  }

  resetPassword(email: string) {
    console.log('resetPassword: ', email);
    return this.graphqlService.resetPassword(email).pipe(
      map((result) => {
        if (result.errors && result.errors[0]) {
          console.log('login error data: ', result.errors[0].message);
          throw new Error(result.errors[0].message);
        }
        return result.data.resetPassword;
      }),
    );
  }

  updatePassword(token: string, userId: string, password: string) {
    console.log('updatePassword');
    return this.graphqlService.updatePassword(token, userId, password).pipe(
      map((result) => {
        if (result.errors && result.errors[0]) {
          console.log('updatePassword error data: ', result.errors[0].message);
          throw new Error(result.errors[0].message);
        }
        return result.data.updatePassword;
      }),
    );
  }

  autoAuthUser() {
    console.log('autoAuthUser()');
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;

      const tokenPayload: any = JWT(this.token);
      this.isAdmin = tokenPayload.role === 'admin' ? true : false;

      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.getUserInfo();
      this.authStatusListener.next({ isAuthenticated: false, isAdmin: this.isAdmin });
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    console.log('in Logout: this.authStatusListener.next(false)');
    this.authStatusListener.next({ isAuthenticated: false, isAdmin: this.isAdmin });
    //clearTimeout(this.tokenTimer);
    this.clearAuthData();
    /*
    this.graphqlService.resetStore().then( result => {
      console.log('Apollo Store Cache reset:', result);
    }).catch(err => {
      console.log('Apollo Store Cache error:', err);
    }); */

    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    console.log('saveAuthData: token: ', token);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  public clearAuthData() {
    console.log('clearAuthData');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    // localStorage.removeItem("expiration");
    this.graphqlService
      .resetStore()
      .then((result) => {
        console.log('Apollo Store Cache reset:', result);
      })
      .catch((err) => {
        console.log('Apollo Store Cache error:', err);
      });
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
