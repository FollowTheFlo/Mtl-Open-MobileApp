import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { PopupComponent } from './../../shared-components/popup/popup.component';
import { NavigationService } from '../../navigation.service';

// import {MatDialog} from '@angular/material/dialog';
// import { ModalService } from '../../modal/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  isLoading = false;
  private routeSub: Subscription;
  private authSub: Subscription;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private navigationService: NavigationService,
  ) {}
  async presentPopover(ev: any) {
    console.log('presentPopover');
    const popover = await this.popoverCtrl.create({
      component: PopupComponent,
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }

  ionViewDidEnter() {
    this.navigationService.setNavLink('LOGIN');
  }

  ngOnInit() {
    // this.translate.use('fr');
    //this.authService.clearAuthData();
    this.routeSub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log('onLogout1 param logout: ', paramMap);
      console.log('onLogout2 param logout: ', paramMap.has('logout:'));
      console.log('onLogout3 param logout: ', paramMap.keys);
      if (paramMap.has('logout')) {
        this.navigationService.setNavLink('LOGOUT');
        console.log('onLogout4 param logout');
        this.authService.logout();
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  onFbLogin() {
    console.log('onFbLogin');
    //this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'logging in...' }).then((loadingEl) => {
      loadingEl.present();
      this.authService.fbLogin().subscribe(
        (response) => {
          // this.isLoading = false;
          loadingEl.dismiss();
          if (response) {
            //this.showAlert('success');
            this.router.navigate(['/player-list']);
          } else {
            this.showAlert('Facebook Login Error', 'Facebook Login Error');
          }
        },
        (error) => {
          this.isLoading = false;
          this.showAlert('Facebook Login Error', error);
        },
      );
    });
  }

  onLogin(form: NgForm) {
    console.log('onLogin1', form);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.loadingCtrl.create({ keyboardClose: true, message: 'logging in...' }).then((loadingEl) => {
      loadingEl.present();
      console.log('credentials', form.value.email, form.value.password);
      this.authSub = this.authService.login(form.value.email, form.value.password).subscribe(
        (response) => {
          this.isLoading = false;
          loadingEl.dismiss();
          if (response) {
            this.router.navigate(['/player-list']);
            //this.showAlert('success');
          } else {
            this.showAlert('Login Error', 'Login Error');
            // this.modalService.openModal('Error', 'Login Error', 'Login Error');
          }
        },
        (error) => {
          loadingEl.dismiss();
          this.isLoading = false;
          this.showAlert('Login Error', error);
          //this.modalService.openModal('Error', 'Login Error', error);
        },
      );
    });
  }

  // logout() {
  //   console.log("onLogout");
  //   this.authService.logout();

  // }
  private showAlert(head: string, message: string) {
    this.alertCtrl
      .create({ header: 'Authentification failed', message: message, buttons: ['okay'] })
      .then((alertEl) => alertEl.present());
  }
}
