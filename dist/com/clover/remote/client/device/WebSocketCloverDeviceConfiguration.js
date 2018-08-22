"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultCloverDevice_1 = require("./DefaultCloverDevice");
/**
 * The base for WebSocket device configurations.
 */
var WebSocketCloverDeviceConfiguration = (function () {
    /**
     * @param {string} applicationId - the applicationId that uniquely identifies the POS. e.g. com.company.MyPOS:2.3.1
     * @param {Object} webSocketFactoryFunction - the function that will return an instance of the CloverWebSocketInterface
     *    that will be used when connecting.
     * @param {IImageUtil} imageUtil - utility to translate images into base64 strings.
     * @param {number} [heartbeatInterval] - duration to wait for a PING before disconnecting
     * @param {number} [reconnectDelay] - duration to wait until a reconnect is attempted
     */
    function WebSocketCloverDeviceConfiguration(applicationId, webSocketFactoryFunction, imageUtil, heartbeatInterval, reconnectDelay) {
        this.heartbeatInterval = 1000;
        this.reconnectDelay = 3000;
        this.pingRetryCountBeforeReconnect = 4;
        this.maxCharInMessage = 50000;
        this.imageUtil = imageUtil;
        this.appId = applicationId;
        this.webSocketImplClass = webSocketFactoryFunction;
        if (heartbeatInterval)
            this.heartbeatInterval = Math.max(100, heartbeatInterval);
        if (reconnectDelay)
            this.reconnectDelay = Math.max(100, reconnectDelay);
    }
    WebSocketCloverDeviceConfiguration.prototype.getApplicationId = function () {
        return this.appId;
    };
    WebSocketCloverDeviceConfiguration.prototype.getHeartbeatInterval = function () {
        return this.heartbeatInterval;
    };
    WebSocketCloverDeviceConfiguration.prototype.setHeartbeatInterval = function (heartbeatInterval) {
        this.heartbeatInterval = heartbeatInterval;
    };
    WebSocketCloverDeviceConfiguration.prototype.getReconnectDelay = function () {
        return this.reconnectDelay;
    };
    WebSocketCloverDeviceConfiguration.prototype.setReconnectDelay = function (reconnectDelay) {
        this.reconnectDelay = reconnectDelay;
    };
    WebSocketCloverDeviceConfiguration.prototype.getPingRetryCountBeforeReconnect = function () {
        return this.pingRetryCountBeforeReconnect;
    };
    WebSocketCloverDeviceConfiguration.prototype.setPingRetryCountBeforeReconnect = function (pingRetryCountBeforeReconnect) {
        this.pingRetryCountBeforeReconnect = pingRetryCountBeforeReconnect;
    };
    WebSocketCloverDeviceConfiguration.prototype.getCloverDeviceType = function () {
        return DefaultCloverDevice_1.DefaultCloverDevice;
    };
    WebSocketCloverDeviceConfiguration.prototype.getName = function () {
        return 'Clover WebSocket Connector';
    };
    /**
     * @override
     */
    WebSocketCloverDeviceConfiguration.prototype.getImageUtil = function () {
        return this.imageUtil;
    };
    WebSocketCloverDeviceConfiguration.prototype.getMaxMessageCharacters = function () {
        return this.maxCharInMessage;
    };
    return WebSocketCloverDeviceConfiguration;
}());
exports.WebSocketCloverDeviceConfiguration = WebSocketCloverDeviceConfiguration;

//# sourceMappingURL=../../../../../maps/com/clover/remote/client/device/WebSocketCloverDeviceConfiguration.js.map
