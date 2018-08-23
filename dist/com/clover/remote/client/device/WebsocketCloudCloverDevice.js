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
var DefaultCloverDevice_1 = require("./DefaultCloverDevice");
/**
 * Device definition that has Cloud specific implementation details.
 */
var WebsocketCloudCloverDevice = (function (_super) {
    __extends(WebsocketCloudCloverDevice, _super);
    function WebsocketCloudCloverDevice(configuration) {
        return _super.call(this, configuration) || this;
    }
    /**
     * The cloud sends a message to the device to let it know that the client is disconnecting
     *
     * @override
     */
    WebsocketCloudCloverDevice.prototype.dispose = function () {
        var remoteMessage = this.buildRemoteMessageToSend(new sdk.remotemessage.ShutDownMessage());
        this.sendRemoteMessage(remoteMessage);
        _super.prototype.dispose.call(this);
    };
    WebsocketCloudCloverDevice.prototype.disposeWithoutMessage = function () {
        _super.prototype.dispose.call(this);
    };
    /**
     * Cloud connections can be interrupted by another terminal.  This handles this unique case by
     * disconnecting without sending the shutdown command to the device.
     *
     * @param rMessage
     */
    WebsocketCloudCloverDevice.prototype.handleRemoteMessageEVENT = function (rMessage) {
        var method = sdk.remotemessage.Method[rMessage.getMethod()];
        if (method == null) {
            this.logger.error('Unsupported method type: ' + rMessage.getMethod());
        }
        else {
            var sdkMessage = this.messageParser.parseMessageFromRemoteMessageObj(rMessage);
            if (method == sdk.remotemessage.Method.FORCECONNECT) {
                this.logger.info("Connection was stolen!  Will not attempt reconnect.", rMessage);
                // Do we need to notify anyone?
                this.notifyObserversForceConnect(sdkMessage);
                this.disposeWithoutMessage();
            }
        }
    };
    /**
     * Reports that this connection has been severed via a onDeviceError() notification
     * @param message
     */
    WebsocketCloudCloverDevice.prototype.notifyObserversForceConnect = function (message) {
        this.deviceObservers.forEach(function (obs) {
            var deviceErrorEvent = new sdk.remotepay.CloverDeviceErrorEvent();
            deviceErrorEvent.setCode(sdk.remotepay.DeviceErrorEventCode.Interrupted);
            deviceErrorEvent.setMessage(JSON.stringify(message));
            deviceErrorEvent.setType(sdk.remotepay.ErrorType.COMMUNICATION);
            obs.onDeviceError(deviceErrorEvent);
        });
    };
    /**
     * Handles "RESET" and "SHUTDOWN" messages that originate from the server. The RESET message is a request that the connection be
     * severed and re-established.  This is done because open long-lived connections can cause load balancers orother proxy
     * type servers to hang when an attempt to restart them is made. The SHUTDOWN message is sent when Cloud Pay Display stops.
     *
     * @param rMessage
     */
    WebsocketCloudCloverDevice.prototype.handleRemoteMessage = function (rMessage) {
        try {
            if (rMessage.getMethod() === sdk.remotemessage.Method.RESET) {
                this.logger.info("Reset requested!  Will reconnect.");
                this.transport.reset();
            }
            else if (rMessage.getMethod() === sdk.remotemessage.Method.SHUTDOWN) {
                this.logger.info("Cloud Pay Display has stopped!  Will disconnect.");
                this.transport.dispose();
            }
            else {
                _super.prototype.handleRemoteMessage.call(this, rMessage);
            }
        }
        catch (eM) {
            this.logger.error('Error processing message: ' + rMessage.getPayload(), eM);
        }
    };
    return WebsocketCloudCloverDevice;
}(DefaultCloverDevice_1.DefaultCloverDevice));
exports.WebsocketCloudCloverDevice = WebsocketCloudCloverDevice;

//# sourceMappingURL=../../../../../maps/com/clover/remote/client/device/WebsocketCloudCloverDevice.js.map
