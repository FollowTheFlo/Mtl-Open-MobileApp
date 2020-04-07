import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { NavigationFooterComponent } from './shared-components/navigation-footer/navigation-footer.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  { path: 'home', redirectTo: 'tabs/home', pathMatch: 'full' },
  { path: 'login', redirectTo: 'tabs/login', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'tabs/signup', pathMatch: 'full' },
  { path: 'logout', redirectTo: 'tabs/logout/logout', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'signup', redirectTo: 'tabs/signup', pathMatch: 'full' },
  { path: 'tournament-list', redirectTo: 'tabs/tournament-list', pathMatch: 'full' },
  { path: 'player-list', redirectTo: 'tabs/player-list', pathMatch: 'full', canActivate: [AuthGuardService] },
  {
    path: 'registration-list',
    redirectTo: 'tabs/registration-list',
    pathMatch: 'full',
    canActivate: [AuthGuardService],
  },
  { path: 'player-create', redirectTo: 'tabs/player-create', pathMatch: 'full', canActivate: [AuthGuardService] },
  {
    path: 'selection-list/:playerId',
    redirectTo: 'tabs/selection-list/:playerId',
    pathMatch: 'full',
    canActivate: [AuthGuardService],
  },
  { path: 'checkout', redirectTo: 'tabs/checkout', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'invoice-list', redirectTo: 'tabs/invoice-list', pathMatch: 'full', canActivate: [AuthGuardService] },
  {
    path: 'admin-registration-list',
    redirectTo: 'tabs/admin-registration-list',
    pathMatch: 'full',
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
