import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { RegistrationsService } from '../registrations.service';
import { StripeToken } from 'stripe-angular';
import { StripeSource } from 'stripe-angular/StripeTypes';
import { MatStepper } from '@angular/material/stepper';
import { MatHorizontalStepper } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from 'ngx-stripe';
import { Stripe } from '@ionic-native/stripe/ngx';
import { CreditCardValidator } from 'ngx-credit-cards';
import { NavigationService } from '../../navigation.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, OnDestroy {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  //@ViewChild('slides') slideRef: ElementRef;
  @ViewChild('slides', { static: false }) slides: IonSlides;

  // slides: IonSlides;

  // @ViewChild(IonSlides, {static: false}) set slidesvc(slides) {
  //   this.slides = slides;
  // }

  // protected mySlideOptions = {
  //   initialSlide: 0,
  //   loop: false,
  //   pager: true
  // };

  // elements: Elements;
  // card: StripeElement;

  stripe_key = 'pk_test_YcpYu1bpUhiX3j4NS4OdpngK00zA3zscJ3';
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en',
  };

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#black',
        color: '#black',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#black',
        },
      },
    },
  };

  stripeTest: FormGroup;

  private registrationsSub: Subscription;
  private invSub: Subscription;
  selectedTournaments = [];
  totalPrice = 0;
  totalFullPrice = 0;
  finalPrice = 0; //display at the very end so not affected by re-init, only visual
  serverReponses = [];
  paymentResponse = {
    success: false,
    message: 'On Progress',
  };
  hasPaymentChanged = false;
  invalidError: any;
  selectedPayment = {
    type: '',
    description: '',
    discount: 0,
  };

  paymentSelection = [
    {
      type: 'Credit Card',
      description: 'using Credit Card',
      discount: 5,
    },
    {
      type: 'Manual Interac',
      description:
        'To be sent to prestige@prestige Expected to be done within 48h, otherwise registration will be withdrawed ',
      discount: 3,
    },
    {
      type: 'Cheque',
      description: 'to be sent within a week, otherwise registration will be withdrawed',
      discount: 0,
    },
  ];

  cFormBuilder: FormBuilder;
  cFormGroup: FormGroup;

  customActionSheetOptions: any = {
    header: 'Payment Method',
    subHeader: 'Please select your payment method',
  };

  constructor(
    public registrationsService: RegistrationsService,
    private fb: FormBuilder,
    // private cardFormBuilder: FormBuilder,
    // private cardFormGroup: FormGroup,
    private stripeService: StripeService,
    private stripe: Stripe,
    private navigationService: NavigationService,
  ) {}

  onStep0Next() {
    console.log('onStep0Next');
    //const swiper = (this.slides as any).el.swiper;

    //console.log('onStep0Nextswiper:',swiper);
    this.slides.lockSwipeToNext(false);
    this.slides.slideTo(1, 500);

    this.slides.lockSwipeToNext(true);
  }
  onStep1Next(form?: NgForm) {
    console.log('onStep1Next');
    this.slides.lockSwipeToNext(false);
    this.slides.slideTo(2, 500);
    this.slides.lockSwipes(true);

    this.finalPrice = this.totalPrice;

    if (this.selectedPayment.type === 'CreditCard') {
      this.payWithStripe(form);
    } else {
      this.onClickPay();
    }
  }

  ionSlideDidChange() {
    console.log('ionSlideDidChange');
  }

  slideChanged(e: any) {
    console.log('slideChanged');
    // this.slides.getActiveIndex().then((index: number) => {
    //   console.log(index);
    // });
  }

  payWithStripe(form: NgForm) {
    console.log('payWithStripe');
    console.log('cNumber', form.value.cNumber);
    console.log('cCvc', form.value.cCvc);
    console.log('cExpMonth', form.value.cExpMonth);
    console.log('cExpYear', form.value.cExpYear);

    this.stripe.setPublishableKey(this.stripe_key);
    const cvc = form.value.cCvc;
    if (cvc === '220') {
      console.log('same');
    } else {
      console.log('same');
    }
    //const name = this.stripeTest.get('name').value;

    // const card = {
    //  number: '4242424242424242',
    //  expMonth: 12,
    //  expYear: 2020,
    //  cvc: '220'
    // }
    //const expMonth = form.value.cExp.toString().findIndex()

    const card = {
      number: form.value.cNumber,
      expMonth: form.value.cExpMonth,
      expYear: form.value.cExpYear,
      cvc: cvc,
    };

    this.stripe
      .createCardToken(card)
      .then((token) => {
        console.log('token', token);
        console.log('token id', token.id);
        if (token.id) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          //console.log(result.token.id);
          //  console.log('new Stripe token', token.id);
          // multiply price by 100 as must be send in cents format to Stripe
          this.registrationsService.payWithCard(this.totalFullPrice * 100, token.id).subscribe((response) => {
            console.log('payWithCard response: ', response.data);
            this.paymentResponse = {
              success: response.data.payWithCard.success,
              message: response.data.payWithCard.message,
            };
            if (this.paymentResponse.success === true) {
              this.createRegistrations();
            } else {
              console.log('Payment error');
            }
          });
        }
      })
      .catch((error) => console.error(error));
  }

  ionViewDidEnter() {
    this.navigationService.setNavLink('Checkout');
    this.slides.lockSwipeToNext(true);
  }

  ionViewDidLeave() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
  }

  ngOnInit() {
    this.registrationsSub = this.registrationsService.selectedTournaments$.subscribe((selections) => {
      this.totalPrice = 0;
      this.totalFullPrice = 0;
      console.log('Checkout in getTempRegistrations', selections);
      this.selectedTournaments = this.registrationsService.getTempRegistrations();
      this.selectedTournaments.forEach((tournament) => {
        this.totalPrice = this.totalPrice + tournament.tournament.price;
      });

      this.totalFullPrice = this.totalPrice;
      if (this.selectedPayment.discount !== 0) {
        this.totalFullPrice = Math.round(this.totalPrice * (1 - this.selectedPayment.discount / 100) * 100) / 100;
      }
    });
    /////////////////////////
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
    });

    //this.cFormBuilder = new FormBuilder();

    this.cFormGroup = this.fb.group({
      cardNumber: [''],
      cardExpDate: [''],
      cardCvv: [''],
      cardName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    });
  }

  buy() {
    const name = this.stripeTest.get('name').value;
    this.stripeService.createToken(this.card.getCard(), { name }).subscribe((result) => {
      if (result.token) {
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/charges
        //console.log(result.token.id);
        console.log('new Stripe token', result.token);
        // multiply price by 100 as must be send in cents format to Stripe
        this.registrationsService.payWithCard(this.totalFullPrice * 100, result.token.id).subscribe((response) => {
          console.log('payWithCard response: ', response.data);
          this.paymentResponse = {
            success: response.data.payWithCard.success,
            message: response.data.payWithCard.message,
          };
          if (this.paymentResponse.success === true) {
            this.createRegistrations();
          } else {
            console.log('Payment error');
          }
        });
      } else if (result.error) {
        // Error creating the token
        console.log(result.error.message);
      }
    });
  }

  ngOnDestroy() {
    if (this.registrationsSub) {
      this.registrationsSub.unsubscribe();
    }
    if (this.invSub) {
      this.invSub.unsubscribe();
    }
  }

  onSelectChange(selectedData) {
    console.log('onSelectChange');
    this.hasPaymentChanged = true;
    this.selectedPayment = selectedData;
    this.totalFullPrice = Math.round(this.totalPrice * (1 - this.selectedPayment.discount / 100) * 100) / 100;
  }

  selectPayment(newValue) {
    console.log(newValue);
  }

  onClickPay() {
    //only for method Interc and Cheque as no online payment
    this.createRegistrations();
  }
  createRegistrations() {
    console.log('createRegistrations totalFullPrice', this.totalFullPrice);
    this.invSub = this.registrationsService
      .createInvoiceAndRegistrations(
        this.selectedPayment.type === 'Credit Card' ? true : false,
        this.selectedPayment.type,
        this.totalFullPrice,
      )
      .subscribe(
        (result) => {
          console.log('Result on createRegistrations: ', result);
          this.serverReponses.push(result.data.addPlayerToTournament);
        },
        (error) => {
          console.log('Error on createRegistrations: ', error);
        },
      );
  }

  // extraData = {
  //   'name': null,
  //   'address_city': null,
  //   'address_line1': null,
  //   'address_line2': null,
  //   'address_state': null,
  //   'address_zip': null,
  // };

  // onStripeInvalid( error: Error ) {
  //   console.log('Validation Error', error);
  // }

  setStripeToken(token: StripeToken, stepper) {
    console.log('Stripe token', token);
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = false;
    this.stepper.next();
    // multiply price by 100 as must be send in cents format to Stripe
    this.registrationsService.payWithCard(this.totalFullPrice * 100, token.id).subscribe((response) => {
      console.log('payWithCard response: ', response.data);
      this.paymentResponse = { success: response.data.payWithCard.success, message: response.data.payWithCard.message };
      if (this.paymentResponse.success === true) {
        this.createRegistrations();
      } else {
        console.log('Payment error');
      }
    });
  }

  setStripeSource(source: StripeSource) {
    console.log('Stripe source', source);
  }

  onStripeError(error: Error) {
    console.error('Stripe error', error);
  }
}
