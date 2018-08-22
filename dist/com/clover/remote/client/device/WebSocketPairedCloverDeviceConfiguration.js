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
var WebSocketPairedCloverTransport_1 = require("../transport/websocket/WebSocketPairedCloverTransport");
var WebSocketCloverDeviceConfiguration_1 = require("./WebSocketCloverDeviceConfiguration");
/**
 * This is the base class that is used when connecting directly to a device via the "Network Pay Display".
 *
 * A pairing scheme is used when connecting, so the function callbacks for when a pairing code is received,
 * and when the pairing completes must be implemented here.
 */
var WebSocketPairedCloverDeviceConfiguration = (function (_super) {
    __extends(WebSocketPairedCloverDeviceConfiguration, _super);
    /**
     *
     * @param {string} endpoint - the endpoint of the Clover device. e.g. wss://192.168.1.15:12345/remote_pay
     * @param {string} applicationId - the applicationId that uniquely identifies the POS. e.g. com.company.MyPOS:2.3.1
     * @param {string} posName - Displayed during pairing to display the POS name on the Mini. e.g. MyPOS
     * @param {string} serialNumber - Displayed during pairing to display the device identifier. e.g. 'Aisle 3' or 'POS-35153234'
     * @param {string} authToken - The authToken retrieved from a previous pairing activity, passed as an argument to onPairingSuccess. This will be null for the first connection
     * @param {Object} webSocketFactoryFunction - the function that will return an instance of the CloverWebSocketInterface
     *    that will be used when connecting.
     * @param {IImageUtil} imageUtil - utility to translate images into base64 strings.
     * @param {number} [heartbeatInterval] - duration to wait for a PING before disconnecting
     * @param {number} [reconnectDelay] - duration to wait until a reconnect is attempted
     */
    function WebSocketPairedCloverDeviceConfiguration(endpoint, applicationId, posName, serialNumber, authToken, webSocketFactoryFunction, imageUtil, heartbeatInterval, reconnectDelay) {
        var _this = _super.call(this, applicationId, webSocketFactoryFunction, imageUtil, heartbeatInterval, reconnectDelay) || this;
        _this.uri = null;
        _this.uri = endpoint;
        _this.posName = posName;
        _this.serialNumber = serialNumber;
        _this.authToken = authToken;
        _this.webSocketImplClass = webSocketFactoryFunction;
        return _this;
    }
    WebSocketPairedCloverDeviceConfiguration.prototype.getMessagePackageName = function () {
        return 'com.clover.remote_protocol_broadcast.app';
    };
    WebSocketPairedCloverDeviceConfiguration.prototype.getName = function () {
        return 'Clover Secure WebSocket Connector';
    };
    WebSocketPairedCloverDeviceConfiguration.prototype.getCloverTransport = function () {
        // this is where we determine more about the transport...
        // The connection is paired:
        var transport = new WebSocketPairedCloverTransport_1.WebSocketPairedCloverTransport(this.uri, this.heartbeatInterval, this.reconnectDelay, this.pingRetryCountBeforeReconnect, this.posName, this.serialNumber, this.authToken, this.webSocketImplClass);
        transport.setPairingDeviceConfiguration(this);
        return transport;
    };
    WebSocketPairedCloverDeviceConfiguration.prototype.setAuthToken = function (authToken) {
        this.authToken = authToken;
    };
    return WebSocketPairedCloverDeviceConfiguration;
}(WebSocketCloverDeviceConfiguration_1.WebSocketCloverDeviceConfiguration));
exports.WebSocketPairedCloverDeviceConfiguration = WebSocketPairedCloverDeviceConfiguration;

//# sourceMappingURL=../../../../../maps/com/clover/remote/client/device/WebSocketPairedCloverDeviceConfiguration.js.map
