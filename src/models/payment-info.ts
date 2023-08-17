export class PaymentInfo {
  constructor(
    public cardNumber: string,
    public cardHolderName: string,
    public expirationMonth: number,
    public expirationYear: number,
    public cvv: number,
    public amount: number
  ) {}
}
