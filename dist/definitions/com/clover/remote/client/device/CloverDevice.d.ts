import * as sdk from 'remote-pay-cloud-api';
import { CloverTransport } from '../transport/CloverTransport';
import { CloverDeviceObserver } from '../CloverDeviceObserver';
/**
 * Clover Device
 *
 * Abstract clover device.
 */
export declare abstract class CloverDevice {
    protected deviceObservers: CloverDeviceObserver[];
    protected transport: CloverTransport;
    protected packageName: string;
    protected applicationId: string;
    protected supportsAck: boolean;
    /**
     * Constructor
     *
     * @param {string} packageName
     * @param {CloverTransport} transport
     * @param {string} applicationId
     */
    constructor(packageName: string, transport: CloverTransport, applicationId: string);
    /**
     * Add a new observer to the list of observers
     *
     * @param {CloverDeviceObserver} observer - observer to add
     */
    subscribe(observer: CloverDeviceObserver): void;
    /**
     * Remove an observer from the list of observers
     *
     * @param {CloverDeviceObserver} observer - observer to remove
     */
    unsubscribe(observer: CloverDeviceObserver): void;
    /**
     * Discovery request
     */
    abstract doDiscoveryRequest(): void;
    /**
     * Transaction Start
     *
     * @param {sdk.remotemessage.PayIntent} payIntent
     * @param {sdk.order.Order} order
     * @param {string} requestInfo - request type.
     */
    abstract doTxStart(payIntent: sdk.remotemessage.PayIntent, order: sdk.order.Order, requestInfo: string): void;
    /**
     * Key Press
     *
     * @param {sdk.remotemessage.KeyPress} keyPress
     */
    abstract doKeyPress(keyPress: sdk.remotemessage.KeyPress): void;
    /**
     * Void Payment
     *
     * @param {sdk.payments.Payment} payment
     * @param {sdk.order.VoidReason} reason
     */
    abstract doVoidPayment(payment: sdk.payments.Payment, reason: sdk.order.VoidReason): void;
    /**
     * Capture Auth
     *
     * @param {string} paymentId
     * @param {number} amount
     * @param {number} tipAmount
     */
    abstract doCaptureAuth(paymentId: string, amount: number, tipAmount: number): void;
    /**
     * Order Update
     *
     * @param {sdk.order.DisplayOrder} order
     * @param {Object} orderOperation
     */
    abstract doOrderUpdate(order: sdk.order.DisplayOrder, orderOperation: Object): void;
    /**
     * Signature Verified
     *
     * @param {sdk.payments.Payment} payment
     * @param {boolean} verified
     */
    abstract doSignatureVerified(payment: sdk.payments.Payment, verified: boolean): void;
    /**
     * Terminal Message
     *
     * @param {string} text
     */
    abstract doTerminalMessage(text: string): void;
    /**
     * Payment Refund
     *
     * @param {string} orderId
     * @param {string} paymentId
     * @param {number} amount
     * @param {boolean} fullRefund
     */
    abstract doPaymentRefund(orderId: string, paymentId: string, amount: number, fullRefund: boolean): void;
    /**
     * Tip Adjust Auth
     *
     * @param {string} orderId
     * @param {string} paymentId
     * @param {number} amount
     */
    abstract doTipAdjustAuth(orderId: string, paymentId: string, amount: number): void;
    /**
     * Print Text
     *
     * @param {Array<string>} textLines
     */
    abstract doPrintText(textLines: Array<string>, printRequestId?: string, printDeviceId?: string): void;
    /**
     * Show Welcome Screen
     */
    abstract doShowWelcomeScreen(): void;
    /**
     * Show Payment Receipt Screen
     *
     * @param {string} orderId
     * @param {string} paymentId
     */
    abstract doShowPaymentReceiptScreen(orderId: string, paymentId: string): void;
    /**
     * Show Thank You Screen
     */
    abstract doShowThankYouScreen(): void;
    /**
     * Open Cash Drawer
     *
     * @param {string} reason
     */
    abstract doOpenCashDrawer(reason: string, deviceId?: string): void;
    /**
     * Print Image (Bitmap)
     *
     * @param {any} bitmap
     */
    abstract doPrintImageObject(bitmap: any, printRequestId?: string, printDeviceId?: string): void;
    /**
     * Print Image (URL)
     *
     * @param {string} url
     */
    abstract doPrintImageUrl(url: string, printRequestId?: string, printDeviceId?: string): void;
    /**
     * Dispose
     */
    abstract dispose(): void;
    /**
     * Closeout
     *
     * @param {boolean} allowOpenTabs
     * @param {string} batchId
     */
    abstract doCloseout(allowOpenTabs: boolean, batchId: string): void;
    /**
     * Vault Card
     *
     * @param {number} cardEntryMethods
     */
    abstract doVaultCard(cardEntryMethods: number): void;
    /**
     * Reset Device
     */
    abstract doResetDevice(): void;
    /**
     * Accept Payment
     *
     * @param {sdk.payments.Payment} payment
     */
    abstract doAcceptPayment(payment: sdk.payments.Payment): void;
    /**
     * Reject Payment
     *
     * @param {sdk.payments.Payment} payment
     * @param {sdk.base.Challenge} challenge
     */
    abstract doRejectPayment(payment: sdk.payments.Payment, challenge: sdk.base.Challenge): void;
    /**
     * Retrieve Pending Payments
     */
    abstract doRetrievePendingPayments(): void;
    /**
     * Read Card Data
     *
     * @param {sdk.remotemessage.PayIntent} payment
     */
    abstract doReadCardData(payment: sdk.remotemessage.PayIntent): void;
    /**
     * Send a message to a running custom activity
     *
     * @param {string} actionId - the id used when the custom action was started
     * @param {string} payload - the message content, unrestricted format
     */
    abstract doSendMessageToActivity(actionId: string, payload: string): void;
    /**
     * Start a custom Activity
     *
     * @param action - the id to use when starting the activity
     * @param payload - information to pass to the activity when it is started
     * @param nonBlocking - if true, the activity may be finished externally
     */
    abstract doStartActivity(action: string, payload: string, nonBlocking: boolean): void;
    /**
     * Get the status of the device.
     *
     * @param {sdk.remotepay.RetrieveDeviceStatusRequest} request - the status request
     */
    abstract doRetrieveDeviceStatus(request: sdk.remotepay.RetrieveDeviceStatusRequest): void;
    /**
     * Get a payment that was taken on this device in the last 24 hours.
     *
     * @param {string} externalPaymentId
     */
    abstract doRetrievePayment(externalPaymentId: string): void;
    /**
     * Get printers attached to this device.
     */
    abstract doRetrievePrinters(category?: sdk.printer.PrintCategory): void;
    /**
     * Get the status of a specific print job.
     */
    abstract doRetrievePrintJobStatus(printRequestId: string): void;
    /**
     * Supports Acknowledgements
     *
     * @param {boolean} supportsAck
     */
    setSupportsAcks(supportsAck: boolean): void;
    /**
     * Get Supports Acknowledgements flag
     *
     * @returns boolean - Flag indicating if this device supports acks
     */
    supportsAcks(): boolean;
}
