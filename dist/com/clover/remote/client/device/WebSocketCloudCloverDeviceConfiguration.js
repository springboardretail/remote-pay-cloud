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
var WebSocketCloudCloverTransport_1 = require("../transport/websocket/WebSocketCloudCloverTransport");
var WebsocketCloudCloverDevice_1 = require("./WebsocketCloudCloverDevice");
var WebSocketCloverDeviceConfiguration_1 = require("./WebSocketCloverDeviceConfiguration");
/**
 * Configuration used to create a connection to a device via the Clover cloud.
 */
var WebSocketCloudCloverDeviceConfiguration = (function (_super) {
    __extends(WebSocketCloudCloverDeviceConfiguration, _super);
    /**
     *
     * @param {string} applicationId - the applicationId that uniquely identifies the POS.
     *    e.g. com.company.MyPOS:2.3.1 for the first connection
     * @param {Object} webSocketFactoryFunction - the function that will return an instance of the
     *  CloverWebSocketInterface that will be used when connecting.  For Browser implementations, this can be
     *  BrowserWebSocketImpl.createInstance.  For NodeJS implementations, this will be defined differently.
     * @param {IImageUtil} imageUtil - utility to translate images into base64 strings.
     * @param {string} cloverServer the base url for the clover server used in the cloud connection.
     *    EX:  https://www.clover.com, http://localhost:9000
     * @param {string} accessToken - the OAuth access token that will be used when contacting the clover server
     * @param {HttpSupport} httpSupport - the helper object used when making http requests.
     * @param {string} merchantId - the merchant the device belongs to.
     * @param {string} deviceId - the id (not uuid) of the device to connect to
     * @param {string} friendlyId - an identifier for the specific terminal connected to this device.  This id is used
     *  in debugging and may be sent to other clients if they attempt to connect to the same device.  It will also be
     *  sent to other clients that are currently connected if this device does a forceConnect.
     * @param {boolean} forceConnect - if true, overtake any existing connection.
     * @param {number} heartbeatInterval - duration to wait for a PING before disconnecting
     * @param {number} reconnectDelay - duration to wait until a reconnect is attempted
     */
    function WebSocketCloudCloverDeviceConfiguration(applicationId, webSocketFactoryFunction, imageUtil, cloverServer, accessToken, httpSupport, merchantId, deviceId, friendlyId, forceConnect, heartbeatInterval, reconnectDelay) {
        if (forceConnect === void 0) { forceConnect = false; }
        var _this = _super.call(this, applicationId, webSocketFactoryFunction, imageUtil, heartbeatInterval, reconnectDelay) || this;
        _this.cloverServer = cloverServer;
        _this.accessToken = accessToken;
        _this.httpSupport = httpSupport;
        _this.merchantId = merchantId;
        _this.deviceId = deviceId;
        _this.friendlyId = friendlyId;
        _this.forceConnect = forceConnect;
        return _this;
    }
    WebSocketCloudCloverDeviceConfiguration.prototype.getMessagePackageName = function () {
        return 'com.clover.remote.protocol.websocket';
    };
    WebSocketCloudCloverDeviceConfiguration.prototype.getName = function () {
        return 'Clover Cloud WebSocket Connector';
    };
    WebSocketCloudCloverDeviceConfiguration.prototype.getCloverDeviceType = function () {
        return WebsocketCloudCloverDevice_1.WebsocketCloudCloverDevice;
    };
    WebSocketCloudCloverDeviceConfiguration.prototype.getCloverTransport = function () {
        // this is where we determine more about the transport...
        // The connection is paired:
        var transport = new WebSocketCloudCloverTransport_1.WebSocketCloudCloverTransport(this.heartbeatInterval, this.reconnectDelay, this.pingRetryCountBeforeReconnect, this.webSocketImplClass, this.cloverServer, this.merchantId, this.accessToken, this.deviceId, this.friendlyId, this.forceConnect, this.httpSupport);
        return transport;
    };
    return WebSocketCloudCloverDeviceConfiguration;
}(WebSocketCloverDeviceConfiguration_1.WebSocketCloverDeviceConfiguration));
exports.WebSocketCloudCloverDeviceConfiguration = WebSocketCloudCloverDeviceConfiguration;

//# sourceMappingURL=../../../../../maps/com/clover/remote/client/device/WebSocketCloudCloverDeviceConfiguration.js.map
