import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Registration } from '../../models/registration.model';
import { Invoice } from '../../models/invoice.model';
import { LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from "rxjs";
import { Player } from '../../models/player.model';
import { take, map, tap, delay, switchMap, concatMap, catchError, onErrorResumeNext, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-registration-list',
  templateUrl: './admin-registration-list.page.html',
  styleUrls: ['./admin-registration-list.page.scss'],
})
export class AdminRegistrationListPage implements OnInit {
  isDivVisible = true;
  isRegLoading = true;
  registrations: Registration[];
  selectedFilter = 'date';
  selectedInvoiceSort = 'date';
  filterList = ['date', 'player', 'tournament'];
  invoiceSortList = ['date', 'email'];
  allInvoices: Invoice[] = [];

  constructor( public adminService: AdminService, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {

    this.adminService.registrations$.subscribe(regs => {
      console.log('ngOnInit this.adminService.registrations$.subscribe');
      this.getAllInvoices();
      }
    );

    this.adminService.getAllRegistrationList()
      .subscribe(registrations => {

          console.log('AdminregistrationsList',registrations);
          this.registrations = registrations
          .filter(reg => reg.player !== null)
          .sort((a: Registration, b: Registration) => {
            this.isRegLoading = false;
            return new Date(a.createdAt) > new Date(b.createdAt);
         }

        );
          this.adminService.setAllRegistrations([...this.registrations]);


   });

  }


  getAllInvoices() {
    // const invoiceIds = this.registrations.map(reg => reg.invoice._id);
    // const unique = this.registrations.map(reg => reg.invoice._id);
    // const unique = [...new Set(this.registrations.map(reg => reg.invoice._id))];
   // console.log(unique);

    this.adminService.getAllInvoices().subscribe(
      invoices => {
        console.log('invoices', invoices);
        this.allInvoices = invoices;
      }
    )
    // const distinctArray = registrations.filter((n, i) => registrations..indexOf(n) === i);


  }

  onInvoiceSortChange(selectedData: string)
  {

    console.log('onSelectChange: ', selectedData);
    const invoices = this.allInvoices;
    this.selectedInvoiceSort = selectedData;

    if ( selectedData === 'email') {

      this.allInvoices = invoices
        .filter(invoice => invoice.creator.email !== null)
        .sort((a: Invoice, b: Invoice) => {
          return (a.creator.email  > b.creator.email ) ? 1 : -1;
         }
       );
      } else if (selectedData === 'date') {
        this.allInvoices = invoices
        .sort((a: Invoice, b: Invoice) => {
          return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1;
          }
       );
      }

  }

  onSelectChange(selectedData: string) {
  console.log('onSelectChange: ', selectedData);
  const registrations = this.registrations;
  this.selectedFilter = selectedData;

  if ( selectedData === 'player') {

    this.registrations = registrations
      .filter(reg => reg.player !== null)
      .sort((a: Registration, b: Registration) => {
        return (a.player.lastName > b.player.lastName) ? 1 : -1;
       }
     );
    } else if (selectedData === 'tournament') {
      this.registrations = registrations
      .filter(reg => reg.player !== null)
      .sort((a: Registration, b: Registration) => {
        return a.tournament.index - b.tournament.index;
        }
     );
    } else if (selectedData === 'invoice') {
      this.registrations = registrations
      .filter(reg => reg.player !== null)
      .sort((a: Registration, b: Registration) => {
        return a.tournament.index - b.tournament.index;
        }
     );
    } else {
      this.registrations = registrations
      .filter(reg => reg.player !== null)
      .sort((a: Registration, b: Registration) => {
        return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1;
      });
    }




  }

  onConfirmPayment(regId: string) {
    console.log('onConfirmPayment arg: ', regId);
    this.adminService.confirmPayment(regId).subscribe(isSuccess => {
      if (isSuccess) {
        console.log('Registration Pyament confirm');
        // update this registration locally with hasPayed = true
        const regIndex = this.registrations.findIndex(reg => reg._id === regId);
        const registration = this.registrations[regIndex];
        registration.hasPayed = true;
        this.registrations[regIndex] = registration;
      } else  {
        console.log('Registration Payment confirmation failed');
      }
    });
  }

  onConfirmInvoicePayment(invoiceId: string) {
    console.log('onConfirmInvoicePayment arg: ', invoiceId);
    this.adminService.confirmInvoicePayment(invoiceId).subscribe(isSuccess => {
      if (isSuccess) {
        console.log('Registration Pyament confirm');
        // Invoice hasPayed is present in 2 locations
        // update this registration locally with hasPayed = true as it contains invoice as child/
        const registrations = this.registrations;
        const regs = this.registrations.filter(reg => reg.invoice._id === invoiceId);
        regs.forEach(reg => {
          reg.invoice.hasPayed = true;
          const regIndex = registrations.findIndex(r => r._id === reg._id);
          registrations[regIndex] = reg;

        });
        // update the view
        this.registrations = registrations;

        // update invoices list
        const invIndex = this.allInvoices.findIndex(inv => inv._id === invoiceId);
        const invoice = this.allInvoices[invIndex];
        invoice.hasPayed = true;
        this.allInvoices[invIndex] = invoice;

      } else  {
        console.log('Registration Payment confirmation failed');
      }
    });
  }

  onCancelInvoice(invId: string) {
    console.log('onCancelInvoice arg: ', invId);
    this.adminService.cancelInvoice(invId).subscribe(isSuccess => {
      if (isSuccess) {
        console.log('onCancelInvoice cancel isSuccess', isSuccess);
        // update this registration locally with hasPayed = true
        const invIndex = this.allInvoices.findIndex(inv => inv._id === invId);
        const invoice = {...this.allInvoices[invIndex]};
        invoice.canceled = true;
        this.allInvoices[invIndex] = invoice;

        //update invoice part of Registration list, 2 diff lists
        const registrations = this.registrations;
        const regs = this.registrations.filter(reg => reg.invoice._id === invId);
        regs.forEach(reg => {
          reg.invoice.canceled = true;
          const regIndex = registrations.findIndex(r => r._id === reg._id);
          registrations[regIndex] = reg;

        });
        // update the view
        this.registrations = registrations;

      } else  {
        console.log('onCancelInvoice cancel failed');
      }
    });
  }

  onCancelRegistration(regId: string) {
    console.log('onCancelRegistration arg: ', regId);
    this.adminService.cancelRegistration(regId).subscribe(isSuccess => {
      if (isSuccess) {
        console.log('Registration cancel');
        // update this registration locally with hasPayed = true
        const regIndex = this.registrations.findIndex(reg => reg._id === regId);
        const registration = this.registrations[regIndex];
        registration.canceled = true;
        this.registrations[regIndex] = registration;
      } else  {
        console.log('Registration cancel failed');
      }
    });
  }

  onShowHistory(entity: string, Id: string) {
    console.log('onShowHistory');
    let historyText = "";
    this.adminService.getHistory(entity, Id)
    .subscribe(historyItems => {
      console.log('historyItem: ', historyItems);
      historyItems.map(item => {
        historyText = historyText.concat(item + '<br/>');
      });
      console.log('historyText', historyText);

      this.showAlert('Registration Info - History', historyText);
    //   this.modalService.openSizableModal(
    //     'Registration Info',
    //     'History',
    //     historyText,
    //     '300px',
    //     '600px'
    //     );
    // })
  });
}


  private showAlert(head: string, message: string) {
    this.alertCtrl
      .create({ header: head, message: message, buttons: ['okay'] })
      .then((alertEl) => alertEl.present());
  }
}
