import * as sdk from 'remote-pay-cloud-api';
/**
 * Broadcasts events to a set of ICloverConnectorListener's
 *
 */
export declare class CloverConnectorBroadcaster {
    private listeners;
    private logger;
    constructor();
    clear(): void;
    push(...items: Array<sdk.remotepay.ICloverConnectorListener>): number;
    indexOf(searchElement: sdk.remotepay.ICloverConnectorListener, fromIndex?: number): number;
    splice(start: number, deleteCount: number, ...items: Array<sdk.remotepay.ICloverConnectorListener>): sdk.remotepay.ICloverConnectorListener[];
    notifyOnTipAdded(tip: number): void;
    notifyOnRefundPaymentResponse(refundPaymentResponse: sdk.remotepay.RefundPaymentResponse): void;
    notifyCloseout(closeoutResponse: sdk.remotepay.CloseoutResponse): void;
    notifyOnDeviceActivityStart(deviceEvent: sdk.remotepay.CloverDeviceEvent): void;
    notifyOnDeviceActivityEnd(deviceEvent: sdk.remotepay.CloverDeviceEvent): void;
    notifyOnSaleResponse(response: sdk.remotepay.SaleResponse): void;
    notifyOnAuthResponse(response: sdk.remotepay.AuthResponse): void;
    notifyOnManualRefundResponse(response: sdk.remotepay.ManualRefundResponse): void;
    notifyOnVerifySignatureRequest(request: sdk.remotepay.VerifySignatureRequest): void;
    notifyOnVoidPaymentResponse(response: sdk.remotepay.VoidPaymentResponse): void;
    notifyOnConnect(): void;
    notifyOnDisconnect(message?: string): void;
    notifyOnReady(merchantInfo: sdk.remotepay.MerchantInfo): void;
    notifyOnTipAdjustAuthResponse(response: sdk.remotepay.TipAdjustAuthResponse): void;
    notifyOnVaultCardRespose(ccr: sdk.remotepay.VaultCardResponse): void;
    notifyOnPreAuthResponse(response: sdk.remotepay.PreAuthResponse): void;
    notifyOnCapturePreAuth(response: sdk.remotepay.CapturePreAuthResponse): void;
    notifyOnDeviceError(errorEvent: sdk.remotepay.CloverDeviceErrorEvent): void;
    notifyOnConfirmPaymentRequest(confirmPaymentRequest: sdk.remotepay.ConfirmPaymentRequest): void;
    notifyOnRetrievePendingPaymentResponse(rppr: sdk.remotepay.RetrievePendingPaymentsResponse): void;
    notifyOnReadCardDataResponse(rcdr: sdk.remotepay.ReadCardDataResponse): void;
    notifyOnActivityMessage(response: sdk.remotepay.MessageFromActivity): void;
    notifyOnActivityResponse(response: sdk.remotepay.CustomActivityResponse): void;
    notifyOnRetrieveDeviceStatusResponse(response: sdk.remotepay.RetrieveDeviceStatusResponse): void;
    notifyOnResetDeviceResponse(response: sdk.remotepay.ResetDeviceResponse): void;
    notifyOnRetrievePaymentResponse(response: sdk.remotepay.RetrievePaymentResponse): void;
    notifyOnRetrievePrintersResponse(response: sdk.remotepay.RetrievePrintersResponse): void;
    notifyOnPrintJobStatusResponse(response: sdk.remotepay.PrintJobStatusResponse): void;
}
