import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegistrationsService } from '../registrations.service';
import { Registration } from '../../models/registration.model';
import { Invoice } from '../../models/invoice.model';
import { Subscription } from 'rxjs';
import { NavigationService} from '../../navigation.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.page.html',
  styleUrls: ['./invoice-list.page.scss'],
})
export class InvoiceListPage implements OnInit, OnDestroy {

  isLoading = true;
  invoiceList: Invoice[] = [];
  private registrationsSub: Subscription;
  

  constructor(public registrationsService: RegistrationsService, private navigationService: NavigationService) { }

  ionViewDidEnter() {
    this.navigationService.setNavLink('Invoices');
  }

  ngOnInit() {
    this.registrationsSub = this.registrationsService.getUserInvoices()
    .subscribe ( invoices => {
      this.isLoading = false;
      console.log('invoices: ', invoices);
      this.invoiceList = invoices;
    }

  );

}

ngOnDestroy() {
  if (this.registrationsSub) {
    this.registrationsSub.unsubscribe();
  }
}

}

