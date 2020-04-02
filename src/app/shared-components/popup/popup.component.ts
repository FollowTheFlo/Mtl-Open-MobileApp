import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {

  isAuth = false;
  constructor(public router: Router, public popoverCtrl: PopoverController, private authService: AuthService) { }

  ngOnInit() {
    console.log('popup ngOnInit');
    this.isAuth = this.authService.getIsAuth();
  }

  async onPress(url) {
    console.log(url);
    await this.popoverCtrl.dismiss();
    this.router.navigate([url]);
  }

}


