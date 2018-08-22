"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sdk = require("remote-pay-cloud-api");
var RemoteMessageParser_1 = require("../../../json/RemoteMessageParser");
var CloverDevice_1 = require("./CloverDevice");
var CloverConnector_1 = require("../CloverConnector");
var Logger_1 = require("../util/Logger");
var Version_1 = require("../../../Version");
/**
 * Default Clover Device
 *
 * This is a default implementation of the clover device.
 */
var DefaultCloverDevice = (function (_super) {
    __extends(DefaultCloverDevice, _super);
    function DefaultCloverDevice(configuration) {
        var _this = _super.call(this, configuration.getMessagePackageName(), configuration.getCloverTransport(), configuration.getApplicationId()) || this;
        _this.logger = Logger_1.Logger.create();
        _this.messageParser = RemoteMessageParser_1.RemoteMessageParser.getDefaultInstance();
        _this._remoteMessageVersion = DefaultCloverDevice.DEFAULT_REMOTE_MESSAGE_VERSION;
        _this.msgIdToTask = {};
        _this.imageUtil = configuration.getImageUtil();
        _this.maxMessageSizeInChars = Math.max(1000, configuration.getMaxMessageCharacters());
        _this.transport.subscribe(_this);
        _this.transport.setObjectMessageSender(_this);
        return _this;
    }
    /**
     * Device is there but not yet ready for use
     *
     * @param {CloverTransport} transport - the transport holding the notifications
     */
    DefaultCloverDevice.prototype.onDeviceConnected = function (transport) {
        this.notifyObserversConnected(transport);
    };
    /**
     * Device is there and ready for use
     *
     * @param {CloverTransport} transport - the transport holding the notifications
     */
    DefaultCloverDevice.prototype.onDeviceReady = function (transport) {
        this.doDiscoveryRequest();
    };
    /**
     * Device is not there anymore
     *
     * @param {CloverTransport} transport - the transport holding the notifications
     */
    DefaultCloverDevice.prototype.onDeviceDisconnected = function (transport, message) {
        this.notifyObserversDisconnected(transport, message);
    };
    DefaultCloverDevice.prototype.onDeviceError = function (deviceError) {
        this.notifyObserversDeviceError(deviceError);
    };
    DefaultCloverDevice.prototype.getApplicationId = function () {
        return this.applicationId;
    };
    DefaultCloverDevice.prototype.handleRemoteMessagePING = function (rMessage) {
        this.sendPong(rMessage);
    };
    DefaultCloverDevice.prototype.handleRemoteMessagePONG = function (rMessage) {
        // no-op
    };
    Object.defineProperty(DefaultCloverDevice.prototype, "remoteMessageVersion", {
        get: function () {
            return this._remoteMessageVersion;
        },
        /**
         * Remote Message version is used for high-level feature detection e.g. is chunking supported.
         * We set the remote version when incoming messages are handled (handleRemoteMessageCOMMAND).
         * We only want to set _remoteMessageVersion if the inbound message is > than the version already set.
         *
         * @param {number} remoteMessageVersion
         */
        set: function (remoteMessageVersion) {
            if (remoteMessageVersion > this._remoteMessageVersion) {
                this._remoteMessageVersion = remoteMessageVersion;
            }
        },
        enumerable: true,
        configurable: true
    });
    DefaultCloverDevice.prototype.handleRemoteMessageCOMMAND = function (rMessage) {
        this.remoteMessageVersion = typeof rMessage["getVersion"] === "function" ? rMessage.getVersion() : DefaultCloverDevice.DEFAULT_REMOTE_MESSAGE_VERSION;
        var method = sdk.remotemessage.Method[rMessage.getMethod()];
        if (method == null) {
            this.logger.error('Unsupported method type: ' + rMessage.getMethod());
        }
        else {
            var sdkMessage = this.messageParser.parseMessageFromRemoteMessageObj(rMessage);
            if (sdkMessage == null) {
                this.logger.error('Error parsing message: ' + JSON.stringify(rMessage));
            }
            switch (method) {
                case sdk.remotemessage.Method.BREAK:
                    break;
                case sdk.remotemessage.Method.CASHBACK_SELECTED:
                    this.notifyObserversCashbackSelected(sdkMessage);
                    break;
                case sdk.remotemessage.Method.ACK:
                    this.notifyObserverAck(sdkMessage);
                    break;
                case sdk.remotemessage.Method.DISCOVERY_RESPONSE:
                    this.logger.debug('Got a Discovery Response');
                    this.notifyObserversReady(this.transport, sdkMessage);
                    break;
                case sdk.remotemessage.Method.CONFIRM_PAYMENT_MESSAGE:
                    this.notifyObserversConfirmPayment(sdkMessage);
                    break;
                case sdk.remotemessage.Method.FINISH_CANCEL:
                    this.notifyObserversFinishCancel(sdkMessage);
                    break;
                case sdk.remotemessage.Method.FINISH_OK:
                    this.notifyObserversFinishOk(sdkMessage);
                    break;
                case sdk.remotemessage.Method.KEY_PRESS:
                    this.notifyObserversKeyPressed(sdkMessage);
                    break;
                case sdk.remotemessage.Method.ORDER_ACTION_RESPONSE:
                    break;
                case sdk.remotemessage.Method.PARTIAL_AUTH:
                    this.notifyObserversPartialAuth(sdkMessage);
                    break;
                case sdk.remotemessage.Method.PAYMENT_VOIDED:
                    // currently this only gets called during a TX, so falls outside our current process flow
                    //PaymentVoidedMessage vpMessage = (PaymentVoidedMessage) Message.fromJsonString(rMessage.payload);
                    //this.notifyObserversPaymentVoided(vpMessage.payment, vpMessage.voidReason, ResultStatus.SUCCESS, null, null);
                    break;
                case sdk.remotemessage.Method.TIP_ADDED:
                    this.notifyObserversTipAdded(sdkMessage);
                    break;
                case sdk.remotemessage.Method.TX_START_RESPONSE:
                    this.notifyObserverTxStart(sdkMessage);
                    break;
                case sdk.remotemessage.Method.TX_STATE:
                    this.notifyObserversTxState(sdkMessage);
                    break;
                case sdk.remotemessage.Method.UI_STATE:
                    this.notifyObserversUiState(sdkMessage);
                    break;
                case sdk.remotemessage.Method.VERIFY_SIGNATURE:
                    this.notifyObserversVerifySignature(sdkMessage);
                    break;
                case sdk.remotemessage.Method.REFUND_RESPONSE:
                    this.notifyObserversPaymentRefundResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.REFUND_REQUEST:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.TIP_ADJUST_RESPONSE:
                    this.notifyObserversTipAdjusted(sdkMessage);
                    break;
                case sdk.remotemessage.Method.VAULT_CARD_RESPONSE:
                    this.notifyObserverVaultCardResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.CAPTURE_PREAUTH_RESPONSE:
                    this.notifyObserversCapturePreAuth(sdkMessage);
                    break;
                case sdk.remotemessage.Method.CLOSEOUT_RESPONSE:
                    this.notifyObserversCloseout(sdkMessage);
                    break;
                case sdk.remotemessage.Method.RETRIEVE_PENDING_PAYMENTS_RESPONSE:
                    this.notifyObserversPendingPaymentsResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.CARD_DATA_RESPONSE:
                    this.notifyObserversReadCardData(sdkMessage);
                    break;
                case sdk.remotemessage.Method.ACTIVITY_MESSAGE_FROM_ACTIVITY:
                    this.notifyObserverActivityMessage(sdkMessage);
                    break;
                case sdk.remotemessage.Method.DISCOVERY_REQUEST:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.ORDER_ACTION_ADD_DISCOUNT:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.ORDER_ACTION_ADD_LINE_ITEM:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.ORDER_ACTION_REMOVE_LINE_ITEM:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.ORDER_ACTION_REMOVE_DISCOUNT:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.PRINT_IMAGE:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.PRINT_TEXT:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.ACTIVITY_RESPONSE:
                    this.notifyObserversActivityResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.REMOTE_ERROR:
                    this.notifyObserversRemoteError(sdkMessage);
                    break;
                case sdk.remotemessage.Method.RETRIEVE_DEVICE_STATUS_RESPONSE:
                    this.notifyObserversRetrieveDeviceStatusResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.RESET_DEVICE_RESPONSE:
                    this.notifyObserversResetDeviceResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.RETRIEVE_PAYMENT_RESPONSE:
                    this.notifyObserversRetrievePaymentResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.GET_PRINTERS_RESPONSE:
                    this.notifyObserversRetrievePrintersResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.PRINT_JOB_STATUS_RESPONSE:
                    this.notifyObserversPrintJobStatusResponse(sdkMessage);
                    break;
                case sdk.remotemessage.Method.SHOW_ORDER_SCREEN:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.SHOW_THANK_YOU_SCREEN:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.SHOW_WELCOME_SCREEN:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.SIGNATURE_VERIFIED:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.TERMINAL_MESSAGE:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.TX_START:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.VOID_PAYMENT:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.CAPTURE_PREAUTH:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.LAST_MSG_REQUEST:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.LAST_MSG_RESPONSE:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.TIP_ADJUST:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.OPEN_CASH_DRAWER:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.SHOW_PAYMENT_RECEIPT_OPTIONS:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.VAULT_CARD:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.CLOSEOUT_REQUEST:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.ACTIVITY_REQUEST:
                    //Outbound no-op
                    break;
                case sdk.remotemessage.Method.RETRIEVE_PAYMENT_REQUEST:
                    //Outbound no-op
                    break;
                default:
                    this.logger.error('COMMAND not supported with method: ' + rMessage.getMethod());
                    break;
            }
        }
    };
    DefaultCloverDevice.prototype.handleRemoteMessageQUERY = function (rMessage) {
        // no-op
    };
    DefaultCloverDevice.prototype.handleRemoteMessageEVENT = function (rMessage) {
        // no-op
    };
    DefaultCloverDevice.prototype.handleRemoteMessage = function (rMessage) {
        try {
            var msgType = rMessage.getType();
            if (msgType == sdk.remotemessage.RemoteMessageType.PING) {
                this.handleRemoteMessagePING(rMessage);
            }
            else if (msgType == sdk.remotemessage.RemoteMessageType.PONG) {
                this.handleRemoteMessagePONG(rMessage);
            }
            else if (msgType == sdk.remotemessage.RemoteMessageType.COMMAND) {
                this.handleRemoteMessageCOMMAND(rMessage);
            }
            else if (msgType == sdk.remotemessage.RemoteMessageType.QUERY) {
                this.handleRemoteMessageQUERY(rMessage);
            }
            else if (msgType == sdk.remotemessage.RemoteMessageType.EVENT) {
                this.handleRemoteMessageEVENT(rMessage);
            }
            else {
                this.logger.error('Unsupported message type: ' + rMessage.getType().toString());
            }
        }
        catch (eM) {
            this.logger.error('Error processing message: ' + rMessage.getPayload(), eM);
        }
    };
    /**
     * Called when a raw message is received from the device
     *
     * @param {string} message - the raw message from the device
     */
    DefaultCloverDevice.prototype.onMessage = function (message) {
        this.logger.debug('onMessage: ' + message);
        try {
            // Parse the message
            var rMessage = this.messageParser.parseToRemoteMessage(message);
            this.handleRemoteMessage(rMessage);
        }
        catch (e) {
            this.logger.error(e);
        }
    };
    /**
     * Send a PONG response
     *
     * @param pingMessage
     */
    DefaultCloverDevice.prototype.sendPong = function (pingMessage) {
        var remoteMessage = new sdk.remotemessage.RemoteMessage();
        remoteMessage.setType(sdk.remotemessage.RemoteMessageType.PONG);
        remoteMessage.setPackageName(this.packageName);
        remoteMessage.setRemoteSourceSDK(DefaultCloverDevice.REMOTE_SDK);
        remoteMessage.setRemoteApplicationID(this.applicationId);
        this.logger.debug('Sending PONG...');
        this.sendRemoteMessage(remoteMessage);
    };
    /**
     * Notify the observers that the device is connected
     *
     * @param transport
     */
    DefaultCloverDevice.prototype.notifyObserversConnected = function (transport) {
        var _this = this;
        this.deviceObservers.forEach(function (obs) {
            obs.onDeviceConnected(_this);
        });
    };
    /**
     * Notify the observers that the device has disconnected
     *
     * @param transport
     */
    DefaultCloverDevice.prototype.notifyObserversDisconnected = function (transport, message) {
        var _this = this;
        this.deviceObservers.forEach(function (obs) {
            obs.onDeviceDisconnected(_this, message);
        });
    };
    /**
     * Notify the observers that the transport failed.
     *
     * @param transport
     */
    DefaultCloverDevice.prototype.notifyObserversDeviceError = function (errorEvent) {
        this.deviceObservers.forEach(function (obs) {
            obs.onDeviceError(errorEvent);
        });
    };
    /**
     * Notify the observers that the device is ready
     *
     * @param transport
     * @param drm
     */
    DefaultCloverDevice.prototype.notifyObserversReady = function (transport, drm) {
        var _this = this;
        this.deviceObservers.forEach(function (obs) {
            obs.onDeviceReady(_this, drm);
        });
    };
    DefaultCloverDevice.prototype.notifyObserverAck = function (ackMessage) {
        var ackTask = this.msgIdToTask[ackMessage.getSourceMessageId()];
        if (ackTask) {
            delete this.msgIdToTask[ackMessage.getSourceMessageId()];
            ackTask.call(null);
        }
        // go ahead and notify listeners of the ACK
        this.deviceObservers.forEach(function (obs) {
            obs.onMessageAck(ackMessage.getSourceMessageId());
        });
    };
    DefaultCloverDevice.prototype.notifyObserverActivityMessage = function (message) {
        this.deviceObservers.forEach(function (obs) {
            obs.onMessageFromActivity(message.getAction(), message.getPayload());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversActivityResponse = function (arm) {
        this.deviceObservers.forEach(function (obs) {
            var status = arm.getResultCode() == -1 ?
                sdk.remotemessage.ResultStatus.SUCCESS :
                sdk.remotemessage.ResultStatus.CANCEL;
            obs.onActivityResponse(status, arm.getPayload(), arm.getFailReason(), arm.getAction());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversReadCardData = function (rcdrm) {
        this.deviceObservers.forEach(function (obs) {
            obs.onReadCardResponse(rcdrm.getStatus(), rcdrm.getReason(), rcdrm.getCardData());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversRetrieveDeviceStatusResponse = function (message) {
        this.deviceObservers.forEach(function (obs) {
            obs.onDeviceStatusResponse(sdk.remotepay.ResponseCode.SUCCESS, message.getReason(), message.getState(), message.getData());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversRetrievePaymentResponse = function (message) {
        this.deviceObservers.forEach(function (obs) {
            obs.onRetrievePaymentResponse(sdk.remotepay.ResponseCode.SUCCESS, message.getReason(), message.getExternalPaymentId(), message.getQueryStatus(), message.getPayment());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversRetrievePrintersResponse = function (message) {
        this.deviceObservers.forEach(function (obs) {
            obs.onRetrievePrintersResponse(sdk.remotepay.ResponseCode.SUCCESS, message.getPrinters());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversPrintJobStatusResponse = function (message) {
        this.deviceObservers.forEach(function (obs) {
            obs.onPrintJobStatusResponse(sdk.remotepay.ResponseCode.SUCCESS, message.getExternalPrintJobId(), message.getStatus());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversResetDeviceResponse = function (message) {
        this.deviceObservers.forEach(function (obs) {
            obs.onResetDeviceResponse(sdk.remotepay.ResponseCode.SUCCESS, message.getReason(), message.getState());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversRemoteError = function (message) {
        this.deviceObservers.forEach(function (obs) {
            // todo:  Add remote error
            var deviceErrorEvent = new sdk.remotepay.CloverDeviceErrorEvent();
            deviceErrorEvent.setCode(sdk.remotepay.DeviceErrorEventCode.UnknownError);
            deviceErrorEvent.setMessage(JSON.stringify(message));
            deviceErrorEvent.setType(sdk.remotepay.ErrorType.EXCEPTION);
            obs.onDeviceError(deviceErrorEvent);
        });
    };
    DefaultCloverDevice.prototype.notifyObserversPaymentRefundResponse = function (rrm) {
        this.deviceObservers.forEach(function (obs) {
            obs.onPaymentRefundResponse(rrm.getOrderId(), rrm.getPaymentId(), rrm.getRefund(), rrm.getCode(), rrm.getReason(), rrm.getMessage());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversKeyPressed = function (keyPress) {
        this.deviceObservers.forEach(function (obs) {
            obs.onKeyPressed(keyPress.getKeyPress());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversCashbackSelected = function (cbSelected) {
        this.deviceObservers.forEach(function (obs) {
            obs.onCashbackSelected(cbSelected.getCashbackAmount());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversTipAdded = function (tipAdded) {
        this.deviceObservers.forEach(function (obs) {
            obs.onTipAdded(tipAdded.getTipAmount());
        });
    };
    DefaultCloverDevice.prototype.notifyObserverTxStart = function (txsrm) {
        this.deviceObservers.forEach(function (obs) {
            obs.onTxStartResponse(txsrm.getResult(), txsrm.getExternalPaymentId(), txsrm.getRequestInfo());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversTipAdjusted = function (tarm) {
        this.deviceObservers.forEach(function (obs) {
            obs.onAuthTipAdjusted(tarm.getPaymentId(), tarm.getAmount(), tarm.getSuccess());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversPartialAuth = function (partialAuth) {
        this.deviceObservers.forEach(function (obs) {
            obs.onPartialAuth(partialAuth.getPartialAuthAmount());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversPaymentVoided = function (payment, voidReason, result, reason, message) {
        this.deviceObservers.forEach(function (obs) {
            obs.onPaymentVoided(payment, voidReason, result, reason, message);
        });
    };
    DefaultCloverDevice.prototype.notifyObserversVerifySignature = function (verifySigMsg) {
        this.deviceObservers.forEach(function (obs) {
            obs.onVerifySignature(verifySigMsg.getPayment(), verifySigMsg.getSignature());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversConfirmPayment = function (confirmPaymentMessage) {
        this.deviceObservers.forEach(function (obs) {
            obs.onConfirmPayment(confirmPaymentMessage.getPayment(), confirmPaymentMessage.getChallenges());
        });
    };
    DefaultCloverDevice.prototype.notifyObserverVaultCardResponse = function (vaultCardResponseMessage) {
        this.deviceObservers.forEach(function (obs) {
            obs.onVaultCardResponse(vaultCardResponseMessage.getCard(), vaultCardResponseMessage.getStatus().toString(), vaultCardResponseMessage.getReason());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversUiState = function (uiStateMsg) {
        this.deviceObservers.forEach(function (obs) {
            obs.onUiState(uiStateMsg.getUiState(), uiStateMsg.getUiText(), uiStateMsg.getUiDirection(), uiStateMsg.getInputOptions());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversCapturePreAuth = function (cparm) {
        this.deviceObservers.forEach(function (obs) {
            obs.onCapturePreAuth(cparm.getStatus(), cparm.getReason(), cparm.getPaymentId(), cparm.getAmount(), cparm.getTipAmount());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversCloseout = function (crm) {
        this.deviceObservers.forEach(function (obs) {
            obs.onCloseoutResponse(crm.getStatus(), crm.getReason(), crm.getBatch());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversPendingPaymentsResponse = function (rpprm) {
        this.deviceObservers.forEach(function (obs) {
            obs.onPendingPaymentsResponse(rpprm.getStatus() == sdk.remotemessage.ResultStatus.SUCCESS, rpprm.getPendingPaymentEntries());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversTxState = function (txStateMsg) {
        this.deviceObservers.forEach(function (obs) {
            obs.onTxState(txStateMsg.getTxState());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversFinishCancel = function (msg) {
        this.deviceObservers.forEach(function (obs) {
            obs.onFinishCancel(msg.getRequestInfo());
        });
    };
    DefaultCloverDevice.prototype.notifyObserversFinishOk = function (msg) {
        this.deviceObservers.forEach(function (obs) {
            if (msg.getPayment()) {
                obs.onFinishOk(msg.getPayment(), msg.getSignature(), msg.getRequestInfo());
            }
            else if (msg.getCredit()) {
                obs.onFinishOk(msg.getCredit());
            }
            else if (msg.getRefund()) {
                obs.onFinishOk(msg.getRefund());
            }
        });
    };
    /**
     * Show Payment Receipt Screen
     *
     * @param {string} orderId
     * @param {string} paymentId
     */
    DefaultCloverDevice.prototype.doShowPaymentReceiptScreen = function (orderId, paymentId) {
        var message = new sdk.remotemessage.ShowPaymentReceiptOptionsMessage();
        message.setOrderId(orderId);
        message.setPaymentId(paymentId);
        message.setVersion(2);
        this.sendObjectMessage(message);
    };
    /**
     * Key Press
     *
     * @param {sdk.remotemessage.KeyPress} keyPress
     */
    DefaultCloverDevice.prototype.doKeyPress = function (keyPress) {
        var message = new sdk.remotemessage.KeyPressMessage();
        message.setKeyPress(keyPress);
        this.sendObjectMessage(message);
    };
    /**
     * Show Thank You Screen
     */
    DefaultCloverDevice.prototype.doShowThankYouScreen = function () {
        var message = new sdk.remotemessage.ThankYouMessage();
        this.sendObjectMessage(message);
    };
    /**
     * Show Welcome Screen
     */
    DefaultCloverDevice.prototype.doShowWelcomeScreen = function () {
        var message = new sdk.remotemessage.WelcomeMessage();
        this.sendObjectMessage(message);
    };
    /**
     * Signature Verified
     *
     * @param {sdk.payments.Payment} payment
     * @param {boolean} verified
     */
    DefaultCloverDevice.prototype.doSignatureVerified = function (payment, verified) {
        var message = new sdk.remotemessage.SignatureVerifiedMessage();
        message.setPayment(payment);
        message.setVerified(verified);
        this.sendObjectMessage(message);
    };
    /**
     * Retrieve Pending Payments
     */
    DefaultCloverDevice.prototype.doRetrievePendingPayments = function () {
        var message = new sdk.remotemessage.RetrievePendingPaymentsMessage();
        this.sendObjectMessage(message);
    };
    /**
     * Terminal Message
     *
     * @param {string} text
     */
    DefaultCloverDevice.prototype.doTerminalMessage = function (text) {
        var message = new sdk.remotemessage.TerminalMessage();
        message.setText(text);
        this.sendObjectMessage(message);
    };
    /**
     * Open Cash Drawer
     *
     * @param {string} reason
     * @param {string} deviceId (optional)
     */
    DefaultCloverDevice.prototype.doOpenCashDrawer = function (reason, deviceId) {
        var message = new sdk.remotemessage.OpenCashDrawerMessage();
        message.setReason(reason);
        if (deviceId) {
            var ptr = new sdk.printer.Printer();
            ptr.setId(deviceId);
            message.setPrinter(ptr);
        }
        this.sendObjectMessage(message);
    };
    /**
     * Closeout
     *
     * @param {boolean} allowOpenTabs
     * @param {string} batchId
     */
    DefaultCloverDevice.prototype.doCloseout = function (allowOpenTabs, batchId) {
        var message = new sdk.remotemessage.CloseoutRequestMessage();
        message.setAllowOpenTabs(allowOpenTabs);
        message.setBatchId(batchId);
        this.sendObjectMessage(message);
    };
    /**
     * Transaction Start
     *
     * @param {sdk.remotemessage.PayIntent} payIntent
     * @param {sdk.remotemessage.Order} order
     * @param {string} requestInfo - request type.
     */
    DefaultCloverDevice.prototype.doTxStart = function (payIntent, order, requestInfo) {
        var message = new sdk.remotemessage.TxStartRequestMessage();
        message.setPayIntent(payIntent);
        message.setOrder(order);
        message.setRequestInfo(requestInfo);
        message.setVersion(2);
        this.sendObjectMessage(message);
    };
    /**
     * Tip Adjust Auth
     *
     * @param {string} orderId
     * @param {string} paymentId
     * @param {number} amount
     */
    DefaultCloverDevice.prototype.doTipAdjustAuth = function (orderId, paymentId, amount) {
        var message = new sdk.remotemessage.TipAdjustMessage();
        message.setOrderId(orderId);
        message.setPaymentId(paymentId);
        message.setTipAmount(amount);
        this.sendObjectMessage(message);
    };
    /**
     * Read Cart Data
     *
     * @param {PayIntent} payIntent
     */
    DefaultCloverDevice.prototype.doReadCardData = function (payIntent) {
        var message = new sdk.remotemessage.CardDataRequestMessage();
        message.setPayIntent(payIntent);
        this.sendObjectMessage(message);
    };
    /**
     * Send a message to a running custom activity
     *
     * @param {string} actionId - the id used when the custom action was started
     * @param {string} payload - the message content, unrestricted format
     */
    DefaultCloverDevice.prototype.doSendMessageToActivity = function (actionId, payload) {
        var message = new sdk.remotemessage.ActivityMessageToActivity();
        message.setAction(actionId);
        message.setPayload(payload);
        this.sendObjectMessage(message);
    };
    /**
     * Print Text
     *
     * @param {Array<string>} textLines
     */
    DefaultCloverDevice.prototype.doPrintText = function (textLines, printRequestId, printDeviceId) {
        var message = new sdk.remotemessage.TextPrintMessage();
        message.setTextLines(textLines);
        if (printRequestId) {
            message.setExternalPrintJobId(printRequestId);
        }
        if (printDeviceId) {
            var ptr = new sdk.printer.Printer();
            ptr.setId(printDeviceId);
            message.setPrinter(ptr);
        }
        this.sendObjectMessage(message);
    };
    /**
     * Print Image (Bitmap)
     *
     * @param {any} bitmap
     */
    DefaultCloverDevice.prototype.doPrintImageObject = function (bitmap, printRequestId, printDeviceId) {
        var _this = this;
        var message = new sdk.remotemessage.ImagePrintMessage();
        // bitmap - HTMLImageElement
        this.imageUtil.getBase64Image(bitmap, function (imageString) {
            message.setPng(imageString);
            if (printRequestId) {
                message.setExternalPrintJobId(printRequestId);
            }
            if (printDeviceId) {
                var ptr = new sdk.printer.Printer();
                ptr.setId(printDeviceId);
                message.setPrinter(ptr);
            }
            if (_this.isFragmentationSupported()) {
                // We need to be putting this in the attachment instead of the payload (for the remoteMessage)
                var base64Png = message.getPng();
                message.setPng(null);
                _this.sendObjectMessage(message, base64Png, DefaultCloverDevice.BASE64);
            }
            else {
                _this.sendObjectMessage(message);
            }
        });
    };
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
    DefaultCloverDevice.prototype.doPrintImageUrl = function (url, printRequestId, printDeviceId) {
        var _this = this;
        this.imageUtil.loadImageFromURL(url, function (image) {
            _this.doPrintImageObject(image, printRequestId, printDeviceId);
        }, function (errorMessage) {
            var deviceErrorEvent = new sdk.remotepay.CloverDeviceErrorEvent();
            deviceErrorEvent.setCode(sdk.remotepay.DeviceErrorEventCode.UnknownError);
            deviceErrorEvent.setMessage(errorMessage);
            deviceErrorEvent.setType(sdk.remotepay.ErrorType.EXCEPTION);
            _this.notifyObserversDeviceError(deviceErrorEvent);
        });
    };
    DefaultCloverDevice.prototype.doStartActivity = function (action, payload, nonBlocking) {
        var request = new sdk.remotemessage.ActivityRequest();
        request.setAction(action);
        request.setPayload(payload);
        request.setNonBlocking(nonBlocking);
        request.setForceLaunch(false);
        this.sendObjectMessage(request);
    };
    /**
     * Void Payment
     *
     * @param {sdk.payments.Payment} payment
     * @param {sdk.order.VoidReason} reason
     */
    DefaultCloverDevice.prototype.doVoidPayment = function (payment, reason) {
        var _this = this;
        var message = new sdk.remotemessage.VoidPaymentMessage();
        message.setPayment(payment);
        message.setVoidReason(reason);
        var remoteMessage = this.buildRemoteMessageToSend(message);
        var msgId = remoteMessage.getId();
        if (!this.supportsAcks()) {
            this.sendRemoteMessage(remoteMessage);
            this.notifyObserversPaymentVoided(payment, reason, sdk.remotemessage.ResultStatus.SUCCESS, null, null);
        }
        else {
            // we will send back response after we get an ack
            this.addTaskForAck(msgId, function () {
                _this.notifyObserversPaymentVoided(payment, reason, sdk.remotemessage.ResultStatus.SUCCESS, null, null);
            });
            //this.msgIdToTask[msgId] = () => {
            //    this.notifyObserversPaymentVoided(payment, reason, sdk.remotemessage.ResultStatus.SUCCESS, null, null);
            //};
            this.sendRemoteMessage(remoteMessage);
        }
    };
    DefaultCloverDevice.prototype.addTaskForAck = function (msgId, task) {
        this.msgIdToTask[msgId] = task;
    };
    /**
     * Payment Refund
     *
     * @param {string} orderId
     * @param {string} paymentId
     * @param {number} amount
     * @param {boolean} fullRefund
     */
    DefaultCloverDevice.prototype.doPaymentRefund = function (orderId, paymentId, amount, fullRefund) {
        var message = new sdk.remotemessage.RefundRequestMessage();
        message.setOrderId(orderId);
        message.setPaymentId(paymentId);
        message.setAmount(amount);
        message.setFullRefund(fullRefund);
        this.sendObjectMessage(message);
    };
    /**
     * Vault Card
     *
     * @param {number} cardEntryMethods
     */
    DefaultCloverDevice.prototype.doVaultCard = function (cardEntryMethods) {
        var message = new sdk.remotemessage.VaultCardMessage();
        message.setCardEntryMethods(cardEntryMethods);
        this.sendObjectMessage(message);
    };
    /**
     * Capture Auth
     *
     * @param {string} paymentId
     * @param {number} amount
     * @param {number} tipAmount
     */
    DefaultCloverDevice.prototype.doCaptureAuth = function (paymentId, amount, tipAmount) {
        var message = new sdk.remotemessage.CapturePreAuthMessage();
        message.setPaymentId(paymentId);
        message.setAmount(amount);
        message.setTipAmount(tipAmount);
        this.sendObjectMessage(message);
    };
    /**
     * Accept Payment
     *
     * @param {Payment} payment
     */
    DefaultCloverDevice.prototype.doAcceptPayment = function (payment) {
        var message = new sdk.remotemessage.PaymentConfirmedMessage();
        message.setPayment(payment);
        this.sendObjectMessage(message);
    };
    /**
     * Reject Payment
     *
     * @param {Payment} payment
     * @param {Challenge} challenge
     */
    DefaultCloverDevice.prototype.doRejectPayment = function (payment, challenge) {
        var message = new sdk.remotemessage.PaymentRejectedMessage();
        message.setPayment(payment);
        message.setReason(challenge.getReason());
        this.sendObjectMessage(message);
    };
    /**
     * Discovery request
     */
    DefaultCloverDevice.prototype.doDiscoveryRequest = function () {
        var drm = new sdk.remotemessage.DiscoveryRequestMessage();
        drm.setSupportsOrderModification(false);
        this.sendObjectMessage(drm);
    };
    /**
     * Order Update
     *
     * @param {DisplayOrder} order
     * @param {any} orderOperation
     */
    DefaultCloverDevice.prototype.doOrderUpdate = function (order, orderOperation) {
        var message = new sdk.remotemessage.OrderUpdateMessage();
        message.setOrder(order);
        if (orderOperation) {
            if (orderOperation instanceof sdk.order.operation.DiscountsAddedOperation) {
                message.setDiscountsAddedOperation(orderOperation);
            }
            else if (orderOperation instanceof sdk.order.operation.DiscountsDeletedOperation) {
                message.setDiscountsDeletedOperation(orderOperation);
            }
            else if (orderOperation instanceof sdk.order.operation.LineItemsAddedOperation) {
                message.setLineItemsAddedOperation(orderOperation);
            }
            else if (orderOperation instanceof sdk.order.operation.LineItemsDeletedOperation) {
                message.setLineItemsDeletedOperation(orderOperation);
            }
            else if (orderOperation instanceof sdk.order.operation.OrderDeletedOperation) {
                message.setOrderDeletedOperation(orderOperation);
            }
        }
        this.sendObjectMessage(message);
    };
    /**
     * Reset Device
     */
    DefaultCloverDevice.prototype.doResetDevice = function () {
        var message = new sdk.remotemessage.BreakMessage();
        this.sendObjectMessage(message);
    };
    DefaultCloverDevice.prototype.doRetrieveDeviceStatus = function (request) {
        var message = new sdk.remotemessage.RetrieveDeviceStatusRequestMessage();
        message.setSendLastMessage(request.getSendLastMessage());
        this.sendObjectMessage(message);
    };
    DefaultCloverDevice.prototype.doRetrievePayment = function (externalPaymentId) {
        var message = new sdk.remotemessage.RetrievePaymentRequestMessage();
        message.setExternalPaymentId(externalPaymentId);
        this.sendObjectMessage(message);
    };
    DefaultCloverDevice.prototype.doRetrievePrinters = function (category) {
        var message = new sdk.remotemessage.GetPrintersRequestMessage();
        if (category) {
            message.setCategory(category);
        }
        this.sendObjectMessage(message);
    };
    DefaultCloverDevice.prototype.doRetrievePrintJobStatus = function (printRequestId) {
        var message = new sdk.remotemessage.PrintJobStatusRequestMessage();
        message.setExternalPrintJobId(printRequestId);
        this.sendObjectMessage(message);
    };
    /**
     * Dispose
     */
    DefaultCloverDevice.prototype.dispose = function () {
        this.deviceObservers.splice(0, this.deviceObservers.length);
        if (this.transport) {
            this.transport.dispose();
            this.transport = null;
        }
    };
    DefaultCloverDevice.prototype.sendObjectMessage = function (remoteMessage, attachment, attachmentEncoding) {
        return this.buildRemoteMessages(remoteMessage, attachment, attachmentEncoding); // this now sends the messages and returns the ID
    };
    DefaultCloverDevice.prototype.buildBaseRemoteMessage = function (remoteMessage) {
        // Make sure the message is not null
        if (remoteMessage == null) {
            this.logger.debug('Message is null');
            return null;
        }
        // Check the message method
        this.logger.info(remoteMessage.toString());
        if (remoteMessage.getMethod() == null) {
            this.logger.error('Invalid Message', new Error('Invalid Message: ' + remoteMessage.toString()));
            return null;
        }
        // Check the application id
        if (this.applicationId == null) {
            this.logger.error('Invalid ApplicationID: ' + this.applicationId);
            throw new Error('Invalid applicationId');
        }
        var messageId = (++DefaultCloverDevice.id) + '';
        var remoteMessageToReturn = new sdk.remotemessage.RemoteMessage();
        remoteMessageToReturn.setId(messageId);
        remoteMessageToReturn.setType(sdk.remotemessage.RemoteMessageType.COMMAND);
        remoteMessageToReturn.setPackageName(this.packageName);
        remoteMessageToReturn.setMethod(remoteMessage.getMethod().toString());
        remoteMessageToReturn.setVersion(this.remoteMessageVersion);
        remoteMessageToReturn.setRemoteSourceSDK(DefaultCloverDevice.REMOTE_SDK);
        remoteMessageToReturn.setRemoteApplicationID(this.applicationId);
        return remoteMessageToReturn;
    };
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
    DefaultCloverDevice.prototype.addSuppressElementsWrapper = function (message) {
        for (var fieldKey in message) {
            var metaInfo = message.getMetaInfo(fieldKey);
            if (metaInfo && (metaInfo.type == Array)) {
                message[fieldKey].suppressElementsWrapper = true;
            }
        }
        return message;
    };
    DefaultCloverDevice.prototype.buildRemoteMessageToSend = function (message) {
        var remoteMessage = this.buildBaseRemoteMessage(message);
        message = this.addSuppressElementsWrapper(message);
        remoteMessage.setPayload(JSON.stringify(message, DefaultCloverDevice.stringifyClover));
        return remoteMessage;
    };
    DefaultCloverDevice.prototype.buildRemoteMessages = function (message, attachment, attachmentEncoding) {
        var remoteMessage = this.buildBaseRemoteMessage(message);
        message = this.addSuppressElementsWrapper(message);
        if (attachmentEncoding) {
            remoteMessage.setAttachmentEncoding(attachmentEncoding);
        }
        var messagePayload = JSON.stringify(message, DefaultCloverDevice.stringifyClover);
        if (this.isFragmentationSupported()) {
            var payloadTooLarge = (messagePayload ? messagePayload.length : 0) > this.maxMessageSizeInChars;
            if (payloadTooLarge || attachment) {
                if (attachment && attachment.length > CloverConnector_1.CloverConnector.MAX_PAYLOAD_SIZE) {
                    this.logger.error('Error sending message - payload size is greater than the maximum allowed.');
                    return null;
                }
                var fragmentIndex = 0;
                // fragmenting loop for payload
                while (messagePayload.length > 0) {
                    remoteMessage.setLastFragment(false);
                    if (messagePayload.length <= this.maxMessageSizeInChars) {
                        remoteMessage.setPayload(messagePayload);
                        messagePayload = "";
                        // If the attachment is null at this point, then this is the last fragment
                        remoteMessage.setLastFragment(attachment == null);
                    }
                    else {
                        remoteMessage.setPayload(messagePayload.substr(0, this.maxMessageSizeInChars));
                        messagePayload = messagePayload.substr(this.maxMessageSizeInChars);
                    }
                    remoteMessage.setFragmentIndex(fragmentIndex++);
                    this.sendRemoteMessage(remoteMessage);
                } //end fragment payload loop
                remoteMessage.setPayload(null);
                if (attachment) {
                    //fragmenting loop for attachment
                    if (attachmentEncoding == DefaultCloverDevice.BASE64) {
                        remoteMessage.setAttachmentEncoding(DefaultCloverDevice.BASE64_ATTACHMENT);
                        while (attachment.length > 0) {
                            remoteMessage.setLastFragment(false);
                            if (attachment.length <= this.maxMessageSizeInChars) {
                                remoteMessage.setAttachment(attachment);
                                attachment = "";
                                remoteMessage.setLastFragment(true);
                            }
                            else {
                                remoteMessage.setAttachment(attachment.substr(0, this.maxMessageSizeInChars));
                                attachment = attachment.substr(this.maxMessageSizeInChars);
                            }
                            remoteMessage.setFragmentIndex(fragmentIndex++);
                            this.sendRemoteMessage(remoteMessage);
                        } //end fragment attachment loop
                    }
                    else {
                        // We got an attachment, but no encoding, complain.
                        this.logger.error('Attachment on message, but no encoding specified.  No idea how to send it.');
                        // TODO:  Probably a good idea to throw here, but  then we need to handle that in the top level.  Leave for later.
                    }
                }
            }
            else {
                if (messagePayload.length > this.maxMessageSizeInChars) {
                    this.logger.warn("The message payload is larger than the maxMessageSizeInChars but fragmentation is not supported by the apps installed on the device.  This may result in a payload that is too large to handle and a silent failure.");
                }
                remoteMessage.setPayload(messagePayload);
                if (attachment) {
                    remoteMessage.setAttachment(attachment);
                }
                this.sendRemoteMessage(remoteMessage);
            }
        }
        else {
            // fragmenting is not possible, just send as is
            remoteMessage.setPayload(messagePayload);
            this.sendRemoteMessage(remoteMessage);
        }
        return remoteMessage.getId();
    };
    DefaultCloverDevice.stringifyClover = function (key, value) {
        // If the element is an array, and it does NOT have the suppressElementsWrapper property,
        // and the key is NOT "elements", then add the elements wrapper object
        if (Array.isArray(value) &&
            !value.hasOwnProperty("suppressElementsWrapper") &&
            (key != "elements")) {
            //converts array into the format that clover devices expect
            //from) foo : []
            //to) foo : {elements : []}
            return { elements: value };
        }
        return value;
    };
    DefaultCloverDevice.prototype.sendRemoteMessage = function (remoteMessage) {
        var message = JSON.stringify(remoteMessage);
        if (this.transport) {
            this.logger.debug("Sending: " + message);
            this.transport.sendMessage(message);
        }
        else {
            this.logger.error("Cannot send message, transport is null: " + message);
        }
    };
    /**
     * If the remote message version is 2, fragmentation is supported.
     *
     * @returns {boolean}
     */
    DefaultCloverDevice.prototype.isFragmentationSupported = function () {
        return this.remoteMessageVersion > 1;
    };
    // Remote message version and message version are not the same.  Remote message version is used for high-level
    // feature detection - e.g. is message fragmentation supported or not?
    DefaultCloverDevice.DEFAULT_REMOTE_MESSAGE_VERSION = 1;
    DefaultCloverDevice.REMOTE_SDK = Version_1.Version.CLOVER_CLOUD_SDK + ":" + Version_1.Version.CLOVER_CLOUD_SDK_VERSION;
    DefaultCloverDevice.BASE64 = "BASE64";
    DefaultCloverDevice.BASE64_ATTACHMENT = DefaultCloverDevice.BASE64 + ".ATTACHMENT";
    DefaultCloverDevice.id = 0;
    return DefaultCloverDevice;
}(CloverDevice_1.CloverDevice));
exports.DefaultCloverDevice = DefaultCloverDevice;

//# sourceMappingURL=../../../../../maps/com/clover/remote/client/device/DefaultCloverDevice.js.map
