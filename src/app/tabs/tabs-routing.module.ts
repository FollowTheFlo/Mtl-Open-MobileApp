import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { AuthGuardService } from './../auth/auth-guard.service';
import { RoleGuardService } from './../auth/role-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'login',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../auth/login/login.module').then((m) => m.LoginPageModule),
              }
            ]
            
        },
        {
          path: 'logout/:logout',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../auth/login/login.module').then((m) => m.LoginPageModule)
                , canActivate: [AuthGuardService]
              }
            ]
            
        },
        {
          path: 'signup',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../auth/signup/signup.module').then((m) => m.SignupPageModule)
              
              }
            ]
            
        },
        {
          path: 'player-list',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../players/player-list/player-list.module').then((m) => m.PlayerListPageModule)
                , canActivate: [AuthGuardService]
              }
            ]
           
        },
        {
          path: 'invoice-list',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../registrations/invoice-list/invoice-list.module').then( m => m.InvoiceListPageModule)
                , canActivate: [AuthGuardService]
              }
            ]
            
        },
        {
          path: 'registration-list',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../registrations/registration-list/registration-list.module').then( m => m.RegistrationListPageModule)
                , canActivate: [AuthGuardService]
              }
            ]
            
        },
        {
          path: 'player-create',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../players/player-create/player-create.module').then( m => m.PlayerCreatePageModule)
                , canActivate: [AuthGuardService]
              }
            ]
           
        },
        {
          path: 'selection-list/:playerId',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../tournaments/selection-list/selection-list.module').then( m => m.SelectionListPageModule)
                , canActivate: [AuthGuardService]
              }
            ]
            
        },
        {
          path: 'checkout',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../registrations/checkout/checkout.module').then( m => m.CheckoutPageModule)
                , canActivate: [AuthGuardService]
              }
            ]
            
        },
        {
          path: 'tournament-list',
          children:
            [
              {
                path: '',
                loadChildren: () =>
                  import('../tournaments/tournament-list/tournament-list.module').then((m) => m.TournamentListPageModule),
                  canActivate: [AuthGuardService]
                }
            ]
            , canActivate: [AuthGuardService]
        },
        {
          path: 'admin-registration-list',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../admin/admin-registration-list/admin-registration-list.module').then( m => m.AdminRegistrationListPageModule)
                , canActivate: [RoleGuardService],
                data: {
                  expectedRole: 'admin'
                }
              }
            ]
            
        },
        {
          path: '',
          redirectTo: '/tabs/player-list',
          pathMatch: 'full'
        }
      ]
      
  },
  {
    path: '',
    redirectTo: '/tabs/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
