import { Component, Inject } from '@angular/core';
import { PaymentInfo } from 'src/models/payment-info';
import { SERVICE_IDENTIFIERS } from '../app.module';
import { IUserManager } from 'src/services/abstractions/i-user-manager';
import { ToastrService } from 'ngx-toastr';
import {RedirectUtils} from "../../utils/redirect-utils";

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent {
  cardNumber? : string;
  expirationMonth?: number;
  expirationYear?: number;
  cvv?: number;
  cardHolderName?: string;

  constructor(
    @Inject(SERVICE_IDENTIFIERS.IUserManager)
    private readonly userManager: IUserManager,
    private readonly toastService: ToastrService
  ) {}

  errorMessage? : string;
  async buy() {
    if (!this.cardNumber) {
      this.errorMessage = 'Card number is required';
      return;
    }
    if (this.cardNumber.length != 16) {
      this.errorMessage = 'Card number is invalid';
      return;
    }
    if (!this.expirationMonth) {
      this.errorMessage = 'Expiration month is required';
      return;
    }
    if (!this.expirationYear) {
      this.errorMessage = 'Expiration year is required';
      return;
    }
    if (!this.cvv) {
      this.errorMessage = 'CVV is required';
      return;
    }
    if (!this.cardHolderName) {
      this.errorMessage = 'Card holder name is required';
      return;
    }

    const paymentInfo = new PaymentInfo(
      this.cardNumber,
      this.cardHolderName,
      this.expirationMonth,
      this.expirationYear,
      this.cvv ?? 0,
      10
    );
    try {
      await this.userManager.buyPremium(paymentInfo);
    } catch (error: any) {
      this.toastService.error(error.response.data);
    }

    RedirectUtils.redirectToHome();
  }
}
