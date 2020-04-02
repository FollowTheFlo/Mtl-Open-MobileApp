import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  role = '';
  private authSub: Subscription;

  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService) {
    this.initializeApp();
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

    

  ngOnInit() {
    
    this.authSub = this.authService.getAuthStatusListener().subscribe( authData => {
      console.log('MainNavComponent Listener isAuth: ', authData.isAuthenticated);
     
      if(this.authService.getIsAuth() && !authData.isAdmin) {
        this.role = 'user';
      } else if (this.authService.getIsAuth() && authData.isAdmin) {
        this.role = 'admin';
      } else {
        this.role = '';
      }
    }

    );

    this.authService.autoAuthUser();
  }
}
