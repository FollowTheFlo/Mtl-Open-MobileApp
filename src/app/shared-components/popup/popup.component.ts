import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  selectedLanguage = 'en';
  isAuth = false;
  constructor(
    public router: Router,
    public popoverCtrl: PopoverController,
    private authService: AuthService,
    private translationService: TranslationService,
  ) {}

  ngOnInit() {
    console.log('popup ngOnInit');
    this.isAuth = this.authService.getIsAuth();
    this.selectedLanguage = this.translationService.getLocal();
  }

  async onPress(url) {
    console.log(url);
    await this.popoverCtrl.dismiss();
    this.router.navigate([url]);
  }

  onLocalSelect(selectedlocal) {
    console.log('value', selectedlocal);
    this.selectedLanguage = selectedlocal;
    this.translationService.setLocal(selectedlocal);
  }
}
