import * as sdk from 'remote-pay-cloud-api';
/**
 * Used to more closely match patterns used in other SDK's to allow for easier maintenance.
 *
 */
export declare namespace PayIntent {
    class Builder {
        private action;
        private amount;
        /** @Deprecated // Please use TransactionSettings */
        private tippableAmount;
        private tipAmount;
        private taxAmount;
        private orderId;
        private paymentId;
        private employeeId;
        private transactionType;
        private taxableAmountRates;
        private serviceChargeAmount;
        /** @Deprecated // Please use TransactionSettings */
        private isDisableCashBack;
        private isTesting;
        /** @Deprecated // Please use TransactionSettings */
        private cardEntryMethods;
        private voiceAuthCode;
        private postalCode;
        private streetAddress;
        private isCardNotPresent;
        private cardDataMessage;
        /** @Deprecated // Please use TransactionSettings */
        private remotePrint;
        private transactionNo;
        /** @Deprecated // Please use TransactionSettings */
        private isForceSwipePinEntry;
        /** @Deprecated // Please use TransactionSettings */
        private disableRestartTransactionWhenFailed;
        private externalPaymentId;
        private vaultedCard;
        /** @Deprecated // Please use TransactionSettings */
        private allowOfflinePayment;
        /** @Deprecated // Please use TransactionSettings */
        private approveOfflinePaymentWithoutPrompt;
        private requiresRemoteConfirmation;
        private applicationTracking;
        private allowPartialAuth;
        private germanInfo;
        private cashAdvanceCustomerIdentification;
        private transactionSettings;
        static buildTransactionSettingsFromPayIntent(payIntent: sdk.remotemessage.PayIntent): sdk.payments.TransactionSettings;
        payment(payment: sdk.payments.Payment): Builder;
        payIntent(payIntent: sdk.remotemessage.PayIntent): Builder;
        setAction(action: string): Builder;
        setAmount(amount: number): Builder;
        /** @Deprecated */
        setTippableAmount(tippableAmount: number): Builder;
        setTaxAmount(taxAmount: number): Builder;
        setEmployeeId(employeeId: string): Builder;
        setTipAmount(tipAmount: number): Builder;
        setTransactionType(transactionType: sdk.remotemessage.TransactionType): Builder;
        /** @Deprecated */
        setCardEntryMethods(cardEntryMethods: number): Builder;
        setCardDataMessage(cardDataMessage: string): Builder;
        setTaxableAmountRates(taxableAmountRates: Array<sdk.payments.TaxableAmountRate>): Builder;
        setServiceChargeAmount(serviceChargeAmount: sdk.payments.ServiceChargeAmount): Builder;
        setOrderId(orderId: string): Builder;
        setPaymentId(paymentId: string): Builder;
        /** @Deprecated */
        setRemotePrint(remotePrint?: boolean): Builder;
        /** @Deprecated */
        setDisableCashback(disableCashBack?: boolean): Builder;
        setTransactionNo(transactionNo: string): Builder;
        /** @Deprecated */
        setForceSwipePinEntry(isForceSwipePinEntry?: boolean): Builder;
        /** @Deprecated */
        setDisableRestartTransactionWhenFailed(disableRestartTransactionWhenFailed?: boolean): Builder;
        setExternalPaymentId(externalPaymentId: string): Builder;
        setVaultedCard(vaultedCard: sdk.payments.VaultedCard): Builder;
        /** @Deprecated */
        setAllowOfflinePayment(allowOfflinePayment: boolean): Builder;
        /** @Deprecated */
        setAapproveOfflinePaymentWithoutPrompt(approveOfflinePaymentWithoutPrompt: boolean): Builder;
        setRequiresRemoteConfirmation(requiresRemoteConfirmation: boolean): Builder;
        setApplicationTracking(applicationTracking: sdk.apps.AppTracking): Builder;
        setAllowPartialAuth(allowPartialAuth?: boolean): Builder;
        setGermanInfo(germanInfo: sdk.payments.GermanInfo): Builder;
        setCustomerIdentification(customerIdentification: sdk.payments.CashAdvanceCustomerIdentification): Builder;
        setTransactionSettings(transactionSettings: sdk.payments.TransactionSettings): Builder;
        setCardNotPresent(cardNotPresent?: boolean): Builder;
        build(): sdk.remotemessage.PayIntent;
    }
}
