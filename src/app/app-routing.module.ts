import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { NavigationFooterComponent } from './shared-components/navigation-footer/navigation-footer.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', redirectTo: 'tabs/login', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'tabs/signup', pathMatch: 'full' },
  { path: 'logout', redirectTo: 'tabs/logout/logout', pathMatch: 'full', canActivate: [AuthGuardService]  },
  { path: 'signup', redirectTo: 'tabs/signup', pathMatch: 'full' },
  { path: 'tournament-list', redirectTo: 'tabs/tournament-list', pathMatch: 'full' },
  { path: 'player-list', redirectTo: 'tabs/player-list', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'registration-list', redirectTo: 'tabs/registration-list', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'player-create', redirectTo: 'tabs/player-create', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'selection-list/:playerId', redirectTo: 'tabs/selection-list/:playerId', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'checkout', redirectTo: 'tabs/checkout', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'invoice-list', redirectTo: 'tabs/invoice-list', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'admin-registration-list', redirectTo: 'tabs/admin-registration-list', pathMatch: 'full', canActivate: [AuthGuardService] }

  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule) },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./auth/login/login.module').then((m) => m.LoginPageModule),
  // },
  // {
  //   path: 'logout/:logout',
  //   loadChildren: () => import('./auth/login/login.module').then((m) => m.LoginPageModule),
  // },
  // {
  //   path: 'signup',
  //   loadChildren: () => import('./auth/signup/signup.module').then((m) => m.SignupPageModule),
  // },
  // {
  //   path: 'tournament-list',
  //   loadChildren: () =>
  //     import('./tournaments/tournament-list/tournament-list.module').then((m) => m.TournamentListPageModule),
  // },
  // {
  //   path: 'player-list',
  //   loadChildren: () => import('./players/player-list/player-list.module').then((m) => m.PlayerListPageModule),
  // },
  // {
  //   path: 'registration-list',
  //   loadChildren: () =>
  //     import('./registrations/registration-list/registration-list.module').then((m) => m.RegistrationListPageModule),
  // },
  // {
  //   path: 'player-create',
  //   loadChildren: () => import('./players/player-create/player-create.module').then( m => m.PlayerCreatePageModule)
  // },
  // {
  //   path: 'selection-list/:playerId',
  //   loadChildren: () => import('./tournaments/selection-list/selection-list.module').then( m => m.SelectionListPageModule)
  // },
  // {
  //   path: 'checkout',
  //   loadChildren: () => import('./registrations/checkout/checkout.module').then( m => m.CheckoutPageModule)
  // },
  // {
  //   path: 'admin-registration-list',
  //   loadChildren: () => import('./admin/admin-registration-list/admin-registration-list.module').then( m => m.AdminRegistrationListPageModule)
  // },
  // {
  //   path: 'invoice-list',
  //   loadChildren: () => import('./registrations/invoice-list/invoice-list.module').then( m => m.InvoiceListPageModule)
  // },
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
