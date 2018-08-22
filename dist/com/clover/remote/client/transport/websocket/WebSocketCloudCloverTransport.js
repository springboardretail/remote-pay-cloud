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
var Endpoints_1 = require("../../../../util/Endpoints");
var DeviceContactInfo_1 = require("../../../../util/DeviceContactInfo");
var WebSocketState_1 = require("../../../../websocket/WebSocketState");
var WebSocketCloverTransport_1 = require("./WebSocketCloverTransport");
/**
 * WebSocket Cloud Clover Transport.  This handles the need to notify the device before a connection attempt is made.
 *
 */
var WebSocketCloudCloverTransport = (function (_super) {
    __extends(WebSocketCloudCloverTransport, _super);
    /**
     * @param {number} heartbeatInterval - duration to wait for a PING before disconnecting
     * @param {number} reconnectDelay - duration to wait until a reconnect is attempted
     * @param retriesUntilDisconnect - unused
     * @param {Object} webSocketImplClass - the function that will return an instance of the
     *  CloverWebSocketInterface that will be used when connecting.  For Browser implementations, this can be
     * @param {string} cloverServer the base url for the clover server used in the cloud connection.
     *    EX:  https://www.clover.com, http://localhost:9000
     * @param {string} merchantId - the merchant the device belongs to.
     * @param {string} accessToken - the OAuth access token that will be used when contacting the clover server
     * @param {string} deviceId - the id (not uuid) of the device to connect to
     * @param {string} friendlyId - an identifier for the specific terminal connected to this device.  This id is used
     *  in debugging and may be sent to other clients if they attempt to connect to the same device.  It will also be
     *  sent to other clients that are currently connected if this device does a forceConnect.
     * @param {boolean} forceConnect - if true, overtake any existing connection.
     * @param {HttpSupport} httpSupport - the helper object used when making http requests.
     */
    function WebSocketCloudCloverTransport(heartbeatInterval, reconnectDelay, retriesUntilDisconnect, webSocketImplClass, cloverServer, merchantId, accessToken, deviceId, friendlyId, forceConnect, httpSupport) {
        var _this = _super.call(this, heartbeatInterval, reconnectDelay, retriesUntilDisconnect, webSocketImplClass) || this;
        _this.cloverServer = cloverServer;
        _this.merchantId = merchantId;
        _this.accessToken = accessToken;
        _this.deviceId = deviceId;
        _this.httpSupport = httpSupport;
        _this.friendlyId = friendlyId;
        _this.forceConnect = forceConnect;
        _this.initialize();
        return _this;
    }
    /**
     * The cloud needs to call an endpoint on the server to notify the device that it wants
     * to talk.  This requires a valid OAuth access token, and we also need to know which Clover
     * server to contact.
     *
     * To make the call, we also need to have an object that we can use that does not tie us to
     * a particular environment.  This is the httpSupport.
     *
     * If an attempt is being made to reconnect, when this fails, it will set the 'reconnecting' flag to
     * false to allow another reconnect attempt to be started by a separate 'thread'.
     */
    WebSocketCloudCloverTransport.prototype.initialize = function () {
        var _this = this;
        // Do the notification call.  This needs to happen every time we attempt to connect.
        // It COULD mean that the device gets a notification when the Cloud Pay Display is
        // already running, but this is not harmful.
        var alertEndpoint = Endpoints_1.Endpoints.getAlertDeviceEndpoint(this.cloverServer, this.merchantId, this.accessToken);
        var deviceContactInfo = new DeviceContactInfo_1.DeviceContactInfo(this.deviceId.replace(/-/g, ""), true);
        this.httpSupport.postData(alertEndpoint, function (data) { return _this.deviceNotificationSent(data); }, function (error) {
            _this.connectionError(_this.cloverWebSocketClient, "Error sending alert to device. Details: " + error.message);
            // This may end a reconnect attempt
            _this.setReconnecting(false);
        }, deviceContactInfo);
    };
    /**
     * This handles the response from the server of the request to send a notification to the device. If the
     * notification was successful, then an OPTIONS call is made using the information provided.
     *
     * @param notificationResponse - has a boolean property for 'sent', that indicates if the notification
     *  was sent to the device.  If it was, then the properties 'host' and 'token' are used to derive the
     *  websocket endpoint uri.
     */
    WebSocketCloudCloverTransport.prototype.deviceNotificationSent = function (notificationResponse) {
        // Note "!data.hasOwnProperty('sent')" is included to allow for
        // backwards compatibility.  If the property is NOT included, then
        // we will assume an earlier version of the protocol on the server,
        // and assume that the notification WAS SENT.
        if (!notificationResponse.hasOwnProperty('sent') || notificationResponse.sent) {
            var deviceWebSocketEndpoint = Endpoints_1.Endpoints.getDeviceWebSocketEndpoint(notificationResponse.host, notificationResponse.token, this.friendlyId, this.forceConnect);
            this.doOptionsCallToAvoid401Error(deviceWebSocketEndpoint);
        }
        else {
            this.connectionError(this.cloverWebSocketClient, "Could not send alert to device.");
            // This may end a reconnect attempt
            this.setReconnecting(false);
        }
    };
    /**
     * Do an OPTIONS call to the web socket endpoint (using http).  This helps with a problem where a 401
     * response came back from the websocket endpoint.
     *
     * @param deviceWebSocketEndpoint
     */
    WebSocketCloudCloverTransport.prototype.doOptionsCallToAvoid401Error = function (deviceWebSocketEndpoint) {
        var _this = this;
        // A way to deal with the 401 error that
        // occurs when a websocket connection is made to the
        // server (sometimes).  Do a preliminary OPTIONS
        // request.  Although this happens regardless of if the error
        // happens, it is tremendously faster.
        var deviceWebSocketEndpointCopy = deviceWebSocketEndpoint;
        var httpUrl = null;
        if (deviceWebSocketEndpointCopy.indexOf("wss") > -1) {
            httpUrl = deviceWebSocketEndpointCopy.replace("wss", "https");
        }
        else {
            httpUrl = deviceWebSocketEndpointCopy.replace("ws", "http");
        }
        this.httpSupport.options(httpUrl, function (data, xmlHttpReqImpl) { return _this.afterOptionsCall(deviceWebSocketEndpoint, xmlHttpReqImpl); }, function (data, xmlHttpReqImpl) { return _this.afterOptionsCall(deviceWebSocketEndpoint, xmlHttpReqImpl); });
    };
    /**
     * Handles the response to the OPTIONS call.  This helps with a 401 response, and is used to help identify
     * any existing connection to the device.
     *
     * If the endpoint is available, then the transport is connected to the websocket.
     *
     * @param deviceWebSocketEndpoint
     */
    WebSocketCloudCloverTransport.prototype.afterOptionsCall = function (deviceWebSocketEndpoint, xmlHttpReqImpl) {
        // See com.clover.support.handler.remote_pay.RemotePayConnectionControlHandler#X_CLOVER_CONNECTED_ID
        // This checks for an existing connection, which includes the id of the terminal that is connected.
        var connectedId = "";
        if (xmlHttpReqImpl && typeof xmlHttpReqImpl["getResponseHeader"] === "function") {
            connectedId = xmlHttpReqImpl.getResponseHeader(WebSocketCloudCloverTransport.X_CLOVER_CONNECTED_ID);
        }
        if (connectedId && !this.forceConnect) {
            if (this.friendlyId == connectedId) {
                // Do anything here?  This is already connected.
                this.logger.debug("Trying to connect, but already connected to friendlyId '" + this.friendlyId + "'");
                if (this.cloverWebSocketClient) {
                    this.cloverWebSocketClient.close();
                }
            }
            else {
                this.connectionError(this.cloverWebSocketClient, "Device is already connected to '" + connectedId + "'");
                // This may end a reconnect attempt
                this.setReconnecting(false);
                return; // done connecting
            }
            // If the device socket is already connected and good, just return.
            if (this.cloverWebSocketClient && this.cloverWebSocketClient.getWebSocketState() == WebSocketState_1.WebSocketState.OPEN) {
                // This may end a reconnect attempt
                this.setReconnecting(false);
                return; // done connecting
            }
        }
        _super.prototype.initializeWithUri.call(this, deviceWebSocketEndpoint);
    };
    /**
     *
     * @override
     * @param ws
     */
    WebSocketCloudCloverTransport.prototype.onOpen = function (ws) {
        if (this.cloverWebSocketClient == ws) {
            _super.prototype.onOpen.call(this, ws);
            this.notifyDeviceReady();
        }
    };
    /**
     * HTTP Header key that helps identify the connected client.  Typically set to the
     * 'friendlyId'.
     *
     * @type {string}
     */
    WebSocketCloudCloverTransport.X_CLOVER_CONNECTED_ID = "X-CLOVER-CONNECTED-ID";
    return WebSocketCloudCloverTransport;
}(WebSocketCloverTransport_1.WebSocketCloverTransport));
exports.WebSocketCloudCloverTransport = WebSocketCloudCloverTransport;

//# sourceMappingURL=../../../../../../maps/com/clover/remote/client/transport/websocket/WebSocketCloudCloverTransport.js.map
