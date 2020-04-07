import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NavigationService } from '../../navigation.service';

// import {MatDialog} from '@angular/material/dialog';
// import { ModalService } from '../../modal/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnDestroy {
  isLoading = false;
  private routeSub: Subscription;
  private authSub: Subscription;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navigationService: NavigationService,
  ) {}

  ionViewDidEnter() {
    this.navigationService.setNavLink('SIGNUP');
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  onFbSignup() {
    console.log('onFbLogin');
    //this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'Signing-up with facebook info...' }).then((loadingEl) => {
      loadingEl.present();
      this.authService.fbSignup().subscribe(
        (response) => {
          // this.isLoading = false;
          loadingEl.dismiss();
          if (response) {
            //this.showAlert('success');
            this.router.navigate(['/player-list']);
          } else {
            this.showAlert('Facebook Signup Error', 'Facebook Signup Error');
          }
        },
        (error) => {
          this.isLoading = false;
          this.showAlert('Facebook Login Error', error);
        },
      );
    });
  }

  onSignup(form: NgForm) {
    console.log('onSignup1', form);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.loadingCtrl.create({ keyboardClose: true, message: 'Signup...' }).then((loadingEl) => {
      loadingEl.present();
      console.log('signup credentials', form.value.username, form.value.email, form.value.password);
      this.authSub = this.authService.signup(form.value.username, form.value.email, form.value.password).subscribe(
        (response) => {
          this.isLoading = false;
          loadingEl.dismiss();
          if (response) {
            this.router.navigate(['/player-list']);
            //this.showAlert('success');
          } else {
            this.showAlert('Signup Error', 'Signup Error');
            // this.modalService.openModal('Error', 'Login Error', 'Login Error');
          }
        },
        (error) => {
          loadingEl.dismiss();
          this.isLoading = false;
          this.showAlert('Signup Error', error);
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
    this.alertCtrl.create({ header: head, message: message, buttons: ['okay'] }).then((alertEl) => alertEl.present());
  }
}
