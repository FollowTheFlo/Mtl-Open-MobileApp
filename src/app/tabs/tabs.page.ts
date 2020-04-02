import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RegistrationsService } from '../registrations/registrations.service';
import { AuthService } from '../auth/auth.service';
import { PopupComponent } from './../shared-components/popup/popup.component';
import { PopoverController } from '@ionic/angular';
import { NavigationService} from '../navigation.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {

  cartItemsNumber = 0;
  isAuth = false;
  topTitle = "";
  private authSub: Subscription;
  private navSub: Subscription;

  constructor(private registrationsService: RegistrationsService,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private navigationService: NavigationService
    ) { }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.navSub) {
      this.navSub.unsubscribe();
    }
  }

  ngOnInit() {
    console.log('Tab ngOnInit');
    this.isAuth =this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe( authData => {
      console.log('MainNavComponent Listener isAuth: ', authData.isAuthenticated);
    this.isAuth = authData.isAuthenticated;
    
    });
    this.navSub = this.navigationService.getNavListener().subscribe( link => {
      console.log('getNavListener',link);
    this.topTitle = link;
    });
    this.authSub = this.registrationsService.selectedTournaments$.subscribe( tempRegList => {
      this.cartItemsNumber = tempRegList.filter( selection => selection.isLocal === true).length;

    });
   

  }

  async presentPopover(ev: any) {
    console.log('presentPopover');
    const popover = await this.popoverCtrl.create({
      component: PopupComponent,
      event: ev,
      translucent: true
    });
    popover.style.cssText = '--min-width: 120px; --max-width: 140px;';
    return await popover.present();
  }

}
