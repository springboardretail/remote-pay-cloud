"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sdk = require("remote-pay-cloud-api");
var Logger_1 = require("./util/Logger");
/**
 * Broadcasts events to a set of ICloverConnectorListener's
 *
 */
var CloverConnectorBroadcaster = (function () {
    function CloverConnectorBroadcaster() {
        this.logger = Logger_1.Logger.create();
        this.listeners = new Array();
    }
    CloverConnectorBroadcaster.prototype.clear = function () {
        this.listeners.splice(0, this.listeners.length);
    };
    CloverConnectorBroadcaster.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        if (items.length == 1) {
            return this.listeners.push(items[0]);
        }
        else {
            return this.listeners.push(items);
        }
    };
    CloverConnectorBroadcaster.prototype.indexOf = function (searchElement, fromIndex) {
        return this.listeners.indexOf(searchElement, fromIndex);
    };
    CloverConnectorBroadcaster.prototype.splice = function (start, deleteCount) {
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        return (items && items.length > 0) ? this.listeners.splice(start, deleteCount, items) : this.listeners.splice(start, deleteCount);
    };
    CloverConnectorBroadcaster.prototype.notifyOnTipAdded = function (tip) {
        var _this = this;
        this.logger.debug('Sending TipAdded notification to listeners');
        var tipAdded = new sdk.remotepay.TipAdded();
        tipAdded.setTipAmount(tip);
        this.listeners.forEach(function (listener) {
            try {
                listener.onTipAdded(tipAdded);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnRefundPaymentResponse = function (refundPaymentResponse) {
        var _this = this;
        this.logger.debug('Sending RefundPaymentResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onRefundPaymentResponse(refundPaymentResponse);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyCloseout = function (closeoutResponse) {
        var _this = this;
        this.logger.debug('Sending Closeout notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onCloseoutResponse(closeoutResponse);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnDeviceActivityStart = function (deviceEvent) {
        var _this = this;
        this.logger.debug('Sending DeviceActivityStart notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onDeviceActivityStart(deviceEvent);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnDeviceActivityEnd = function (deviceEvent) {
        var _this = this;
        this.logger.debug('Sending DeviceActivityEnd notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onDeviceActivityEnd(deviceEvent);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnSaleResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending SaleResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onSaleResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnAuthResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending AuthResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onAuthResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnManualRefundResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending ManualRefundResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onManualRefundResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnVerifySignatureRequest = function (request) {
        var _this = this;
        this.logger.debug('Sending VerifySignatureRequest notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onVerifySignatureRequest(request);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnVoidPaymentResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending VoidPaymentResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onVoidPaymentResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnConnect = function () {
        var _this = this;
        this.logger.debug('Sending Connect notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onDeviceConnected(); // changed the name in 1.3
                listener.onConnected(); // left here for backwards compatibility.  Deprecated in 1.3*
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnDisconnect = function (message) {
        var _this = this;
        this.logger.debug('Sending Disconnect notification to listeners', message);
        this.listeners.forEach(function (listener) {
            try {
                listener.onDeviceDisconnected(); // changed the name in 1.3
                listener.onDisconnected(); // left here for backwards compatibility.  Deprecated in 1.3*
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnReady = function (merchantInfo) {
        var _this = this;
        this.logger.debug('Sending Ready notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onDeviceReady(merchantInfo); // changed the name in 1.3
                listener.onReady(merchantInfo); // left here for backwards compatibility.  Deprecated in 1.3*
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnTipAdjustAuthResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending TipAdjustAuthResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onTipAdjustAuthResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnVaultCardRespose = function (ccr) {
        var _this = this;
        this.logger.debug('Sending VaultCardResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onVaultCardResponse(ccr);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnPreAuthResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending PreAuthResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onPreAuthResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnCapturePreAuth = function (response) {
        var _this = this;
        this.logger.debug('Sending CapturePreAuth notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onCapturePreAuthResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnDeviceError = function (errorEvent) {
        var _this = this;
        this.logger.debug('Sending DeviceError notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onDeviceError(errorEvent);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnConfirmPaymentRequest = function (confirmPaymentRequest) {
        var _this = this;
        this.logger.debug('Sending ConfirmPaymentRequest notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onConfirmPaymentRequest(confirmPaymentRequest);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnRetrievePendingPaymentResponse = function (rppr) {
        var _this = this;
        this.logger.debug('Sending RetrievePendingPaymentResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onRetrievePendingPaymentsResponse(rppr);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnReadCardDataResponse = function (rcdr) {
        var _this = this;
        this.logger.debug('Sending ReadCardDataResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onReadCardDataResponse(rcdr);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnActivityMessage = function (response) {
        var _this = this;
        this.logger.debug('Sending MessageFromActivity notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onMessageFromActivity(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnActivityResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending ActivityResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onCustomActivityResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnRetrieveDeviceStatusResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending RetrieveDeviceStatusResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onRetrieveDeviceStatusResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnResetDeviceResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending ResetDeviceResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onResetDeviceResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnRetrievePaymentResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending RetrievePaymentResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onRetrievePaymentResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnRetrievePrintersResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending RetrievePrintersResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onRetrievePrintersResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverConnectorBroadcaster.prototype.notifyOnPrintJobStatusResponse = function (response) {
        var _this = this;
        this.logger.debug('Sending PrintJobStatusResponse notification to listeners');
        this.listeners.forEach(function (listener) {
            try {
                listener.onPrintJobStatusResponse(response);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    return CloverConnectorBroadcaster;
}());
exports.CloverConnectorBroadcaster = CloverConnectorBroadcaster;

//# sourceMappingURL=../../../../maps/com/clover/remote/client/CloverConnectorBroadcaster.js.map
