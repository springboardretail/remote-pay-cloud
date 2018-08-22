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
var CloverWebSocketInterface_1 = require("./CloverWebSocketInterface");
/**
 * Uses a browser Websocket.
 *
 *
 */
var BrowserWebSocketImpl = (function (_super) {
    __extends(BrowserWebSocketImpl, _super);
    function BrowserWebSocketImpl(endpoint) {
        return _super.call(this, endpoint) || this;
    }
    /**
     *
     * @override
     * @param endpoint - the url that will connected to
     * @returns {WebSocket} - the specific implementation of a websocket
     */
    BrowserWebSocketImpl.prototype.createWebSocket = function (endpoint) {
        return new WebSocket(endpoint);
    };
    /**
     * Browser implementations do not do pong frames
     */
    BrowserWebSocketImpl.prototype.sendPong = function () {
        return this;
    };
    /**
     * Browser implementations do not do ping frames
     */
    BrowserWebSocketImpl.prototype.sendPing = function () {
        return this;
    };
    /**
     * Create an instance of this class
     *
     * @param endpoint
     * @returns {BrowserWebSocketImpl}
     */
    BrowserWebSocketImpl.createInstance = function (endpoint) {
        return new BrowserWebSocketImpl(endpoint);
    };
    return BrowserWebSocketImpl;
}(CloverWebSocketInterface_1.CloverWebSocketInterface));
exports.BrowserWebSocketImpl = BrowserWebSocketImpl;

//# sourceMappingURL=../../../maps/com/clover/websocket/BrowserWebSocketImpl.js.map
