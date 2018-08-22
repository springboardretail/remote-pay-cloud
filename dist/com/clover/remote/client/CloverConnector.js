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
var CardEntryMethods_1 = require("./CardEntryMethods");
var CloverConnectorBroadcaster_1 = require("./CloverConnectorBroadcaster");
var CloverDeviceFactory_1 = require("./device/CloverDeviceFactory");
var Logger_1 = require("./util/Logger");
var Builder_1 = require("../../util/PayIntent/Builder");
/**
 * Clover Connector
 *
 * The clover connector implements the ICloverConnector interface. This is where
 * we define how the connector interacts with remote pay adapters.
 */
var CloverConnector = (function () {
    function CloverConnector(config) {
        // manual is not enabled by default
        this.cardEntryMethods = CardEntryMethods_1.CardEntryMethods.DEFAULT;
        // Create a logger
        this.logger = Logger_1.Logger.create();
        // List of listeners to broadcast notifications to
        this.broadcaster = new CloverConnectorBroadcaster_1.CloverConnectorBroadcaster();
        // Flag indicating whether the device is ready or not
        this.isReady = false;
        // Set the cancel input option
        CloverConnector.CANCEL_INPUT_OPTION = new sdk.remotemessage.InputOption();
        CloverConnector.CANCEL_INPUT_OPTION.setKeyPress(sdk.remotemessage.KeyPress.ESC);
        CloverConnector.CANCEL_INPUT_OPTION.setDescription("Cancel");
        // Try to load the configuration.
        if (config) {
            this.configuration = config;
        }
    }
    /**
     * Initialize the connector with a new config
     *
     * @param {CloverDeviceConfiguration} config - the configuration for the connector
     */
    CloverConnector.prototype.initialize = function (config) {
        this.configuration = config;
        this.deviceObserver = new CloverConnector.InnerDeviceObserver(this);
        // Get the device and subscribe to it.
        this.device = CloverDeviceFactory_1.CloverDeviceFactory.get(config);
        if (this.device) {
            this.device.subscribe(this.deviceObserver);
        }
    };
    CloverConnector.prototype.initializeConnection = function () {
        if (!this.device) {
            this.initialize(this.configuration);
        }
    };
    /**
     * Add new listener to receive broadcast notifications
     *
     * @param {sdk.remotepay.ICloverConnectorListener} connectorListener - the listener to add
     */
    CloverConnector.prototype.addCloverConnectorListener = function (connectorListener) {
        this.broadcaster.push(connectorListener);
    };
    /**
     * Remove a listener
     *
     * @param {sdk.remotepay.ICloverConnectorListener} connectorListener - the listener to remove
     */
    CloverConnector.prototype.removeCloverConnectorListener = function (connectorListener) {
        var indexOfListener = this.broadcaster.indexOf(connectorListener);
        if (indexOfListener != -1) {
            this.broadcaster.splice(indexOfListener, 1);
        }
    };
    CloverConnector.prototype.sale = function (request) {
        this.lastRequest = request;
        if (!this.device || !this.isReady) {
            this.deviceObserver.onFinishCancelSale(sdk.remotepay.ResponseCode.ERROR, "Device Connection Error", "In sale: SaleRequest - The Clover device is not connected.");
        }
        else if (request == null) {
            this.deviceObserver.onFinishCancelSale(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In sale: SaleRequest - The request that was passed in for processing is null.");
        }
        else if (request.getAmount() == null || request.getAmount() <= 0) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In sale: SaleRequest - The request amount cannot be zero. Original Request = " + request, CloverConnector.TxTypeRequestInfo.SALE_REQUEST);
        }
        else if (request.getTipAmount() && request.getTipAmount() < 0) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In sale: SaleRequest - The tip amount cannot be less than zero. Original Request = " + request, CloverConnector.TxTypeRequestInfo.SALE_REQUEST);
        }
        else if (request.getExternalId() == null || request.getExternalId().trim().length == 0 || request.getExternalId().trim().length > 32) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In sale: SaleRequest - The externalId is required and the max length is 32 characters. Original Request = " + request, CloverConnector.TxTypeRequestInfo.SALE_REQUEST);
        }
        else if (request.getVaultedCard() && !this.merchantInfo.getSupportsVaultCards()) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In sale: SaleRequest - Vault Card support is not enabled for the payment gateway. Original Request = " + request, CloverConnector.TxTypeRequestInfo.SALE_REQUEST);
        }
        else {
            if (request.getTipAmount() == null) {
                request.setTipAmount(0);
            }
            try {
                this.saleAuth(request);
            }
            catch (e) {
                this.logger.debug("Error in sale", e);
                this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.ERROR, e, null, CloverConnector.TxTypeRequestInfo.SALE_REQUEST);
            }
        }
    };
    /**
     * A common PayIntent builder method for Sale, Auth and PreAuth
     *
     * @param request
     * @param suppressTipScreen
     */
    CloverConnector.prototype.saleAuth = function (request) {
        if (this.device && this.isReady) {
            this.lastRequest = request;
            var builder = new Builder_1.PayIntent.Builder();
            var transactionSettings = new sdk.payments.TransactionSettings();
            builder.setTransactionType(request.getType()); // difference between sale, auth and auth(preAuth)
            builder.setAmount(request.getAmount());
            builder.setVaultedCard(request.getVaultedCard());
            builder.setExternalPaymentId(request.getExternalId().trim());
            builder.setRequiresRemoteConfirmation(true);
            if (request.getCardNotPresent()) {
                builder.setCardNotPresent(request.getCardNotPresent());
            }
            transactionSettings.setCardEntryMethods(request.getCardEntryMethods() ? request.getCardEntryMethods() : this.cardEntryMethods);
            if (request.getDisablePrinting()) {
                transactionSettings.setCloverShouldHandleReceipts(!request.getDisablePrinting());
            }
            if (request.getDisableRestartTransactionOnFail()) {
                transactionSettings.setDisableRestartTransactionOnFailure(request.getDisableRestartTransactionOnFail());
            }
            transactionSettings.setSignatureEntryLocation(request.getSignatureEntryLocation());
            transactionSettings.setSignatureThreshold(request.getSignatureThreshold());
            transactionSettings.setDisableReceiptSelection(request.getDisableReceiptSelection());
            transactionSettings.setDisableDuplicateCheck(request.getDisableDuplicateChecking());
            transactionSettings.setAutoAcceptPaymentConfirmations(request.getAutoAcceptPaymentConfirmations());
            transactionSettings.setAutoAcceptSignature(request.getAutoAcceptSignature());
            var paymentRequestType = null;
            if (request instanceof sdk.remotepay.PreAuthRequest) {
                paymentRequestType = CloverConnector.TxTypeRequestInfo.PREAUTH_REQUEST;
            }
            else if (request instanceof sdk.remotepay.AuthRequest) {
                paymentRequestType = CloverConnector.TxTypeRequestInfo.AUTH_REQUEST;
                var req = request;
                if (req.getTaxAmount()) {
                    builder.setTaxAmount(req.getTaxAmount());
                }
                if (req.getTippableAmount()) {
                    transactionSettings.setTippableAmount(req.getTippableAmount());
                }
                if (req.getAllowOfflinePayment()) {
                    transactionSettings.setAllowOfflinePayment(req.getAllowOfflinePayment());
                }
                if (req.getApproveOfflinePaymentWithoutPrompt()) {
                    transactionSettings.setApproveOfflinePaymentWithoutPrompt(req.getApproveOfflinePaymentWithoutPrompt());
                }
                if (req.getDisableCashback()) {
                    transactionSettings.setDisableCashBack(req.getDisableCashback());
                }
                transactionSettings.setTipMode(sdk.payments.TipMode.ON_PAPER); // overriding TipMode, since it's an Auth request
            }
            else if (request instanceof sdk.remotepay.SaleRequest) {
                paymentRequestType = CloverConnector.TxTypeRequestInfo.SALE_REQUEST;
                var req = request;
                // shared with AuthRequest
                if (req.getAllowOfflinePayment()) {
                    transactionSettings.setAllowOfflinePayment(req.getAllowOfflinePayment());
                }
                if (req.getApproveOfflinePaymentWithoutPrompt()) {
                    transactionSettings.setApproveOfflinePaymentWithoutPrompt(req.getApproveOfflinePaymentWithoutPrompt());
                }
                if (req.getDisableCashback()) {
                    transactionSettings.setDisableCashBack(req.getDisableCashback());
                }
                if (req.getTaxAmount()) {
                    builder.setTaxAmount(req.getTaxAmount());
                }
                // SaleRequest
                if (req.getTippableAmount()) {
                    transactionSettings.setTippableAmount(req.getTippableAmount());
                }
                if (req.getTipAmount() !== undefined) {
                    builder.setTipAmount(req.getTipAmount());
                }
                if (req.getTipMode()) {
                    transactionSettings.setTipMode(CloverConnector.getV3TipModeFromRequestTipMode(req.getTipMode()));
                }
                else if (req.getDisableTipOnScreen()) {
                    transactionSettings.setTipMode(sdk.payments.TipMode.NO_TIP);
                }
            }
            builder.setTransactionSettings(transactionSettings);
            var payIntent = builder.build();
            this.device.doTxStart(payIntent, null, paymentRequestType);
        }
    };
    CloverConnector.getV3TipModeFromRequestTipMode = function (saleTipMode) {
        var allowedTipModes = [
            sdk.payments.TipMode.TIP_PROVIDED,
            sdk.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT,
            sdk.payments.TipMode.NO_TIP
        ];
        if (allowedTipModes.indexOf(saleTipMode) > -1) {
            return saleTipMode;
        }
        return null;
    };
    CloverConnector.prototype.notifyDeviceNotConnected = function (message) {
        this.notifyDeviceError(sdk.remotepay.ErrorType.COMMUNICATION, sdk.remotepay.DeviceErrorEventCode.NotConnected, null, message + ": Device is not connected.");
    };
    CloverConnector.prototype.notifyInvalidData = function (message) {
        this.notifyDeviceError(sdk.remotepay.ErrorType.VALIDATION, sdk.remotepay.DeviceErrorEventCode.InvalidParam, null, message);
    };
    CloverConnector.prototype.notifyDeviceError = function (errorType, errorCode, cause, message) {
        var deviceErrorEvent = new sdk.remotepay.CloverDeviceErrorEvent();
        deviceErrorEvent.setType(errorType);
        deviceErrorEvent.setCode(errorCode);
        deviceErrorEvent.setCause(cause);
        deviceErrorEvent.setMessage(message);
        this.broadcaster.notifyOnDeviceError(deviceErrorEvent);
    };
    CloverConnector.prototype.acceptSignature = function (request) {
        var logLocation = "In acceptSignature";
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected(logLocation);
        }
        else if (request == null) {
            this.notifyInvalidData(logLocation + ": VerifySignatureRequest cannot be null.");
        }
        else if (request.getPayment() == null || request.getPayment().getId() == null) {
            this.notifyInvalidData(logLocation + ": VerifySignatureRequest. Payment must have an ID.");
        }
        else {
            this.device.doSignatureVerified(request.getPayment(), true);
        }
    };
    CloverConnector.prototype.rejectSignature = function (request) {
        var logLocation = "In rejectSignature";
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected(logLocation);
        }
        else if (request == null) {
            this.notifyInvalidData(logLocation + ": VerifySignatureRequest cannot be null.");
        }
        else if (request.getPayment() == null || request.getPayment().getId() == null) {
            this.notifyInvalidData(logLocation + ": VerifySignatureRequest. Payment must have an ID.");
        }
        else {
            this.device.doSignatureVerified(request.getPayment(), false);
        }
    };
    CloverConnector.prototype.acceptPayment = function (payment) {
        var logLocation = "In acceptPayment";
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected(logLocation);
        }
        else if (payment == null) {
            this.notifyInvalidData(logLocation + ": Payment cannot be null.");
        }
        else if (payment.getId() == null) {
            this.notifyInvalidData(logLocation + ": Payment must have an ID.");
        }
        else {
            this.device.doAcceptPayment(payment);
        }
    };
    CloverConnector.prototype.rejectPayment = function (payment, challenge) {
        var logLocation = "In rejectPayment";
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected(logLocation);
        }
        else if (payment == null) {
            this.notifyInvalidData(logLocation + ": Payment cannot be null.");
        }
        else if (payment.getId() == null) {
            this.notifyInvalidData(logLocation + ": Payment must have an ID.");
        }
        else if (challenge == null) {
            this.notifyInvalidData(logLocation + ": Challenge cannot be null.");
        }
        else {
            this.device.doRejectPayment(payment, challenge);
        }
    };
    CloverConnector.prototype.auth = function (request) {
        this.lastRequest = request;
        if (!this.device || !this.isReady) {
            this.deviceObserver.onFinishCancelAuth(sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In auth: Auth Request - The Clover device is not connected.");
        }
        else if (!this.merchantInfo.getSupportsAuths()) {
            this.deviceObserver.onFinishCancelAuth(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In auth: AuthRequest - " +
                "Auths are not enabled for the payment gateway. Original Request = " + request);
        }
        else if (request == null) {
            this.deviceObserver.onFinishCancelAuth(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In auth: AuthRequest - The request that was passed in for processing is null.");
        }
        else if (request.getAmount() == null || request.getAmount() <= 0) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In auth: AuthRequest - " +
                "The request amount cannot be zero. Original Request = " + request, CloverConnector.TxTypeRequestInfo.AUTH_REQUEST);
        }
        else if (request.getExternalId() == null || request.getExternalId().trim().length == 0 ||
            request.getExternalId().trim().length > 32) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In auth: AuthRequest - The externalId is invalid. It is " +
                "required and the max length is 32. Original Request = " + request, CloverConnector.TxTypeRequestInfo.AUTH_REQUEST);
        }
        else if (request.getVaultedCard() && !this.merchantInfo.getSupportsVaultCards()) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In auth: AuthRequest - " +
                "Vault Card support is not enabled for the payment gateway. Original Request = " + request, CloverConnector.TxTypeRequestInfo.AUTH_REQUEST);
        }
        else {
            try {
                this.saleAuth(request);
            }
            catch (e) {
                this.logger.debug("Error in auth", e);
                this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.ERROR, e, null, CloverConnector.TxTypeRequestInfo.AUTH_REQUEST);
            }
        }
    };
    CloverConnector.prototype.preAuth = function (request) {
        this.lastRequest = request;
        if (!this.device || !this.isReady) {
            this.deviceObserver.onFinishCancelPreAuth(sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In preAuth: PreAuthRequest - The Clover device is not connected.");
        }
        else if (!this.merchantInfo.getSupportsPreAuths()) {
            this.deviceObserver.onFinishCancelPreAuth(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In preAuth: PreAuthRequest - " +
                "PreAuths are not enabled for the payment gateway. Original Request = " + request);
        }
        else if (request == null) {
            this.deviceObserver.onFinishCancelPreAuth(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In preAuth: PreAuthRequest - " +
                "The request that was passed in for processing is null.");
        }
        else if (request.getAmount() == null || request.getAmount() <= 0) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In preAuth: PreAuthRequest - " +
                "The request amount cannot be zero. Original Request = " + request, CloverConnector.TxTypeRequestInfo.PREAUTH_REQUEST);
        }
        else if (request.getExternalId() == null || request.getExternalId().trim().length == 0 ||
            request.getExternalId().trim().length > 32) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In preAuth: PreAuthRequest - The externalId is invalid. " +
                "It is required and the max length is 32. Original Request = " + request, CloverConnector.TxTypeRequestInfo.PREAUTH_REQUEST);
        }
        else if (request.getVaultedCard() && !this.merchantInfo.getSupportsVaultCards()) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In preAuth: PreAuthRequest - " +
                "Vault Card support is not enabled for the payment gateway. Original Request = " + request, CloverConnector.TxTypeRequestInfo.PREAUTH_REQUEST);
        }
        else {
            try {
                this.saleAuth(request);
            }
            catch (e) {
                this.lastRequest = null;
                this.logger.debug("Error in preAuth", e);
                this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.ERROR, e, null, CloverConnector.TxTypeRequestInfo.PREAUTH_REQUEST);
            }
        }
    };
    CloverConnector.prototype.capturePreAuth = function (request) {
        if (!this.device || !this.isReady) {
            this.deviceObserver.onCapturePreAuth(sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In capturePreAuth: CapturePreAuth - The Clover device is not connected.", null, null);
        }
        else if (!this.merchantInfo.getSupportsPreAuths()) {
            this.deviceObserver.onCapturePreAuth(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In capturePreAuth: PreAuth Captures are not enabled for the payment gateway. Original Request = " +
                request, null, null);
        }
        else if (request == null) {
            this.deviceObserver.onCapturePreAuth(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In capturePreAuth: CapturePreAuth - " +
                "The request that was passed in for processing is null.", null, null);
        }
        else if (request.getAmount() < 0 || request.getTipAmount() < 0) {
            this.deviceObserver.onCapturePreAuth(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In capturePreAuth: CapturePreAuth - " +
                "The request amount must be greater than zero and the tip must be greater " +
                "than or equal to zero. Original Request = " + request, null, null);
        }
        else if (!request.getPaymentId()) {
            this.deviceObserver.onCapturePreAuth(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In capturePreAuth: CapturePreAuth - " +
                "The paymentId is null. Original Request = " + request, null, null);
        }
        else {
            try {
                this.device.doCaptureAuth(request.getPaymentId(), request.getAmount(), request.getTipAmount());
            }
            catch (e) {
                var response = new sdk.remotepay.CapturePreAuthResponse();
                CloverConnector.populateBaseResponse(response, false, sdk.remotepay.ResponseCode.UNSUPPORTED, "Pre Auths unsupported", "The currently configured merchant gateway does not support Capture Auth requests.");
                this.broadcaster.notifyOnCapturePreAuth(response);
            }
        }
    };
    CloverConnector.prototype.tipAdjustAuth = function (request) {
        if (!this.device || !this.isReady) {
            this.deviceObserver.onAuthTipAdjusted(sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In tipAdjustAuth: TipAdjustAuthRequest - The Clover device is not connected.");
        }
        else if (!this.merchantInfo.getSupportsTipAdjust()) {
            this.deviceObserver.onAuthTipAdjusted(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In tipAdjustAuth: TipAdjustAuthRequest - Tip Adjustments are not enabled for the payment gateway. Original Request = " + request);
        }
        else if (request == null) {
            this.deviceObserver.onAuthTipAdjusted(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In tipAdjustAuth: TipAdjustAuthRequest - The request that was passed in for processing is null.");
        }
        else if (request.getPaymentId() == null) {
            this.deviceObserver.onAuthTipAdjusted(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In tipAdjustAuth: TipAdjustAuthRequest - The paymentId is required.");
        }
        else if (request.getTipAmount() < 0) {
            this.deviceObserver.onAuthTipAdjusted(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In tipAdjustAuth: TipAdjustAuthRequest - The request amount cannot be less than zero. Original Request = " + request);
        }
        else {
            this.device.doTipAdjustAuth(request.getOrderId(), request.getPaymentId(), request.getTipAmount());
        }
    };
    CloverConnector.prototype.vaultCard = function (cardEntryMethods) {
        if (!this.device || !this.isReady) {
            this.deviceObserver.onVaultCardResponseInternal(false, sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In vaultCard: The Clover device is not connected.", null);
        }
        else if (!this.merchantInfo.getSupportsVaultCards()) {
            this.deviceObserver.onVaultCardResponseInternal(false, sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In vaultCard: VaultCard/Payment Tokens are not enabled for the payment gateway.", null);
        }
        else {
            this.device.doVaultCard(cardEntryMethods ? cardEntryMethods : this.getCardEntryMethods());
        }
    };
    CloverConnector.prototype.voidPayment = function (request) {
        if (!this.device || !this.isReady) {
            this.deviceObserver.onPaymentVoided_responseCode(sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In voidPayment: VoidPaymentRequest - The Clover device is not connected.");
        }
        else if (request == null) {
            this.deviceObserver.onPaymentVoided_responseCode(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In voidPayment: VoidPaymentRequest - The request that was passed in for processing is null.");
        }
        else if (request.getPaymentId() == null) {
            this.deviceObserver.onPaymentVoided_responseCode(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In voidPayment: VoidPaymentRequest - The paymentId is required.");
        }
        else {
            var payment = new sdk.payments.Payment();
            payment.setId(request.getPaymentId());
            payment.setOrder(new sdk.base.Reference());
            payment.getOrder().setId(request.getOrderId());
            payment.setEmployee(new sdk.base.Reference());
            payment.getEmployee().setId(request.getEmployeeId());
            var reason = sdk.order.VoidReason[request.getVoidReason()];
            this.device.doVoidPayment(payment, reason);
        }
    };
    CloverConnector.prototype.refundPayment = function (request) {
        if (!this.device || !this.isReady) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.CANCEL, "Device Connection Error", "In refundPayment: RefundPaymentRequest - The Clover device is not connected.", CloverConnector.TxTypeRequestInfo.REFUND_REQUEST);
        }
        else if (request == null) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.CANCEL, "Request Validation Error", "In refundPayment: RefundPaymentRequest - The request that was passed in for processing is empty.", CloverConnector.TxTypeRequestInfo.REFUND_REQUEST);
        }
        else if (request.getPaymentId() == null) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.CANCEL, "Request Validation Error", "In refundPayment: RefundPaymentRequest PaymentID cannot be empty. " + request, CloverConnector.TxTypeRequestInfo.REFUND_REQUEST);
        }
        else if ((request.getAmount() == null || request.getAmount() <= 0) && !request.getFullRefund()) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.CANCEL, "Request Validation Error", "In refundPayment: RefundPaymentRequest Amount must be greater than zero when FullRefund is set to false. " + request, CloverConnector.TxTypeRequestInfo.REFUND_REQUEST);
        }
        else {
            this.device.doPaymentRefund(request.getOrderId(), request.getPaymentId(), request.getAmount(), request.getFullRefund());
        }
    };
    CloverConnector.prototype.manualRefund = function (request) {
        var transactionSettings = new sdk.payments.TransactionSettings();
        this.lastRequest = request;
        if (!this.device || !this.isReady) {
            this.deviceObserver.onFinishCancelManualRefund(sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In manualRefund: ManualRefundRequest - The Clover device is not connected.");
        }
        else if (!this.merchantInfo.getSupportsVaultCards()) {
            this.deviceObserver.onFinishCancelManualRefund(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In manualRefund: ManualRefundRequest - Manual Refunds are not enabled for the payment gateway. Original Request = " + request);
        }
        else if (request == null) {
            this.deviceObserver.onFinishCancelManualRefund(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In manualRefund: ManualRefundRequest - The request that was passed in for processing is null.");
        }
        else if (request.getAmount() == null || request.getAmount() <= 0) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Request Validation Error", "In manualRefund: ManualRefundRequest - The request amount cannot be zero. Original Request = " + request, CloverConnector.TxTypeRequestInfo.CREDIT_REQUEST);
        }
        else if (request.getExternalId() == null || request.getExternalId().trim().length == 0 || request.getExternalId().trim().length > 32) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In manualRefund: ManualRefundRequest - The externalId is invalid. It is required and the max length is 32. Original Request = " + request, CloverConnector.TxTypeRequestInfo.CREDIT_REQUEST);
        }
        else if (request.getVaultedCard() && !this.merchantInfo.getSupportsVaultCards()) {
            this.deviceObserver.onFinishCancel_rmm(sdk.remotepay.ResponseCode.UNSUPPORTED, "Merchant Configuration Validation Error", "In manualRefund: ManualRefundRequest - Vault Card support is not enabled for the payment gateway. Original Request = " + request, CloverConnector.TxTypeRequestInfo.CREDIT_REQUEST);
        }
        else {
            var builder = new Builder_1.PayIntent.Builder();
            builder.setAmount(-Math.abs(request.getAmount()))
                .setTransactionType(sdk.remotepay.TransactionType.CREDIT)
                .setVaultedCard(request.getVaultedCard())
                .setExternalPaymentId(request.getExternalId());
            transactionSettings.setCardEntryMethods(request.getCardEntryMethods() ? request.getCardEntryMethods() : this.cardEntryMethods);
            if (request.getDisablePrinting()) {
                transactionSettings.setCloverShouldHandleReceipts(request.getDisablePrinting());
            }
            if (request.getDisableRestartTransactionOnFail()) {
                transactionSettings.setDisableRestartTransactionOnFailure(request.getDisableRestartTransactionOnFail());
            }
            if (request.getSignatureEntryLocation()) {
                transactionSettings.setSignatureEntryLocation(request.getSignatureEntryLocation());
            }
            if (request.getSignatureThreshold()) {
                transactionSettings.setSignatureThreshold(request.getSignatureThreshold());
            }
            if (request.getDisableReceiptSelection()) {
                transactionSettings.setDisableReceiptSelection(request.getDisableReceiptSelection());
            }
            builder.setTransactionSettings(transactionSettings);
            var payIntent = builder.build();
            this.device.doTxStart(payIntent, null, CloverConnector.TxTypeRequestInfo.CREDIT_REQUEST);
        }
    };
    CloverConnector.prototype.retrievePendingPayments = function () {
        if (!this.device || !this.isReady) {
            this.deviceObserver.onPendingPaymentsResponse(false, null, "Device connection Error", "In retrievePendingPayments: The Clover device is not connected.");
        }
        else {
            this.device.doRetrievePendingPayments();
        }
    };
    CloverConnector.prototype.readCardData = function (request) {
        if (!this.device || !this.isReady) {
            this.deviceObserver.onReadCardDataResponse(sdk.remotepay.ResponseCode.ERROR, "Device connection Error", "In readCardData: The Clover device is not connected.");
        }
        else if (request == null) {
            this.deviceObserver.onReadCardDataResponse(sdk.remotepay.ResponseCode.FAIL, "Invalid Argument.", "In readCardData: ReadCardDataRequest - The request that was passed in for processing is null.");
        }
        else {
            // create pay intent...
            var builder = new Builder_1.PayIntent.Builder();
            builder.setTransactionType(sdk.remotepay.TransactionType.DATA);
            builder.setCardEntryMethods(request.getCardEntryMethods() ? request.getCardEntryMethods() : this.cardEntryMethods);
            builder.setForceSwipePinEntry(request.getIsForceSwipePinEntry());
            var pi = builder.build();
            this.device.doReadCardData(pi);
        }
    };
    CloverConnector.prototype.sendMessageToActivity = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In sendMessageToActivity");
        }
        else if (request == null) {
            this.notifyInvalidData("In sendMessageToActivity: Invalid argument. Null is not allowed.");
        }
        else {
            this.device.doSendMessageToActivity(request.getAction(), request.getPayload());
        }
    };
    CloverConnector.prototype.retrievePayment = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In retrievePayment");
        }
        else if (request == null) {
            this.notifyInvalidData("In retrievePayment: Invalid argument. Null is not allowed.");
        }
        else if (!request.getExternalPaymentId()) {
            this.notifyInvalidData("In retrievePayment: RetrievePaymentRequest - The externalPaymentId is null.  It must be set.");
        }
        else {
            this.device.doRetrievePayment(request.getExternalPaymentId());
        }
    };
    CloverConnector.prototype.retrievePrinters = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In retrievePrinters");
        }
        else if (!request) {
            this.notifyInvalidData("In retrievePrinters: Invalid argument. Null is not allowed.");
        }
        else {
            this.device.doRetrievePrinters(request.getCategory());
        }
    };
    CloverConnector.prototype.retrievePrintJobStatus = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In retrievePrintJobStatus");
        }
        else if (!request || !request.getPrintRequestId()) {
            this.notifyInvalidData("In retrievePrintJobStatus: Invalid argument. Null is not allowed.");
        }
        else {
            this.device.doRetrievePrintJobStatus(request.getPrintRequestId());
        }
    };
    CloverConnector.prototype.closeout = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In closeout");
        }
        else {
            this.device.doCloseout(request.getAllowOpenTabs(), request.getBatchId());
        }
    };
    CloverConnector.prototype.cancel = function () {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In cancel");
        }
        else {
            this.invokeInputOption(CloverConnector.CANCEL_INPUT_OPTION);
        }
    };
    CloverConnector.prototype.printText = function (messages) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In printText");
        }
        else if (messages == null) {
            this.notifyInvalidData("In printText: Invalid argument. Null is not allowed.");
        }
        else {
            this.device.doPrintText(messages);
        }
    };
    CloverConnector.prototype.printImage = function (bitmap) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In printImage");
        }
        else if (bitmap == null) {
            this.notifyInvalidData("In printImage: Invalid argument.  Null is not allowed.");
        }
        else {
            this.device.doPrintImageObject(bitmap);
        }
    };
    CloverConnector.prototype.printImageFromURL = function (url) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In printImageFromURL");
        }
        else if (url == null) {
            this.notifyInvalidData("In printImageFromURL: Invalid argument.  Null is not allowed.");
        }
        else {
            this.device.doPrintImageUrl(url);
        }
    };
    CloverConnector.prototype.print = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In print");
        }
        else if (!request) {
            this.notifyInvalidData("In print: Invalid argument. Null is not allowed.");
        }
        else if (!this.validatePrintRequest(request)) {
            return;
        }
        else {
            if (request.getImage()) {
                if (Array.isArray(request.getImage()) && request.getImage().length > 1) {
                    this.notifyInvalidData("In print: Invalid argument. Only one image can be printed at a time in the current API.");
                }
                var singleOrArr = (Array.isArray(request.getImage()) ? request.getImage()[0] : request.getImage());
                this.device.doPrintImageObject(singleOrArr, request.getPrintRequestId(), request.getPrintDeviceId());
            }
            else if (request.getText()) {
                this.device.doPrintText(request.getText(), request.getPrintRequestId(), request.getPrintDeviceId());
            }
            else if (request.getImageUrl()) {
                if (Array.isArray(request.getImageUrl()) && request.getImageUrl().length > 1) {
                    this.notifyInvalidData("In print: Invalid argument. Only one imageUrl can be printed at a time in the current API.");
                }
                var singleOrArr = (Array.isArray(request.getImageUrl()) ? request.getImageUrl()[0] : request.getImageUrl());
                this.device.doPrintImageUrl(singleOrArr, request.getPrintRequestId(), request.getPrintDeviceId());
            }
            else {
                this.notifyInvalidData("In print: Invalid argument. PrintRequest element was not formatted correctly.");
            }
        }
    };
    CloverConnector.prototype.validatePrintRequest = function (request) {
        if (!request.getImage() && !request.getText() && !request.getImageUrl()) {
            this.notifyInvalidData("In validatePrintRequest: There are no items to print.");
            return false;
        }
        else if ((request.getImage() && request.getText()) ||
            (request.getImage() && request.getImageUrl()) ||
            (request.getText() && request.getImageUrl())) {
            this.notifyInvalidData("In validatePrintRequest: There are too may different kinds of items to print.  Can only have one.");
            return false;
        }
        else {
            return true;
        }
    };
    CloverConnector.prototype.showMessage = function (message) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In showMessage");
        }
        else if (message == null) {
            this.notifyInvalidData("In showMessage: Invalid argument.  Null is not allowed.");
        }
        else {
            this.device.doTerminalMessage(message);
        }
    };
    CloverConnector.prototype.showWelcomeScreen = function () {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In showWelcomeScreen");
        }
        else {
            this.device.doShowWelcomeScreen();
        }
    };
    CloverConnector.prototype.showThankYouScreen = function () {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In showThankYouScreen");
        }
        else {
            this.device.doShowThankYouScreen();
        }
    };
    /**
     * Incompatibility between sdks!  Old cloud had this.
     *
     * @deprecated
     *
     * @param orderId
     * @param paymentId
     */
    CloverConnector.prototype.showPaymentReceiptOptions = function (orderId, paymentId) {
        this.displayPaymentReceiptOptions(orderId, paymentId);
    };
    CloverConnector.prototype.displayPaymentReceiptOptions = function (orderId, paymentId) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In displayPaymentReceiptOptions");
        }
        else if (orderId == null) {
            this.notifyInvalidData("In displayPaymentReceiptOptions: Invalid argument.  The orderId cannot be null.");
        }
        else if (paymentId == null) {
            this.notifyInvalidData("In displayPaymentReceiptOptions: Invalid argument.  The paymentId cannot be null.");
        }
        else {
            this.device.doShowPaymentReceiptScreen(orderId, paymentId);
        }
    };
    CloverConnector.prototype.openCashDrawer = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In openCashDrawer");
        }
        else if (!request) {
            this.notifyInvalidData("In openCashDrawer: Invalid argument. The request cannot be null.");
        }
        else if (typeof request === "string") {
            this.device.doOpenCashDrawer(request);
        }
        else {
            this.device.doOpenCashDrawer(request.getReason(), request.getDeviceId());
        }
    };
    CloverConnector.prototype.showDisplayOrder = function (order) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In showDisplayOrder");
        }
        else if (order == null) {
            this.notifyInvalidData("In showDisplayOrder: Invalid argument.  The order cannot be null.");
        }
        else {
            this.device.doOrderUpdate(order, null);
        }
    };
    CloverConnector.prototype.removeDisplayOrder = function (order) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In removeDisplayOrder");
        }
        else if (order == null) {
            this.notifyInvalidData("In removeDisplayOrder: Invalid argument.  The order cannot be null.");
        }
        else {
            var dao = new sdk.order.operation.OrderDeletedOperation();
            dao.setId(order.getId());
            this.device.doOrderUpdate(order, dao);
        }
    };
    // I spoke to Hammer about this, there are no plans to implement it.
    CloverConnector.prototype.discountAddedToDisplayOrder = function (discount, order) {
        this.notifyDeviceError(sdk.remotepay.ErrorType.EXCEPTION, sdk.remotepay.DeviceErrorEventCode.NotSupported, null, "discountAddedToDisplayOrder has not been implemented.");
    };
    // I spoke to Hammer about this, there are no plans to implement it.
    CloverConnector.prototype.discountRemovedFromDisplayOrder = function (discount, order) {
        this.notifyDeviceError(sdk.remotepay.ErrorType.EXCEPTION, sdk.remotepay.DeviceErrorEventCode.NotSupported, null, "discountRemovedFromDisplayOrder has not been implemented.");
    };
    // I spoke to Hammer about this, there are no plans to implement it.
    CloverConnector.prototype.lineItemAddedToDisplayOrder = function (lineItem, order) {
        this.notifyDeviceError(sdk.remotepay.ErrorType.EXCEPTION, sdk.remotepay.DeviceErrorEventCode.NotSupported, null, "lineItemAddedToDisplayOrder has not been implemented.");
    };
    // I spoke to Hammer about this, there are no plans to implement it.
    CloverConnector.prototype.lineItemRemovedFromDisplayOrder = function (lineItem, order) {
        this.notifyDeviceError(sdk.remotepay.ErrorType.EXCEPTION, sdk.remotepay.DeviceErrorEventCode.NotSupported, null, "lineItemRemovedFromDisplayOrder has not been implemented.");
    };
    CloverConnector.prototype.dispose = function () {
        this.broadcaster.clear();
        if (this.device) {
            this.device.dispose();
        }
    };
    CloverConnector.prototype.invokeInputOption = function (io) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In invokeInputOption");
        }
        else {
            this.device.doKeyPress(io.getKeyPress());
        }
    };
    CloverConnector.prototype.resetDevice = function () {
        this.lastRequest = null;
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In resetDevice");
        }
        else {
            this.device.doResetDevice();
        }
    };
    CloverConnector.prototype.retrieveDeviceStatus = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In retrieveDeviceStatus");
        }
        else {
            this.device.doRetrieveDeviceStatus(request);
        }
    };
    CloverConnector.prototype.getCardEntryMethods = function () {
        return this.cardEntryMethods;
    };
    CloverConnector.prototype.startCustomActivity = function (request) {
        if (!this.device || !this.isReady) {
            this.notifyDeviceNotConnected("In invokeInputOption");
        }
        else {
            this.device.doStartActivity(request.getAction(), request.getPayload(), request.getNonBlocking());
        }
    };
    CloverConnector.populateBaseResponse = function (response, success, result, reason, message) {
        response.setSuccess(success);
        response.setResult(result);
        response.setReason(reason);
        response.setMessage(message);
    };
    CloverConnector.populatePaymentResponse = function (response, success, result, payment, signature, reason, message) {
        CloverConnector.populateBaseResponse(response, success, result, reason, message);
        response.setPayment(payment);
        response.setSignature(signature);
        var cardTransaction = payment.getCardTransaction();
        if (cardTransaction) {
            var transactionType = cardTransaction.getType();
            response.setIsSale(sdk.payments.CardTransactionType.AUTH == transactionType &&
                sdk.payments.Result.SUCCESS == payment.getResult());
            response.setIsAuth(sdk.payments.CardTransactionType.PREAUTH == transactionType &&
                sdk.payments.Result.SUCCESS == payment.getResult());
            response.setIsPreAuth(sdk.payments.CardTransactionType.PREAUTH == transactionType &&
                sdk.payments.Result.AUTH == payment.getResult());
        }
    };
    CloverConnector.MAX_PAYLOAD_SIZE = 10000000; // maximum size of the payload of a full message.  if the payload exceeds this, the message will not be sent.
    return CloverConnector;
}());
exports.CloverConnector = CloverConnector;
(function (CloverConnector) {
    var TxTypeRequestInfo = (function () {
        function TxTypeRequestInfo() {
        }
        TxTypeRequestInfo.SALE_REQUEST = "SALE";
        TxTypeRequestInfo.AUTH_REQUEST = "AUTH";
        TxTypeRequestInfo.PREAUTH_REQUEST = "PREAUTH";
        TxTypeRequestInfo.CREDIT_REQUEST = "CREDIT";
        TxTypeRequestInfo.REFUND_REQUEST = "REFUND";
        return TxTypeRequestInfo;
    }());
    CloverConnector.TxTypeRequestInfo = TxTypeRequestInfo;
    var InnerDeviceObserver = (function () {
        function InnerDeviceObserver(cc) {
            // Create a logger
            this.logger = Logger_1.Logger.create();
            this.cloverConnector = cc;
        }
        InnerDeviceObserver.prototype.onTxState = function (txState) {
        };
        InnerDeviceObserver.prototype.getMessageTypeFromLastRequest = function (lastRequest) {
            if (lastRequest instanceof sdk.remotepay.PreAuthRequest) {
                return TxTypeRequestInfo.PREAUTH_REQUEST;
            }
            else if (lastRequest instanceof sdk.remotepay.AuthRequest) {
                return TxTypeRequestInfo.AUTH_REQUEST;
            }
            else if (lastRequest instanceof sdk.remotepay.SaleRequest) {
                return TxTypeRequestInfo.SALE_REQUEST;
            }
            else if (lastRequest instanceof sdk.remotepay.ManualRefundRequest) {
                return TxTypeRequestInfo.CREDIT_REQUEST;
            }
            return null;
        };
        InnerDeviceObserver.prototype.onTxStartResponse = function (result, externalId, requestInfo) {
            if (result == sdk.remotemessage.TxStartResponseResult.SUCCESS)
                return;
            var duplicate = (result == sdk.remotemessage.TxStartResponseResult.DUPLICATE);
            var code = duplicate ? sdk.remotepay.ResponseCode.CANCEL : sdk.remotepay.ResponseCode.FAIL;
            var message = duplicate ? "The provided transaction id of " + externalId + " has already been processed and cannot be resubmitted." : null;
            try {
                // The old (deprecated) way to get the type.  Here for backwards compatibility
                if (requestInfo == null) {
                    requestInfo = this.getMessageTypeFromLastRequest(this.cloverConnector.lastRequest);
                }
                // Use the requestInfo if it exists, to determine the request type
                if (requestInfo == TxTypeRequestInfo.PREAUTH_REQUEST) {
                    var response = new sdk.remotepay.PreAuthResponse();
                    CloverConnector.populateBaseResponse(response, false, code, result, message);
                    this.cloverConnector.broadcaster.notifyOnPreAuthResponse(response);
                }
                else if (requestInfo == TxTypeRequestInfo.AUTH_REQUEST) {
                    var response = new sdk.remotepay.AuthResponse();
                    CloverConnector.populateBaseResponse(response, false, code, result, message);
                    this.cloverConnector.broadcaster.notifyOnAuthResponse(response);
                }
                else if (requestInfo == TxTypeRequestInfo.SALE_REQUEST) {
                    var response = new sdk.remotepay.SaleResponse();
                    CloverConnector.populateBaseResponse(response, false, code, result, message);
                    this.cloverConnector.broadcaster.notifyOnSaleResponse(response);
                }
                else if (requestInfo == TxTypeRequestInfo.CREDIT_REQUEST) {
                    var response = new sdk.remotepay.ManualRefundResponse();
                    CloverConnector.populateBaseResponse(response, false, code, result, message);
                    this.cloverConnector.broadcaster.notifyOnManualRefundResponse(response);
                }
                else {
                    this.logger.error("Could not determine request type. requestInfo = " + requestInfo + " lastRequest = " + this.cloverConnector.lastRequest);
                }
            }
            finally {
                this.cloverConnector.lastRequest = null;
            }
        };
        InnerDeviceObserver.prototype.onUiState = function (uiState, uiText, uiDirection, inputOptions) {
            var deviceEvent = new sdk.remotepay.CloverDeviceEvent();
            deviceEvent.setInputOptions(inputOptions);
            deviceEvent.setEventState(sdk.remotepay.DeviceEventState[uiState.toString()]);
            deviceEvent.setMessage(uiText);
            if (uiDirection == sdk.remotemessage.UiDirection.ENTER) {
                this.cloverConnector.broadcaster.notifyOnDeviceActivityStart(deviceEvent);
            }
            else if (uiDirection == sdk.remotemessage.UiDirection.EXIT) {
                this.cloverConnector.broadcaster.notifyOnDeviceActivityEnd(deviceEvent);
                if (uiState.toString() == sdk.remotepay.DeviceEventState.RECEIPT_OPTIONS.toString()) {
                    this.cloverConnector.device.doShowWelcomeScreen();
                }
            }
        };
        InnerDeviceObserver.prototype.onTipAdded = function (tip) {
            this.cloverConnector.broadcaster.notifyOnTipAdded(tip);
        };
        // Weird mechanism to overload via TypeScript - https://blog.mariusschulz.com/2016/08/18/function-overloads-in-typescript
        InnerDeviceObserver.prototype.onAuthTipAdjusted = function (resultStatusOrPaymentId, reasonOrTipAmount, messageOrSuccess) {
            if (typeof resultStatusOrPaymentId == 'string') {
                if (messageOrSuccess) {
                    this.onAuthTipAdjustedHandler(resultStatusOrPaymentId, reasonOrTipAmount, messageOrSuccess, sdk.remotepay.ResponseCode.SUCCESS, null, null);
                }
                else {
                    this.onAuthTipAdjustedHandler(resultStatusOrPaymentId, reasonOrTipAmount, messageOrSuccess, sdk.remotepay.ResponseCode.FAIL, 'Failure', 'TipAdjustAuth failed to process for payment ID: ' + resultStatusOrPaymentId);
                }
            }
            else {
                this.onAuthTipAdjustedHandler(null, 0, false, resultStatusOrPaymentId, reasonOrTipAmount, messageOrSuccess);
            }
        };
        InnerDeviceObserver.prototype.onAuthTipAdjustedHandler = function (paymentId, tipAmount, success, result, reason, message) {
            var response = new sdk.remotepay.TipAdjustAuthResponse();
            response.setPaymentId(paymentId);
            response.setTipAmount(tipAmount);
            CloverConnector.populateBaseResponse(response, success, result, reason, message);
            this.cloverConnector.broadcaster.notifyOnTipAdjustAuthResponse(response);
        };
        InnerDeviceObserver.prototype.onCashbackSelected = function (cashbackAmount) {
            //TODO: For future use
        };
        InnerDeviceObserver.prototype.onPartialAuth = function (partialAmount) {
            //TODO: For future use
        };
        InnerDeviceObserver.prototype.onFinishOkPayment = function (payment, signature, requestInfo) {
            try {
                this.cloverConnector.device.doShowThankYouScreen(); //need to do this first, so Listener implementation can replace the screen as desired
                var lastRequest = this.cloverConnector.lastRequest;
                this.cloverConnector.lastRequest = null;
                if (!requestInfo) {
                    // This is deprecated logic and should be removed at some point in the future
                    // when we are comfortable that there are no longer any backward compatibility issues
                    requestInfo = this.getMessageTypeFromLastRequest(lastRequest);
                }
                if (requestInfo == TxTypeRequestInfo.PREAUTH_REQUEST) {
                    var response = new sdk.remotepay.PreAuthResponse();
                    CloverConnector.populatePaymentResponse(response, true, sdk.remotepay.ResponseCode.SUCCESS, payment, signature);
                    this.cloverConnector.broadcaster.notifyOnPreAuthResponse(response);
                    this.cloverConnector.lastRequest = null;
                }
                else if (requestInfo == TxTypeRequestInfo.AUTH_REQUEST) {
                    var response = new sdk.remotepay.AuthResponse();
                    CloverConnector.populatePaymentResponse(response, true, sdk.remotepay.ResponseCode.SUCCESS, payment, signature);
                    this.cloverConnector.broadcaster.notifyOnAuthResponse(response);
                    this.cloverConnector.lastRequest = null;
                }
                else if (requestInfo == TxTypeRequestInfo.SALE_REQUEST) {
                    var response = new sdk.remotepay.SaleResponse();
                    CloverConnector.populatePaymentResponse(response, true, sdk.remotepay.ResponseCode.SUCCESS, payment, signature);
                    this.cloverConnector.broadcaster.notifyOnSaleResponse(response);
                    this.cloverConnector.lastRequest = null;
                }
                else {
                    this.logger.error("Failed to pair this response: " + payment);
                }
            }
            finally {
                // do nothing for now...
            }
        };
        InnerDeviceObserver.prototype.onFinishOkCredit = function (credit) {
            try {
                this.cloverConnector.device.doShowWelcomeScreen();
                this.cloverConnector.lastRequest = null;
                var response = new sdk.remotepay.ManualRefundResponse();
                CloverConnector.populateBaseResponse(response, true, sdk.remotepay.ResponseCode.SUCCESS);
                response.setCredit(credit);
                this.cloverConnector.broadcaster.notifyOnManualRefundResponse(response);
            }
            finally {
            }
        };
        InnerDeviceObserver.prototype.onFinishOkRefund = function (refund) {
            try {
                this.cloverConnector.device.doShowWelcomeScreen();
                this.cloverConnector.lastRequest = null;
                // NOTE: these two lines can eventually be removed (once refunds have the orderRef populated correctly):
                var lastRefundResponse = this.lastPRR; //only needed for the order ID
                this.lastPRR = null;
                if (refund.getOrderRef() != null) {
                    var success = true;
                    var response = new sdk.remotepay.RefundPaymentResponse();
                    CloverConnector.populateBaseResponse(response, success, success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.FAIL);
                    response.setOrderId(refund.getOrderRef().getId());
                    if (refund.getPayment()) {
                        response.setPaymentId(refund.getPayment().getId());
                    }
                    response.setRefund(refund);
                    this.cloverConnector.broadcaster.notifyOnRefundPaymentResponse(response);
                }
                else {
                    if (lastRefundResponse && lastRefundResponse.getRefund().getId() == refund.getId()) {
                        this.cloverConnector.broadcaster.notifyOnRefundPaymentResponse(lastRefundResponse);
                    }
                    else {
                        var success = true;
                        var response = new sdk.remotepay.RefundPaymentResponse();
                        CloverConnector.populateBaseResponse(response, success, success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.FAIL);
                        if (refund.getPayment()) {
                            response.setPaymentId(refund.getPayment().getId());
                        }
                        response.setRefund(refund);
                        this.cloverConnector.broadcaster.notifyOnRefundPaymentResponse(response);
                    }
                }
            }
            finally {
            }
        };
        // Weird mechanism to overload via TypeScript - https://blog.mariusschulz.com/2016/08/18/function-overloads-in-typescript
        InnerDeviceObserver.prototype.onFinishOk = function (paymentCreditOrRefund, signature, requestInfo) {
            if (paymentCreditOrRefund instanceof sdk.payments.Payment /* && signature */) {
                this.onFinishOkPayment(paymentCreditOrRefund, signature, requestInfo);
            }
            else if (paymentCreditOrRefund instanceof sdk.payments.Credit) {
                this.onFinishOkCredit(paymentCreditOrRefund);
            }
            else {
                this.onFinishOkRefund(paymentCreditOrRefund);
            }
        };
        InnerDeviceObserver.prototype.onFinishCancel_rmm = function (result, reason, message, requestInfo) {
            try {
                if (this.cloverConnector.device) {
                    this.cloverConnector.device.doShowWelcomeScreen();
                }
                var lastReq = this.cloverConnector.lastRequest;
                this.cloverConnector.lastRequest = null;
                if (!requestInfo) {
                    // Backwards compatibility, attempt to get the message type from the last request.
                    requestInfo = this.getMessageTypeFromLastRequest(lastReq);
                }
                if (requestInfo == TxTypeRequestInfo.PREAUTH_REQUEST) {
                    this.onFinishCancelPreAuth(result, reason, message);
                }
                else if (requestInfo == TxTypeRequestInfo.SALE_REQUEST) {
                    this.onFinishCancelSale(result, reason, message);
                }
                else if (requestInfo == TxTypeRequestInfo.AUTH_REQUEST) {
                    this.onFinishCancelAuth(result, reason, message);
                }
                else if (requestInfo == TxTypeRequestInfo.CREDIT_REQUEST) {
                    this.onFinishCancelManualRefund(result, reason, message);
                }
                else if (requestInfo == TxTypeRequestInfo.REFUND_REQUEST) {
                    this.onFinishCancelRefund(result, reason, message);
                }
                else {
                    // Complete any un-resolved payment refund requests.
                    if (this.lastPRR) {
                        this.cloverConnector.broadcaster.notifyOnRefundPaymentResponse(this.lastPRR);
                        this.lastPRR = null;
                    }
                    else {
                        if (!requestInfo) {
                            this.logger.error('onFinishCancel called, requestInfo was null, and ' +
                                'could not determine the type of the message from the last request', arguments);
                        }
                        else {
                            this.logger.error('onFinishCancel called, but could not determine how to respond!', arguments);
                        }
                    }
                }
            }
            finally {
                // do nothing
            }
        };
        InnerDeviceObserver.prototype.onFinishCancel = function (requestInfo) {
            this.onFinishCancel_rmm(sdk.remotepay.ResponseCode.CANCEL, null, null, requestInfo);
        };
        InnerDeviceObserver.prototype.onFinishCancelPreAuth = function (result, reason, message) {
            var response = new sdk.remotepay.PreAuthResponse();
            CloverConnector.populateBaseResponse(response, false, result, reason ? reason : "Request Canceled", message ? message : "The PreAuth Request was canceled.");
            this.cloverConnector.broadcaster.notifyOnPreAuthResponse(response);
        };
        InnerDeviceObserver.prototype.onFinishCancelSale = function (result, reason, message) {
            var response = new sdk.remotepay.SaleResponse();
            CloverConnector.populateBaseResponse(response, false, result, reason ? reason : "Request Canceled", message ? message : "The Sale Request was canceled.");
            this.cloverConnector.broadcaster.notifyOnSaleResponse(response);
        };
        InnerDeviceObserver.prototype.onFinishCancelAuth = function (result, reason, message) {
            var response = new sdk.remotepay.AuthResponse();
            CloverConnector.populateBaseResponse(response, false, result, reason ? reason : "Request Canceled", message ? message : "The Auth Request was canceled.");
            this.cloverConnector.broadcaster.notifyOnAuthResponse(response);
        };
        InnerDeviceObserver.prototype.onFinishCancelManualRefund = function (result, reason, message) {
            var response = new sdk.remotepay.ManualRefundResponse();
            CloverConnector.populateBaseResponse(response, false, result, reason ? reason : "Request Canceled", message ? message : "The Manual Refund Request was canceled.");
            this.cloverConnector.broadcaster.notifyOnManualRefundResponse(response);
        };
        InnerDeviceObserver.prototype.onFinishCancelRefund = function (result, reason, message) {
            var response = new sdk.remotepay.RefundPaymentResponse();
            CloverConnector.populateBaseResponse(response, false, result, reason ? reason : "Request Canceled", message ? message : "The Refund Request was canceled.");
            this.cloverConnector.broadcaster.notifyOnRefundPaymentResponse(response);
        };
        InnerDeviceObserver.prototype.onVerifySignature = function (payment, signature) {
            var request = new InnerDeviceObserver.SVR(this.cloverConnector.device);
            request.setSignature(signature);
            request.setPayment(payment);
            this.cloverConnector.broadcaster.notifyOnVerifySignatureRequest(request);
        };
        InnerDeviceObserver.prototype.onConfirmPayment = function (payment, challenges) {
            var cpr = new sdk.remotepay.ConfirmPaymentRequest();
            cpr.setPayment(payment);
            cpr.setChallenges(challenges);
            this.cloverConnector.broadcaster.notifyOnConfirmPaymentRequest(cpr);
        };
        InnerDeviceObserver.prototype.onPaymentVoided = function (payment, voidReason, resultStatus, reason, message) {
            var success = (resultStatus == sdk.remotemessage.ResultStatus.SUCCESS);
            var result = (success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.FAIL);
            reason = reason != null ? reason : result.toString();
            message = message ? message : "No extended information provided.";
            var response = new sdk.remotepay.VoidPaymentResponse();
            response.setPaymentId(payment != null ? payment.getId() : null);
            CloverConnector.populateBaseResponse(response, success, result, reason, message);
            this.cloverConnector.broadcaster.notifyOnVoidPaymentResponse(response);
        };
        InnerDeviceObserver.prototype.onPaymentVoided_responseCode = function (code, reason, message) {
            var success = (code == sdk.remotepay.ResponseCode.SUCCESS);
            reason = reason ? reason : code.toString();
            message = message ? message : "No extended information provided.";
            var response = new sdk.remotepay.VoidPaymentResponse();
            CloverConnector.populateBaseResponse(response, success, code, reason, message);
            this.cloverConnector.broadcaster.notifyOnVoidPaymentResponse(response);
        };
        InnerDeviceObserver.prototype.onKeyPressed = function (keyPress) {
            //TODO: For future use
        };
        InnerDeviceObserver.prototype.onPaymentRefundResponse = function (orderId, paymentId, refund, code, reason, message) {
            // hold the response for finishOk for the refund. See comments in onFinishOk(Refund)
            var success = (code == sdk.remotemessage.TxState.SUCCESS);
            var response = new sdk.remotepay.RefundPaymentResponse();
            CloverConnector.populateBaseResponse(response, success, success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.FAIL);
            response.setOrderId(orderId);
            response.setPaymentId(paymentId);
            response.setRefund(refund);
            if (reason !== undefined) {
                response.setReason(reason.toString());
            }
            response.setMessage(message);
            //NOTE: While this is currently needed, we are attempting to move away from this requirement
            this.lastPRR = response; // set this so we have the appropriate information for when onFinish(Refund) is called
        };
        InnerDeviceObserver.prototype.onVaultCardResponse = function (vaultedCard, code, reason) {
            var success = (code == sdk.remotepay.ResponseCode.SUCCESS);
            this.onVaultCardResponseInternal(success, success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.FAIL, null, null, vaultedCard);
        };
        InnerDeviceObserver.prototype.onVaultCardResponseInternal = function (success, code, reason, message, vaultedCard) {
            this.cloverConnector.device.doShowWelcomeScreen();
            var response = new sdk.remotepay.VaultCardResponse();
            response.setCard(vaultedCard);
            CloverConnector.populateBaseResponse(response, success, code, reason, message);
            this.cloverConnector.broadcaster.notifyOnVaultCardRespose(response);
        };
        InnerDeviceObserver.prototype.onCapturePreAuth = function (statusOrCode, reason, paymentId, amount, tipAmount) {
            var success = (sdk.remotemessage.ResultStatus.SUCCESS == statusOrCode);
            var response = new sdk.remotepay.CapturePreAuthResponse();
            CloverConnector.populateBaseResponse(response, success, statusOrCode, reason);
            response.setPaymentId(paymentId);
            response.setAmount(amount);
            response.setTipAmount(tipAmount);
            this.cloverConnector.broadcaster.notifyOnCapturePreAuth(response);
        };
        InnerDeviceObserver.prototype.onCloseoutResponse = function (status, reason, batch) {
            var success = (status == sdk.remotemessage.ResultStatus.SUCCESS);
            var result = (status == sdk.remotemessage.ResultStatus.SUCCESS ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.FAIL); //type is irrelevant, but we changed it for clarity sake
            var response = new sdk.remotepay.CloseoutResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason, null);
            response.setBatch(batch);
            this.cloverConnector.broadcaster.notifyCloseout(response);
        };
        InnerDeviceObserver.prototype.onCloseoutResponseHandler = function (batch, result, reason, message) {
            var success = (result == sdk.remotepay.ResponseCode.SUCCESS);
            var response = new sdk.remotepay.CloseoutResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason, message);
            response.setBatch(batch);
            this.cloverConnector.broadcaster.notifyCloseout(response);
        };
        InnerDeviceObserver.prototype.onDeviceDisconnected = function (device, message) {
            this.logger.debug('Disconnected ', message);
            this.cloverConnector.isReady = false;
            this.cloverConnector.broadcaster.notifyOnDisconnect(message);
        };
        InnerDeviceObserver.prototype.onDeviceConnected = function () {
            this.logger.debug('Connected');
            this.cloverConnector.isReady = false;
            this.cloverConnector.broadcaster.notifyOnConnect();
        };
        InnerDeviceObserver.prototype.onDeviceReady = function (device, drm) {
            this.logger.debug('Ready');
            this.cloverConnector.isReady = drm.getReady();
            // Build merchant info from the discoveryrequest
            var merchantInfo = new sdk.remotepay.MerchantInfo();
            merchantInfo.setMerchantID(drm.getMerchantId());
            merchantInfo.setMerchantMID(drm.getMerchantMId());
            merchantInfo.setMerchantName(drm.getMerchantName());
            var deviceInfo = new sdk.remotepay.DeviceInfo();
            merchantInfo.setDeviceInfo(deviceInfo);
            deviceInfo.setName(drm.getName());
            deviceInfo.setModel(drm.getModel());
            deviceInfo.setSerial(drm.getSerial());
            deviceInfo.setSupportsAcks(drm.getSupportsAcknowledgement());
            merchantInfo.setSupportsPreAuths(drm.getSupportsTipAdjust());
            merchantInfo.setSupportsManualRefunds(drm.getSupportsManualRefund());
            merchantInfo.setSupportsTipAdjust(drm.getSupportsTipAdjust());
            merchantInfo.setSupportsAuths(drm.getSupportsTipAdjust());
            merchantInfo.setSupportsVaultCards(drm.getSupportsManualRefund());
            this.cloverConnector.merchantInfo = merchantInfo;
            this.cloverConnector.device.setSupportsAcks(merchantInfo.getDeviceInfo().getSupportsAcks());
            if (drm.getReady()) {
                this.cloverConnector.broadcaster.notifyOnReady(merchantInfo);
            }
            else {
                this.cloverConnector.broadcaster.notifyOnConnect();
            }
        };
        InnerDeviceObserver.prototype.onDeviceError = function (errorEvent) {
            this.cloverConnector.broadcaster.notifyOnDeviceError(errorEvent);
        };
        // TODO: The Print Message objects are missing from the api
        InnerDeviceObserver.prototype.onPrintRefundPayment = function (payment, order, refund) {
            // this.cloverConnector.broadcaster.notifyOnPrintRefundPaymentReceipt(new PrintRefundPaymentReceiptMessage(payment, order, refund));
        };
        InnerDeviceObserver.prototype.onPrintMerchantReceipt = function (payment) {
            // this.cloverConnector.broadcaster.notifyOnPrintPaymentMerchantCopyReceipt(new PrintPaymentMerchantCopyReceiptMessage(payment));
        };
        InnerDeviceObserver.prototype.onPrintPaymentDecline = function (payment, reason) {
            // this.cloverConnector.broadcaster.notifyOnPrintPaymentDeclineReceipt(new PrintPaymentDeclineReceiptMessage(payment, reason));
        };
        InnerDeviceObserver.prototype.onPrintPayment = function (payment, order) {
            // this.cloverConnector.broadcaster.notifyOnPrintPaymentReceipt(new PrintPaymentReceiptMessage(payment, order));
        };
        InnerDeviceObserver.prototype.onPrintCredit = function (credit) {
            // this.cloverConnector.broadcaster.notifyOnPrintCreditReceipt(new PrintManualRefundReceiptMessage(credit));
        };
        InnerDeviceObserver.prototype.onPrintCreditDecline = function (credit, reason) {
            // this.cloverConnector.broadcaster.notifyOnPrintCreditDeclineReceipt(new PrintManualRefundDeclineReceiptMessage(credit, reason));
        };
        InnerDeviceObserver.prototype.onMessageAck = function (messageId) {
            // TODO: for future use
        };
        InnerDeviceObserver.prototype.onPendingPaymentsResponse = function (success, pendingPayments, reason, message) {
            var result = success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.ERROR;
            var response = new sdk.remotepay.RetrievePendingPaymentsResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason, message);
            if (pendingPayments) {
                response.setPendingPaymentEntries(pendingPayments);
            }
            else {
                this.cloverConnector.device.doShowWelcomeScreen();
            }
            this.cloverConnector.broadcaster.notifyOnRetrievePendingPaymentResponse(response);
        };
        InnerDeviceObserver.prototype.onPendingPaymentsResponseHandler = function (success, pendingPayments, result, reason, message) {
            var response = new sdk.remotepay.RetrievePendingPaymentsResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason, message);
            response.setPendingPaymentEntries(pendingPayments);
            this.cloverConnector.broadcaster.notifyOnRetrievePendingPaymentResponse(response);
        };
        InnerDeviceObserver.prototype.onReadCardResponse = function (status, reason, cardData) {
            var success = (status == sdk.remotemessage.ResultStatus.SUCCESS);
            if (success) {
                var response = new sdk.remotepay.ReadCardDataResponse();
                CloverConnector.populateBaseResponse(response, success, success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.FAIL, reason);
                response.setCardData(cardData);
                this.cloverConnector.device.doShowWelcomeScreen();
                this.cloverConnector.broadcaster.notifyOnReadCardDataResponse(response);
            }
            else if (status == sdk.remotemessage.ResultStatus.CANCEL) {
                this.onReadCardDataResponse(sdk.remotepay.ResponseCode.CANCEL, reason, '');
            }
            else {
                this.onReadCardDataResponse(sdk.remotepay.ResponseCode.FAIL, reason, '');
            }
        };
        InnerDeviceObserver.prototype.onMessageFromActivity = function (actionId, payload) {
            var message = new sdk.remotepay.MessageFromActivity();
            message.setAction(actionId);
            message.setPayload(payload);
            this.cloverConnector.broadcaster.notifyOnActivityMessage(message);
        };
        InnerDeviceObserver.prototype.onReadCardDataResponse = function (result, reason, message) {
            var success = (result == sdk.remotepay.ResponseCode.SUCCESS);
            this.cloverConnector.device.doShowWelcomeScreen();
            var response = new sdk.remotepay.ReadCardDataResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason, message);
            this.cloverConnector.broadcaster.notifyOnReadCardDataResponse(response);
        };
        InnerDeviceObserver.prototype.onActivityResponse = function (status, payload, reason, actionId) {
            var success = (status == sdk.remotemessage.ResultStatus.SUCCESS);
            var result = success ? sdk.remotepay.ResponseCode.SUCCESS : sdk.remotepay.ResponseCode.CANCEL;
            var response = new sdk.remotepay.CustomActivityResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason);
            response.setPayload(payload);
            response.setAction(actionId);
            this.cloverConnector.broadcaster.notifyOnActivityResponse(response);
        };
        InnerDeviceObserver.prototype.onDeviceStatusResponse = function (result, reason, state, data) {
            var success = (result == sdk.remotepay.ResponseCode.SUCCESS);
            var response = new sdk.remotepay.RetrieveDeviceStatusResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason);
            response.setState(state);
            response.setData(data);
            this.cloverConnector.broadcaster.notifyOnRetrieveDeviceStatusResponse(response);
        };
        InnerDeviceObserver.prototype.onResetDeviceResponse = function (result, reason, state) {
            var success = (result == sdk.remotepay.ResponseCode.SUCCESS);
            var response = new sdk.remotepay.ResetDeviceResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason);
            response.setState(state);
            this.cloverConnector.broadcaster.notifyOnResetDeviceResponse(response);
        };
        InnerDeviceObserver.prototype.onRetrievePaymentResponse = function (result, reason, externalPaymentId, queryStatus, payment) {
            var success = (result == sdk.remotepay.ResponseCode.SUCCESS);
            var response = new sdk.remotepay.RetrievePaymentResponse();
            CloverConnector.populateBaseResponse(response, success, result, reason);
            response.setExternalPaymentId(externalPaymentId);
            response.setQueryStatus(queryStatus);
            response.setPayment(payment);
            this.cloverConnector.broadcaster.notifyOnRetrievePaymentResponse(response);
        };
        InnerDeviceObserver.prototype.onRetrievePrintersResponse = function (result, printers) {
            var success = (result == sdk.remotepay.ResponseCode.SUCCESS);
            var response = new sdk.remotepay.RetrievePrintersResponse();
            CloverConnector.populateBaseResponse(response, success, result, null);
            response.setPrinters(printers);
            this.cloverConnector.broadcaster.notifyOnRetrievePrintersResponse(response);
        };
        InnerDeviceObserver.prototype.onPrintJobStatusResponse = function (result, printRequestId, printStatus) {
            var success = (result == sdk.remotepay.ResponseCode.SUCCESS);
            var response = new sdk.remotepay.PrintJobStatusResponse();
            CloverConnector.populateBaseResponse(response, success, result, printStatus);
            response.setStatus(printStatus);
            response.setPrintRequestId(printRequestId);
            this.cloverConnector.broadcaster.notifyOnPrintJobStatusResponse(response);
        };
        return InnerDeviceObserver;
    }());
    CloverConnector.InnerDeviceObserver = InnerDeviceObserver;
    (function (InnerDeviceObserver) {
        var SVR = (function (_super) {
            __extends(SVR, _super);
            function SVR(device) {
                var _this = _super.call(this) || this;
                _this.cloverDevice = device;
                return _this;
            }
            SVR.prototype.accept = function () {
                this.cloverDevice.doSignatureVerified(_super.prototype.getPayment.call(this), true);
            };
            SVR.prototype.reject = function () {
                this.cloverDevice.doSignatureVerified(_super.prototype.getPayment.call(this), false);
            };
            SVR.prototype.setSignature = function (signature) {
                _super.prototype.setSignature.call(this, signature);
            };
            SVR.prototype.setPayment = function (payment) {
                _super.prototype.setPayment.call(this, payment);
            };
            return SVR;
        }(sdk.remotepay.VerifySignatureRequest));
        InnerDeviceObserver.SVR = SVR;
    })(InnerDeviceObserver = CloverConnector.InnerDeviceObserver || (CloverConnector.InnerDeviceObserver = {}));
})(CloverConnector = exports.CloverConnector || (exports.CloverConnector = {}));
exports.CloverConnector = CloverConnector;

//# sourceMappingURL=../../../../maps/com/clover/remote/client/CloverConnector.js.map
