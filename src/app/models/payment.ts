import { PaymentIntentResult } from "@stripe/stripe-js";

export enum PaymentMethod {
    Card = 'card',
    SepaDebit = 'sepa_debit'
}

export interface PaymentIntent {
    paymentLink: string;
}

export interface BillingPortal {
    billingPortalLink: string;
}

export interface PaymentData {
    payment_intent_id: string;
    paroisse_id: string;
    iban?: string;
    cardNumber?: string;
    expirationDate: string;
    cvv?: string;
}