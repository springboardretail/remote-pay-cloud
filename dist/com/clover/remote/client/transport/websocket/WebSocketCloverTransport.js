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
var RemoteMessageParser_1 = require("../../../../json/RemoteMessageParser");
var CloverWebSocketClient_1 = require("./CloverWebSocketClient");
var CloverTransport_1 = require("../CloverTransport");
var Logger_1 = require("../../util/Logger");
/**
 * WebSocket Clover Transport
 *
 * This is a websocket implementation of the Clover Transport.
 */
var WebSocketCloverTransport = (function (_super) {
    __extends(WebSocketCloverTransport, _super);
    function WebSocketCloverTransport(heartbeatInterval, reconnectDelay, retriesUntilDisconnect, webSocketImplClass) {
        var _this = _super.call(this) || this;
        // Create a logger
        _this.logger = Logger_1.Logger.create();
        _this.reconnectDelay = 3000;
        /**
         * We do not wantto start up multiple reconnect threads.  This should alleviate that
         * @type {boolean}
         */
        _this.reconnecting = false;
        _this.messageQueue = new Array();
        _this.status = "Disconnected";
        /**
         * prevent reconnects if shutdown was requested
         */
        _this.shutdown = false;
        _this.reconnector = function () {
            if (!this.shutdown) {
                try {
                    this.initialize();
                }
                catch (e) {
                    this.reconnect();
                }
            }
        }.bind(_this);
        _this.reconnectDelay = Math.max(0, reconnectDelay);
        _this.webSocketImplClass = webSocketImplClass;
        // from WebSocketCloverDeviceConfiguration.getMessagePackageName, which needs to be changeable
        // 'com.clover.remote_protocol_broadcast.app'
        _this.messageParser = RemoteMessageParser_1.RemoteMessageParser.getDefaultInstance();
        var messageSenderId = setInterval(function () {
            if (!_this.shutdown) {
                _this.sendMessageThread();
            }
            else {
                clearInterval(messageSenderId);
            }
        }, 100);
        return _this;
    }
    /**
     * Subclasses need to set this at times.
     *
     * @param newValue
     */
    WebSocketCloverTransport.prototype.setReconnecting = function (newValue) {
        this.reconnecting = newValue;
    };
    WebSocketCloverTransport.prototype.reconnect = function () {
        // If we are already reconnecting, do not start another.
        if (!this.reconnecting) {
            this.setReconnecting(true);
            if (this.shutdown) {
                this.logger.debug("Not attempting to reconnect, shutdown...");
                return;
            }
            setTimeout(this.reconnector, this.reconnectDelay);
        }
        else {
            this.logger.debug("Already attempting to reconnect, will ignore additional request");
        }
    };
    WebSocketCloverTransport.prototype.reset = function () {
        try {
            // By sending this close, the "onClose" will be fired, which will try to reconnect.
            this.cloverWebSocketClient.close(WebSocketCloverTransport.CloverWebSocketCloseCode.RESET_CLOSE_CODE.code, WebSocketCloverTransport.CloverWebSocketCloseCode.RESET_CLOSE_CODE.reason);
        }
        catch (e) {
            this.logger.error('error resetting transport.', e);
        }
    };
    /**
     * Since this is javascript, this is not an actual thread, but it
     * represents threading the sending of the messages.
     *
     * This just checks the message queue for elements, then sends using
     * a FIFO pattern.
     */
    WebSocketCloverTransport.prototype.sendMessageThread = function () {
        // If we do not have any messages, then don't try to send them
        if (this.messageQueue.length > 0) {
            // let's see if we have connectivity
            if (this.cloverWebSocketClient != null && this.cloverWebSocketClient.isOpen()) {
                // Hold the message in case we need to put it back on the queue
                var nextMsg = this.messageQueue.shift();
                try {
                    if (this.cloverWebSocketClient.getBufferedAmount() > 0) {
                        this.messageQueue.unshift(nextMsg);
                    }
                    else {
                        this.cloverWebSocketClient.send(nextMsg);
                    }
                }
                catch (e) {
                    // Failed to send, put it back
                    this.messageQueue.unshift(nextMsg);
                    this.reconnect();
                }
            }
            else {
                this.reconnect();
            }
        }
    };
    /**
     * Pushes the message to the queue for sending by the send 'thread'
     *
     * @param message - a string message to send on the websocket
     * @returns {number} negative 1 (-1)
     */
    WebSocketCloverTransport.prototype.sendMessage = function (message) {
        if (!this.shutdown) {
            this.messageQueue.push(message);
        }
        else {
            this.logger.debug('In process of shutting down, ignoring ' + message);
        }
        return -1;
    };
    WebSocketCloverTransport.prototype.clearWebsocket = function () {
        if (this.cloverWebSocketClient != null) {
            this.cloverWebSocketClient.clearListener();
        }
        this.cloverWebSocketClient = null;
    };
    /**
     * Called from subclasses at the end of the constructor.
     *
     * @param deviceEndpoint
     */
    WebSocketCloverTransport.prototype.initializeWithUri = function (deviceEndpoint) {
        // Primary end to the reconnect attempts
        this.setReconnecting(false);
        if (this.cloverWebSocketClient != null) {
            if (this.cloverWebSocketClient.isOpen() || this.cloverWebSocketClient.isConnecting()) {
                return;
            }
            else {
                this.clearWebsocket();
            }
        }
        this.cloverWebSocketClient = new CloverWebSocketClient_1.CloverWebSocketClient(deviceEndpoint, this, 5000, this.webSocketImplClass);
        this.cloverWebSocketClient.connect();
        this.logger.debug('connection attempt done.');
    };
    WebSocketCloverTransport.prototype.dispose = function () {
        this.shutdown = true;
        // Attempt to clear out messages already in the send queue
        this.drainQueue();
        if (this.cloverWebSocketClient != null) {
            this.notifyDeviceDisconnected();
            this.cloverWebSocketClient.close();
        }
        this.clearWebsocket();
    };
    WebSocketCloverTransport.prototype.drainQueue = function () {
        // Attempt to finish off the queue
        while (this.messageQueue.length > 0) {
            // let's see if we have connectivity
            if (this.cloverWebSocketClient != null && this.cloverWebSocketClient.isOpen()) {
                var nextMsg = this.messageQueue.shift();
                try {
                    this.cloverWebSocketClient.send(nextMsg);
                }
                catch (e) {
                    this.logger.debug('In process of shutting down, an error occurred trying to drain the message queue.  The messages unsent are ' + this.messageQueue);
                    break;
                }
            }
            else {
                this.logger.debug('In process of shutting down, the websocket became disconnected.  The messages unsent are ' + this.messageQueue);
                break;
            }
        }
    };
    WebSocketCloverTransport.prototype.connectionError = function (ws, message) {
        this.logger.debug('Connection error...');
        if (this.cloverWebSocketClient == ws) {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                observer.onDeviceDisconnected(this, message);
                var deviceErrorEvent = new sdk.remotepay.CloverDeviceErrorEvent();
                deviceErrorEvent.setType(sdk.remotepay.ErrorType.COMMUNICATION);
                deviceErrorEvent.setCode(sdk.remotepay.DeviceErrorEventCode.NotConnected);
                deviceErrorEvent.setCause(null);
                deviceErrorEvent.setMessage(message);
                observer.onDeviceError(deviceErrorEvent);
            }
        }
    };
    WebSocketCloverTransport.prototype.onNotResponding = function (ws) {
        this.logger.debug('Not Responding...');
        if (this.cloverWebSocketClient == ws) {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                this.logger.debug('onNotResponding');
                observer.onDeviceDisconnected(this);
            }
        }
    };
    WebSocketCloverTransport.prototype.onPingResponding = function (ws) {
        this.logger.debug("Ping Responding");
        if (this.cloverWebSocketClient == ws) {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                this.logger.debug("onPingResponding");
                observer.onDeviceReady(this);
            }
        }
    };
    WebSocketCloverTransport.prototype.onOpen = function (ws) {
        this.logger.debug("Open...");
        if (this.cloverWebSocketClient == ws) {
            // notify connected
            this.notifyDeviceConnected();
        }
    };
    WebSocketCloverTransport.prototype.onClose = function (ws, code, reason, remote) {
        this.logger.debug("onClose: " + reason + ", remote? " + remote);
        if (this.cloverWebSocketClient == ws) {
            if (!this.cloverWebSocketClient.isClosing()) {
                this.cloverWebSocketClient.clearListener();
                if (!this.cloverWebSocketClient.isClosed()) {
                    this.cloverWebSocketClient.close();
                }
            }
            this.clearWebsocket();
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                this.logger.debug("onClose");
                observer.onDeviceDisconnected(this);
            }
            if (!this.shutdown) {
                this.reconnect();
            }
        }
    };
    WebSocketCloverTransport.prototype.onMessage = function (wsOrMessage, messageOnly) {
        if (typeof wsOrMessage == 'string') {
            _super.prototype.onMessage.call(this, wsOrMessage);
        }
        else {
            this.onMessage_cwscl(wsOrMessage, messageOnly);
        }
    };
    WebSocketCloverTransport.prototype.onMessage_cwscl = function (ws, message) {
        if (this.cloverWebSocketClient == ws) {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                this.logger.debug("Got message: " + message);
                observer.onMessage(message);
            }
        }
    };
    WebSocketCloverTransport.prototype.onSendError = function (payloadText) {
        this.logger.error("WebSocketCloverTransport: An error occurred sending a message.");
    };
    WebSocketCloverTransport.METHOD = "method";
    WebSocketCloverTransport.PAYLOAD = "payload";
    return WebSocketCloverTransport;
}(CloverTransport_1.CloverTransport));
exports.WebSocketCloverTransport = WebSocketCloverTransport;
(function (WebSocketCloverTransport) {
    var CloverWebSocketCloseCode = (function () {
        function CloverWebSocketCloseCode(code, reason) {
            this.code = code;
            this.reason = reason;
        }
        // Using 4000 as a reset code.
        CloverWebSocketCloseCode.RESET_CLOSE_CODE = new CloverWebSocketCloseCode(4000, "Reset requested");
        return CloverWebSocketCloseCode;
    }());
    WebSocketCloverTransport.CloverWebSocketCloseCode = CloverWebSocketCloseCode;
})(WebSocketCloverTransport = exports.WebSocketCloverTransport || (exports.WebSocketCloverTransport = {}));
exports.WebSocketCloverTransport = WebSocketCloverTransport;

//# sourceMappingURL=../../../../../../maps/com/clover/remote/client/transport/websocket/WebSocketCloverTransport.js.map
