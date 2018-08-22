import * as sdk from 'remote-pay-cloud-api';
import { CloverConnectorBroadcaster } from './CloverConnectorBroadcaster';
import { CloverDevice } from './device/CloverDevice';
import { CloverDeviceConfiguration } from './device/CloverDeviceConfiguration';
import { CloverDeviceObserver } from './CloverDeviceObserver';
import { Logger } from './util/Logger';
/**
 * Clover Connector
 *
 * The clover connector implements the ICloverConnector interface. This is where
 * we define how the connector interacts with remote pay adapters.
 */
export declare class CloverConnector implements sdk.remotepay.ICloverConnector {
    static CANCEL_INPUT_OPTION: sdk.remotemessage.InputOption;
    private cardEntryMethods;
    protected logger: Logger;
    device: CloverDevice;
    merchantInfo: sdk.remotepay.MerchantInfo;
    private deviceObserver;
    broadcaster: CloverConnectorBroadcaster;
    private configuration;
    isReady: boolean;
    static MAX_PAYLOAD_SIZE: number;
    lastRequest: any;
    constructor(config: CloverDeviceConfiguration);
    /**
     * Initialize the connector with a new config
     *
     * @param {CloverDeviceConfiguration} config - the configuration for the connector
     */
    initialize(config: CloverDeviceConfiguration): void;
    initializeConnection(): void;
    /**
     * Add new listener to receive broadcast notifications
     *
     * @param {sdk.remotepay.ICloverConnectorListener} connectorListener - the listener to add
     */
    addCloverConnectorListener(connectorListener: sdk.remotepay.ICloverConnectorListener): void;
    /**
     * Remove a listener
     *
     * @param {sdk.remotepay.ICloverConnectorListener} connectorListener - the listener to remove
     */
    removeCloverConnectorListener(connectorListener: sdk.remotepay.ICloverConnectorListener): void;
    sale(request: sdk.remotepay.SaleRequest): void;
    /**
     * A common PayIntent builder method for Sale, Auth and PreAuth
     *
     * @param request
     * @param suppressTipScreen
     */
    private saleAuth(request);
    private static getV3TipModeFromRequestTipMode(saleTipMode);
    notifyDeviceNotConnected(message: string): void;
    notifyInvalidData(message: string): void;
    notifyDeviceError(errorType: sdk.remotepay.ErrorType, errorCode: sdk.remotepay.DeviceErrorEventCode, cause: sdk.remotepay.PlatformError, message: string): void;
    acceptSignature(request: sdk.remotepay.VerifySignatureRequest): void;
    rejectSignature(request: sdk.remotepay.VerifySignatureRequest): void;
    acceptPayment(payment: sdk.payments.Payment): void;
    rejectPayment(payment: sdk.payments.Payment, challenge: sdk.base.Challenge): void;
    auth(request: sdk.remotepay.AuthRequest): void;
    preAuth(request: sdk.remotepay.PreAuthRequest): void;
    capturePreAuth(request: sdk.remotepay.CapturePreAuthRequest): void;
    tipAdjustAuth(request: sdk.remotepay.TipAdjustAuthRequest): void;
    vaultCard(cardEntryMethods: number): void;
    voidPayment(request: sdk.remotepay.VoidPaymentRequest): void;
    refundPayment(request: sdk.remotepay.RefundPaymentRequest): void;
    manualRefund(request: sdk.remotepay.ManualRefundRequest): void;
    retrievePendingPayments(): void;
    readCardData(request: sdk.remotepay.ReadCardDataRequest): void;
    sendMessageToActivity(request: sdk.remotepay.MessageToActivity): void;
    retrievePayment(request: sdk.remotepay.RetrievePaymentRequest): void;
    retrievePrinters(request: sdk.remotepay.RetrievePrintersRequest): void;
    retrievePrintJobStatus(request: sdk.remotepay.PrintJobStatusRequest): void;
    closeout(request: sdk.remotepay.CloseoutRequest): void;
    cancel(): void;
    printText(messages: Array<string>): void;
    printImage(bitmap: any): void;
    printImageFromURL(url: string): void;
    print(request: sdk.remotepay.PrintRequest): void;
    validatePrintRequest(request: sdk.remotepay.PrintRequest): boolean;
    showMessage(message: string): void;
    showWelcomeScreen(): void;
    showThankYouScreen(): void;
    /**
     * Incompatibility between sdks!  Old cloud had this.
     *
     * @deprecated
     *
     * @param orderId
     * @param paymentId
     */
    showPaymentReceiptOptions(orderId: string, paymentId: string): void;
    displayPaymentReceiptOptions(orderId: string, paymentId: string): void;
    openCashDrawer(request: sdk.remotepay.OpenCashDrawerRequest | string): void;
    showDisplayOrder(order: sdk.order.DisplayOrder): void;
    removeDisplayOrder(order: sdk.order.DisplayOrder): void;
    discountAddedToDisplayOrder(discount: sdk.order.DisplayDiscount, order: sdk.order.DisplayOrder): void;
    discountRemovedFromDisplayOrder(discount: sdk.order.DisplayDiscount, order: sdk.order.DisplayOrder): void;
    lineItemAddedToDisplayOrder(lineItem: sdk.order.DisplayLineItem, order: sdk.order.DisplayOrder): void;
    lineItemRemovedFromDisplayOrder(lineItem: sdk.order.DisplayLineItem, order: sdk.order.DisplayOrder): void;
    dispose(): void;
    invokeInputOption(io: sdk.remotepay.InputOption): void;
    resetDevice(): void;
    retrieveDeviceStatus(request: sdk.remotepay.RetrieveDeviceStatusRequest): void;
    private getCardEntryMethods();
    startCustomActivity(request: sdk.remotepay.CustomActivityRequest): void;
    static populateBaseResponse(response: sdk.remotepay.BaseResponse, success: boolean, result: sdk.remotepay.ResponseCode, reason?: string, message?: string): void;
    static populatePaymentResponse(response: sdk.remotepay.PaymentResponse, success: boolean, result: sdk.remotepay.ResponseCode, payment: sdk.payments.Payment, signature?: sdk.base.Signature, reason?: string, message?: string): void;
}
export declare namespace CloverConnector {
    class TxTypeRequestInfo {
        static SALE_REQUEST: string;
        static AUTH_REQUEST: string;
        static PREAUTH_REQUEST: string;
        static CREDIT_REQUEST: string;
        static REFUND_REQUEST: string;
    }
    class InnerDeviceObserver implements CloverDeviceObserver {
        logger: Logger;
        cloverConnector: CloverConnector;
        lastPRR: sdk.remotepay.RefundPaymentResponse;
        constructor(cc: CloverConnector);
        onTxState(txState: sdk.remotemessage.TxState): void;
        private getMessageTypeFromLastRequest(lastRequest);
        onTxStartResponse(result: sdk.remotemessage.TxStartResponseResult, externalId: string, requestInfo: string): void;
        onUiState(uiState: sdk.remotemessage.UiState, uiText: string, uiDirection: sdk.remotemessage.UiDirection, inputOptions: Array<sdk.remotemessage.InputOption>): void;
        onTipAdded(tip: number): void;
        onAuthTipAdjusted(paymentId: string, tipAmount: number, success: boolean): void;
        onAuthTipAdjusted(result: sdk.remotepay.ResponseCode, reason: string, message: string): void;
        private onAuthTipAdjustedHandler(paymentId, tipAmount, success, result, reason, message);
        onCashbackSelected(cashbackAmount: number): void;
        onPartialAuth(partialAmount: number): void;
        onFinishOkPayment(payment: sdk.payments.Payment, signature: sdk.base.Signature, requestInfo: string): void;
        onFinishOkCredit(credit: sdk.payments.Credit): void;
        onFinishOkRefund(refund: sdk.payments.Refund): void;
        onFinishOk(payment: sdk.payments.Payment, signature: sdk.base.Signature, requestInfo: string): void;
        onFinishOk(credit: sdk.payments.Credit): void;
        onFinishOk(refund: sdk.payments.Refund): void;
        onFinishCancel_rmm(result: sdk.remotepay.ResponseCode, reason: string, message: string, requestInfo: string): void;
        onFinishCancel(requestInfo: string): void;
        onFinishCancelPreAuth(result: sdk.remotepay.ResponseCode, reason?: string, message?: string): void;
        onFinishCancelSale(result: sdk.remotepay.ResponseCode, reason?: string, message?: string): void;
        onFinishCancelAuth(result: sdk.remotepay.ResponseCode, reason?: string, message?: string): void;
        onFinishCancelManualRefund(result: sdk.remotepay.ResponseCode, reason?: string, message?: string): void;
        onFinishCancelRefund(result: sdk.remotepay.ResponseCode, reason?: string, message?: string): void;
        onVerifySignature(payment: sdk.payments.Payment, signature: sdk.base.Signature): void;
        onConfirmPayment(payment: sdk.payments.Payment, challenges: sdk.base.Challenge[]): void;
        onPaymentVoided(payment: sdk.payments.Payment, voidReason: sdk.order.VoidReason, resultStatus: sdk.remotemessage.ResultStatus, reason: string, message: string): void;
        onPaymentVoided_responseCode(code: sdk.remotepay.ResponseCode, reason: string, message: string): void;
        onKeyPressed(keyPress: sdk.remotemessage.KeyPress): void;
        onPaymentRefundResponse(orderId: string, paymentId: string, refund: sdk.payments.Refund, code: sdk.remotemessage.TxState, reason: sdk.remotemessage.ErrorCode, message: string): void;
        onVaultCardResponse(vaultedCard: sdk.payments.VaultedCard, code: string, reason: string): void;
        onVaultCardResponseInternal(success: boolean, code: sdk.remotepay.ResponseCode, reason: string, message: string, vaultedCard: sdk.payments.VaultedCard): void;
        onCapturePreAuth(statusOrCode: any, reason: string, paymentId: string, amount: number, tipAmount: number): void;
        onCloseoutResponse(status: sdk.remotemessage.ResultStatus, reason: string, batch: sdk.payments.Batch): void;
        private onCloseoutResponseHandler(batch, result, reason, message);
        onDeviceDisconnected(device: CloverDevice, message?: string): void;
        onDeviceConnected(): void;
        onDeviceReady(device: CloverDevice, drm: sdk.remotemessage.DiscoveryResponseMessage): void;
        onDeviceError(errorEvent: sdk.remotepay.CloverDeviceErrorEvent): void;
        onPrintRefundPayment(payment: sdk.remotepay.Payment, order: sdk.order.Order, refund: sdk.payments.Refund): void;
        onPrintMerchantReceipt(payment: sdk.remotepay.Payment): void;
        onPrintPaymentDecline(payment: sdk.remotepay.Payment, reason: string): void;
        onPrintPayment(payment: sdk.remotepay.Payment, order: sdk.order.Order): void;
        onPrintCredit(credit: sdk.remotepay.Credit): void;
        onPrintCreditDecline(credit: sdk.remotepay.Credit, reason: string): void;
        onMessageAck(messageId: string): void;
        onPendingPaymentsResponse(success: boolean, pendingPayments: Array<sdk.base.PendingPaymentEntry>, reason?: string, message?: string): void;
        private onPendingPaymentsResponseHandler(success, pendingPayments, result, reason, message);
        onReadCardResponse(status: sdk.remotemessage.ResultStatus, reason: string, cardData: sdk.base.CardData): void;
        onMessageFromActivity(actionId: string, payload: string): void;
        onReadCardDataResponse(result: sdk.remotepay.ResponseCode, reason: string, message: string): void;
        onActivityResponse(status: sdk.remotemessage.ResultStatus, payload: string, reason: string, actionId: string): void;
        onDeviceStatusResponse(result: sdk.remotepay.ResponseCode, reason: string, state: sdk.remotemessage.ExternalDeviceState, data: sdk.remotemessage.ExternalDeviceStateData): void;
        onResetDeviceResponse(result: sdk.remotepay.ResponseCode, reason: string, state: sdk.remotemessage.ExternalDeviceState): void;
        onRetrievePaymentResponse(result: sdk.remotepay.ResponseCode, reason: string, externalPaymentId: string, queryStatus: sdk.remotepay.QueryStatus, payment: sdk.payments.Payment): void;
        onRetrievePrintersResponse(result: sdk.remotepay.ResponseCode, printers: Array<sdk.printer.Printer>): void;
        onPrintJobStatusResponse(result: sdk.remotepay.ResponseCode, printRequestId: string, printStatus: sdk.printer.PrintJobStatus): void;
    }
    namespace InnerDeviceObserver {
        class SVR extends sdk.remotepay.VerifySignatureRequest {
            cloverDevice: CloverDevice;
            constructor(device: CloverDevice);
            accept(): void;
            reject(): void;
            setSignature(signature: sdk.base.Signature): void;
            setPayment(payment: sdk.payments.Payment): void;
        }
    }
}
