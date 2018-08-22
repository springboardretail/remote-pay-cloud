import * as sdk from 'remote-pay-cloud-api';
import { RemoteMessageParser } from '../../../json/RemoteMessageParser';
import { CloverDevice } from './CloverDevice';
import { CloverTransport } from '../transport/CloverTransport';
import { ObjectMessageSender } from '../transport/ObjectMessageSender';
import { CloverTransportObserver } from '../transport/CloverTransportObserver';
import { CloverDeviceConfiguration } from './CloverDeviceConfiguration';
import { Logger } from '../util/Logger';
/**
 * Default Clover Device
 *
 * This is a default implementation of the clover device.
 */
export declare abstract class DefaultCloverDevice extends CloverDevice implements CloverTransportObserver, ObjectMessageSender {
    protected logger: Logger;
    protected messageParser: RemoteMessageParser;
    private static DEFAULT_REMOTE_MESSAGE_VERSION;
    private _remoteMessageVersion;
    private static REMOTE_SDK;
    private static BASE64;
    private static BASE64_ATTACHMENT;
    private static id;
    private msgIdToTask;
    private imageUtil;
    private maxMessageSizeInChars;
    constructor(configuration: CloverDeviceConfiguration);
    /**
     * Device is there but not yet ready for use
     *
     * @param {CloverTransport} transport - the transport holding the notifications
     */
    onDeviceConnected(transport: CloverTransport): void;
    /**
     * Device is there and ready for use
     *
     * @param {CloverTransport} transport - the transport holding the notifications
     */
    onDeviceReady(transport: CloverTransport): void;
    /**
     * Device is not there anymore
     *
     * @param {CloverTransport} transport - the transport holding the notifications
     */
    onDeviceDisconnected(transport: CloverTransport, message?: string): void;
    onDeviceError(deviceError: sdk.remotepay.CloverDeviceErrorEvent): void;
    getApplicationId(): string;
    protected handleRemoteMessagePING(rMessage: sdk.remotemessage.RemoteMessage): void;
    protected handleRemoteMessagePONG(rMessage: sdk.remotemessage.RemoteMessage): void;
    /**
     * Remote Message version is used for high-level feature detection e.g. is chunking supported.
     * We set the remote version when incoming messages are handled (handleRemoteMessageCOMMAND).
     * We only want to set _remoteMessageVersion if the inbound message is > than the version already set.
     *
     * @param {number} remoteMessageVersion
     */
    remoteMessageVersion: number;
    protected handleRemoteMessageCOMMAND(rMessage: sdk.remotemessage.RemoteMessage): void;
    protected handleRemoteMessageQUERY(rMessage: sdk.remotemessage.RemoteMessage): void;
    protected handleRemoteMessageEVENT(rMessage: sdk.remotemessage.RemoteMessage): void;
    protected handleRemoteMessage(rMessage: sdk.remotemessage.RemoteMessage): void;
    /**
     * Called when a raw message is received from the device
     *
     * @param {string} message - the raw message from the device
     */
    onMessage(message: string): void;
    /**
     * Send a PONG response
     *
     * @param pingMessage
     */
    private sendPong(pingMessage);
    /**
     * Notify the observers that the device is connected
     *
     * @param transport
     */
    private notifyObserversConnected(transport);
    /**
     * Notify the observers that the device has disconnected
     *
     * @param transport
     */
    private notifyObserversDisconnected(transport, message?);
    /**
     * Notify the observers that the transport failed.
     *
     * @param transport
     */
    private notifyObserversDeviceError(errorEvent);
    /**
     * Notify the observers that the device is ready
     *
     * @param transport
     * @param drm
     */
    private notifyObserversReady(transport, drm);
    private notifyObserverAck(ackMessage);
    private notifyObserverActivityMessage(message);
    private notifyObserversActivityResponse(arm);
    private notifyObserversReadCardData(rcdrm);
    private notifyObserversRetrieveDeviceStatusResponse(message);
    private notifyObserversRetrievePaymentResponse(message);
    private notifyObserversRetrievePrintersResponse(message);
    private notifyObserversPrintJobStatusResponse(message);
    private notifyObserversResetDeviceResponse(message);
    private notifyObserversRemoteError(message);
    notifyObserversPaymentRefundResponse(rrm: sdk.remotemessage.RefundResponseMessage): void;
    notifyObserversKeyPressed(keyPress: sdk.remotemessage.KeyPressMessage): void;
    notifyObserversCashbackSelected(cbSelected: sdk.remotemessage.CashbackSelectedMessage): void;
    notifyObserversTipAdded(tipAdded: sdk.remotemessage.TipAddedMessage): void;
    notifyObserverTxStart(txsrm: sdk.remotemessage.TxStartResponseMessage): void;
    notifyObserversTipAdjusted(tarm: sdk.remotemessage.TipAdjustResponseMessage): void;
    notifyObserversPartialAuth(partialAuth: sdk.remotemessage.PartialAuthMessage): void;
    notifyObserversPaymentVoided(payment: sdk.payments.Payment, voidReason: sdk.order.VoidReason, result: sdk.remotemessage.ResultStatus, reason: string, message: string): void;
    notifyObserversVerifySignature(verifySigMsg: sdk.remotemessage.VerifySignatureMessage): void;
    notifyObserversConfirmPayment(confirmPaymentMessage: sdk.remotemessage.ConfirmPaymentMessage): void;
    notifyObserverVaultCardResponse(vaultCardResponseMessage: sdk.remotemessage.VaultCardResponseMessage): void;
    notifyObserversUiState(uiStateMsg: sdk.remotemessage.UiStateMessage): void;
    notifyObserversCapturePreAuth(cparm: sdk.remotemessage.CapturePreAuthResponseMessage): void;
    notifyObserversCloseout(crm: sdk.remotemessage.CloseoutResponseMessage): void;
    notifyObserversPendingPaymentsResponse(rpprm: sdk.remotemessage.RetrievePendingPaymentsResponseMessage): void;
    notifyObserversTxState(txStateMsg: sdk.remotemessage.TxStateMessage): void;
    notifyObserversFinishCancel(msg: sdk.remotemessage.FinishCancelMessage): void;
    notifyObserversFinishOk(msg: sdk.remotemessage.FinishOkMessage): void;
    /**
     * Show Payment Receipt Screen
     *
     * @param {string} orderId
     * @param {string} paymentId
     */
    doShowPaymentReceiptScreen(orderId: string, paymentId: string): void;
    /**
     * Key Press
     *
     * @param {sdk.remotemessage.KeyPress} keyPress
     */
    doKeyPress(keyPress: sdk.remotemessage.KeyPress): void;
    /**
     * Show Thank You Screen
     */
    doShowThankYouScreen(): void;
    /**
     * Show Welcome Screen
     */
    doShowWelcomeScreen(): void;
    /**
     * Signature Verified
     *
     * @param {sdk.payments.Payment} payment
     * @param {boolean} verified
     */
    doSignatureVerified(payment: sdk.payments.Payment, verified: boolean): void;
    /**
     * Retrieve Pending Payments
     */
    doRetrievePendingPayments(): void;
    /**
     * Terminal Message
     *
     * @param {string} text
     */
    doTerminalMessage(text: string): void;
    /**
     * Open Cash Drawer
     *
     * @param {string} reason
     * @param {string} deviceId (optional)
     */
    doOpenCashDrawer(reason: string, deviceId?: string): void;
    /**
     * Closeout
     *
     * @param {boolean} allowOpenTabs
     * @param {string} batchId
     */
    doCloseout(allowOpenTabs: boolean, batchId: string): void;
    /**
     * Transaction Start
     *
     * @param {sdk.remotemessage.PayIntent} payIntent
     * @param {sdk.remotemessage.Order} order
     * @param {string} requestInfo - request type.
     */
    doTxStart(payIntent: sdk.remotemessage.PayIntent, order: sdk.order.Order, requestInfo: string): void;
    /**
     * Tip Adjust Auth
     *
     * @param {string} orderId
     * @param {string} paymentId
     * @param {number} amount
     */
    doTipAdjustAuth(orderId: string, paymentId: string, amount: number): void;
    /**
     * Read Cart Data
     *
     * @param {PayIntent} payIntent
     */
    doReadCardData(payIntent: sdk.remotemessage.PayIntent): void;
    /**
     * Send a message to a running custom activity
     *
     * @param {string} actionId - the id used when the custom action was started
     * @param {string} payload - the message content, unrestricted format
     */
    doSendMessageToActivity(actionId: string, payload: string): void;
    /**
     * Print Text
     *
     * @param {Array<string>} textLines
     */
    doPrintText(textLines: Array<string>, printRequestId?: string, printDeviceId?: string): void;
    /**
     * Print Image (Bitmap)
     *
     * @param {any} bitmap
     */
    doPrintImageObject(bitmap: any, printRequestId?: string, printDeviceId?: string): void;
    /**
     * Printing images from a url from the device is problematic.
     * See - https://jira.dev.clover.com/browse/SEMI-1352
     * and - https://jira.dev.clover.com/browse/SEMI-1377
     *
     * Instead of relying on the device, we can retrieve the image from the URL
     * and call doPrintImageObject instead of doPrintImageUrl. The doPrintImageObject
     * method is more robust (can handle large images via chunking, etc.).
     *
     * @param {string} url
     */
    doPrintImageUrl(url: string, printRequestId?: string, printDeviceId?: string): void;
    doStartActivity(action: string, payload: string, nonBlocking: boolean): void;
    /**
     * Void Payment
     *
     * @param {sdk.payments.Payment} payment
     * @param {sdk.order.VoidReason} reason
     */
    doVoidPayment(payment: sdk.payments.Payment, reason: sdk.order.VoidReason): void;
    protected addTaskForAck(msgId: string, task: Function): void;
    /**
     * Payment Refund
     *
     * @param {string} orderId
     * @param {string} paymentId
     * @param {number} amount
     * @param {boolean} fullRefund
     */
    doPaymentRefund(orderId: string, paymentId: string, amount: number, fullRefund: boolean): void;
    /**
     * Vault Card
     *
     * @param {number} cardEntryMethods
     */
    doVaultCard(cardEntryMethods: number): void;
    /**
     * Capture Auth
     *
     * @param {string} paymentId
     * @param {number} amount
     * @param {number} tipAmount
     */
    doCaptureAuth(paymentId: string, amount: number, tipAmount: number): void;
    /**
     * Accept Payment
     *
     * @param {Payment} payment
     */
    doAcceptPayment(payment: sdk.payments.Payment): void;
    /**
     * Reject Payment
     *
     * @param {Payment} payment
     * @param {Challenge} challenge
     */
    doRejectPayment(payment: sdk.payments.Payment, challenge: sdk.base.Challenge): void;
    /**
     * Discovery request
     */
    doDiscoveryRequest(): void;
    /**
     * Order Update
     *
     * @param {DisplayOrder} order
     * @param {any} orderOperation
     */
    doOrderUpdate(order: sdk.order.DisplayOrder, orderOperation: any): void;
    /**
     * Reset Device
     */
    doResetDevice(): void;
    doRetrieveDeviceStatus(request: sdk.remotepay.RetrieveDeviceStatusRequest): void;
    doRetrievePayment(externalPaymentId: string): void;
    doRetrievePrinters(category?: sdk.printer.PrintCategory): void;
    doRetrievePrintJobStatus(printRequestId: string): void;
    /**
     * Dispose
     */
    dispose(): void;
    sendObjectMessage(remoteMessage: sdk.remotemessage.Message, attachment?: string, attachmentEncoding?: string): string;
    private buildBaseRemoteMessage(remoteMessage);
    /**
     * Special serialization handling
     * The top level elements should not have the "elements" wrapper on collections (arrays).
     * sdk.remotemessage.Message instances are the only ones this needs to happen for.  This
     * is the result of the manner in which the serialization/deserialization happens in the
     * Android code.  The top level objects are not (de)serialized by a
     * com.clover.sdk.GenericClient#extractListOther
     * (in the Clover common repo).  The GenericClient is the tool that adds the elements
     * wrapper.  The top level objects are (de)serialized by themselves
     * com.clover.remote.message.Message#fromJsonString
     */
    private addSuppressElementsWrapper(message);
    protected buildRemoteMessageToSend(message: sdk.remotemessage.Message): sdk.remotemessage.RemoteMessage;
    protected buildRemoteMessages(message: sdk.remotemessage.Message, attachment?: string, attachmentEncoding?: string): string;
    protected static stringifyClover(key: string, value: any): any;
    protected sendRemoteMessage(remoteMessage: sdk.remotemessage.RemoteMessage): void;
    /**
     * If the remote message version is 2, fragmentation is supported.
     *
     * @returns {boolean}
     */
    private isFragmentationSupported();
}
