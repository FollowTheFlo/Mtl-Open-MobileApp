import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Player } from '../../models/player.model';
import { PlayersService } from '../players.service';
import { Router } from '@angular/router';
import { GraphqlService } from '../../graphql/graphql.service';
import { AuthService } from '../../auth/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { NavigationService} from '../../navigation.service';

@Component({
  selector: 'app-player-create',
  templateUrl: './player-create.page.html',
  styleUrls: ['./player-create.page.scss'],
})
export class PlayerCreatePage implements OnInit {

  userEmail = '';
  constructor(public playersService: PlayersService,
              public router: Router,
              public graphqlService: GraphqlService,
              public authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navigationService: NavigationService
              ) { }
  ionViewDidEnter() {
    this.navigationService.setNavLink('Fill Details');
  }

  ngOnInit() {
    
    console.log('this.playersService.isPlayerListEmpty: ',this.playersService.isPlayerListEmpty())
    if (this.playersService.isPlayerListEmpty()) {
      if (this.authService.currentUser !== undefined && this.authService.currentUser.email !== undefined) {
        this.userEmail = this.authService.currentUser.email;
      }
    }
  }
  onAddPlayer(form: NgForm) {
    console.log('onAddPlayer');
    if (form.invalid) {
      return;
    }

    this.loadingCtrl.create({ keyboardClose: true, message: 'Creating player...' }).then((loadingEl) => {
      loadingEl.present();

    this.playersService.createPlayer(
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.ranking

    ).
    subscribe( userData => {
      loadingEl.dismiss();
      console.log('createPlayer result: ', userData);
      if (!userData) {
       
        return;
      }
      const player: Player = userData;
      this.graphqlService.resetStore().then( res => {
        console.log('Apollo Store Cache reset:', res);
      });

      this.router.navigate(['player-list']);


    });
  });
  }

  private showAlert(head: string, message: string) {
    this.alertCtrl
      .create({ header: head, message: message, buttons: ['okay'] })
      .then((alertEl) => alertEl.present());
  }

}
