"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketState_1 = require("./WebSocketState");
var Logger_1 = require("../remote/client/util/Logger");
/**
 * Used to abstract implementation details to allow for NodeJS and
 * Browser usage of the library.
 *
 * WebSocket Clover Interface.  Abstracts the WebSocket implementation so that the library is not tied to a
 * Browser implementation.
 *
 * Interface to connect a websocket implementation to.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * or https://html.spec.whatwg.org/multipage/web-sockets.html
 */
var CloverWebSocketInterface = (function () {
    function CloverWebSocketInterface(endpoint) {
        // Create a logger
        this.logger = Logger_1.Logger.create();
        this.endpoint = endpoint;
        this.listeners = new Array();
    }
    CloverWebSocketInterface.prototype.connect = function () {
        var _this = this;
        this.webSocket = this.createWebSocket(this.endpoint);
        if (typeof this.webSocket["addEventListener"] !== "function") {
            this.logger.error("FATAL: The websocket implementation being used must have an 'addEventListener' function.  Either use a supported websocket implementation (https://www.npmjs.com/package/ws) or override the connect method on CloverWebSocketInterface.");
        }
        else {
            this.webSocket.addEventListener("open", function (event) { return _this.notifyOnOpen(event); });
            this.webSocket.addEventListener("message", function (event) { return _this.notifyOnMessage(event); });
            this.webSocket.addEventListener("close", function (event) { return _this.notifyOnClose(event); });
            this.webSocket.addEventListener("error", function (event) { return _this.notifyOnError(event); });
        }
        return this;
    };
    CloverWebSocketInterface.prototype.notifyOnOpen = function (event) {
        var _this = this;
        this.listeners.forEach(function (listener) {
            try {
                // check event here for any additional data we can see - headers?
                listener.onConnected(_this);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverWebSocketInterface.prototype.notifyOnMessage = function (event) {
        var _this = this;
        this.listeners.forEach(function (listener) {
            try {
                listener.onTextMessage(_this, event.data);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    /**
     * A simple error event is passed per the websocket spec - https://www.w3.org/TR/websockets/#concept-websocket-close-fail
     * It doesn't appear that an exact typing for the websocket error event is available, so I am using any.
     *
     * @param {any} event - simple event passed per websocket spec.
     */
    CloverWebSocketInterface.prototype.notifyOnError = function (event) {
        var _this = this;
        this.listeners.forEach(function (listener) {
            try {
                // According to the spec, only CLOSING or OPEN should occur. This is a 'simple' event.
                // check event here for any additional data we can see - headers?
                if (_this.getReadyState() == WebSocketState_1.WebSocketState.CONNECTING) {
                    listener.onConnectError(_this, event);
                }
                else if (_this.getReadyState() == WebSocketState_1.WebSocketState.CLOSING) {
                    listener.onUnexpectedError(_this, event);
                }
                else if (_this.getReadyState() == WebSocketState_1.WebSocketState.CLOSED) {
                    listener.onDisconnected(_this, event);
                }
                else if (_this.getReadyState() == WebSocketState_1.WebSocketState.OPEN) {
                    listener.onSendError(_this, event);
                }
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverWebSocketInterface.prototype.notifyOnClose = function (event) {
        var _this = this;
        this.listeners.forEach(function (listener) {
            try {
                listener.onCloseFrame(_this, event.code, event.reason);
            }
            catch (e) {
                _this.logger.error(e);
            }
        });
    };
    CloverWebSocketInterface.prototype.sendClose = function (code, reason) {
        this.logger.debug("Close sent code ", code, " reason ", reason);
        try {
            /** 1000 indicates normal closure.  To avoid InvalidAccessErrors if no code is available default to 1000.
             *  Per the websocket spec:
             *    "If the method's first argument is present but is not an integer equal to 1000 or in the range 3000 to 4999,
             *     throw an InvalidAccessError exception and abort these steps."
             */
            this.webSocket.close(code || 1000, reason || "NORMAL_CLOSURE");
        }
        catch (e) {
            this.logger.error('error disposing of transport.', e);
        }
        return this;
    };
    CloverWebSocketInterface.prototype.sendText = function (data) {
        /*
         Exceptions thrown

         INVALID_STATE_ERR
         The connection is not currently OPEN.
         SYNTAX_ERR
         The data is a string that has unpaired surrogates. (???)
         */
        this.webSocket.send(data);
        return this;
    };
    CloverWebSocketInterface.prototype.getState = function () {
        return this.getReadyState();
    };
    CloverWebSocketInterface.prototype.isOpen = function () {
        return this.getReadyState() == WebSocketState_1.WebSocketState.OPEN;
    };
    CloverWebSocketInterface.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    CloverWebSocketInterface.prototype.removeListener = function (listener) {
        var indexOfListener = this.listeners.indexOf(listener);
        if (indexOfListener !== -1) {
            this.listeners.splice(indexOfListener, 1);
            return true;
        }
        return false;
    };
    CloverWebSocketInterface.prototype.getListeners = function () {
        return this.listeners.slice();
    };
    // Wrapped functionality below
    CloverWebSocketInterface.prototype.getUrl = function () {
        return this.webSocket.url;
    };
    CloverWebSocketInterface.prototype.getReadyState = function () {
        return this.webSocket.readyState;
    };
    CloverWebSocketInterface.prototype.getBufferedAmount = function () {
        return this.webSocket.hasOwnProperty("bufferedAmount") ? this.webSocket.bufferedAmount : 0;
    };
    CloverWebSocketInterface.prototype.getProtocol = function () {
        return this.webSocket.protocol;
    };
    return CloverWebSocketInterface;
}());
exports.CloverWebSocketInterface = CloverWebSocketInterface;

//# sourceMappingURL=../../../maps/com/clover/websocket/CloverWebSocketInterface.js.map
