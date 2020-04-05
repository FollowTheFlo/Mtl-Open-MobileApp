import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  //@ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  role = '';
  private authSub: Subscription;
  private pltSub: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private location: Location,
    private authService: AuthService,
  ) {
    this.initializeApp();
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  backButtonEvent() {
    this.pltSub = this.platform.backButton.subscribe(() => {
      console.log('backButtonEvent', this.location.path);

      this.location.back();
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.pltSub) {
      this.pltSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.authSub = this.authService.getAuthStatusListener().subscribe((authData) => {
      console.log('MainNavComponent Listener isAuth: ', authData.isAuthenticated);

      if (this.authService.getIsAuth() && !authData.isAdmin) {
        this.role = 'user';
      } else if (this.authService.getIsAuth() && authData.isAdmin) {
        this.role = 'admin';
      } else {
        this.role = '';
      }
    });

    this.authService.autoAuthUser();
  }
}
