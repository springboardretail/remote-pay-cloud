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
var WebSocketCloverTransport_1 = require("./WebSocketCloverTransport");
/**
 * WebSocket Paired Clover Transport
 *
 * Implements code that is used to pair with a device.  Depending on the application running on a device,
 * a pairing protocol may be needed to successfully connect.  This implementation sends the pairing request
 * when the websocket is opened.
 */
var WebSocketPairedCloverTransport = (function (_super) {
    __extends(WebSocketPairedCloverTransport, _super);
    function WebSocketPairedCloverTransport(endpoint, heartbeatInterval, reconnectDelay, retriesUntilDisconnect, posName, serialNumber, authToken, webSocketImplClass) {
        var _this = _super.call(this, heartbeatInterval, reconnectDelay, retriesUntilDisconnect, webSocketImplClass) || this;
        _this.isPairing = true;
        _this.endpoint = endpoint;
        _this.posName = posName;
        _this.serialNumber = serialNumber;
        _this.authToken = authToken;
        _this.initialize();
        return _this;
    }
    WebSocketPairedCloverTransport.prototype.initialize = function () {
        this.initializeWithUri(this.endpoint);
    };
    /**
     *
     * @override
     * @param ws
     */
    WebSocketPairedCloverTransport.prototype.onOpen = function (ws) {
        if (this.cloverWebSocketClient == ws) {
            _super.prototype.onOpen.call(this, ws);
            this.sendPairRequest();
        }
    };
    WebSocketPairedCloverTransport.prototype.sendPairRequest = function () {
        this.isPairing = true;
        var prm = new sdk.remotemessage.PairingRequestMessage();
        prm.setName(this.posName);
        prm.setSerialNumber(this.serialNumber);
        prm.setApplicationName(this.posName);
        prm.setAuthenticationToken(this.authToken);
        this.objectMessageSender.sendObjectMessage(prm);
    };
    /**
     * Handles routing pairing messages.  Routes PAIRING_CODE and PairingResponse PAIRED/INITIAL messages to the
     * configured PairingDeviceConfiguration
     *
     * @param ws
     * @param message
     */
    WebSocketPairedCloverTransport.prototype.onMessage_cwscl = function (ws, message) {
        if (this.cloverWebSocketClient == ws) {
            if (this.isPairing) {
                var remoteMessage = this.messageParser.parseToRemoteMessage(message);
                var sdkMessage = this.messageParser.parseMessageFromRemoteMessageObj(remoteMessage);
                if (sdkMessage) {
                    if (sdk.remotemessage.Method.PAIRING_CODE == sdkMessage.getMethod()) {
                        this.logger.debug("Got PAIRING_CODE");
                        var pcm = sdkMessage;
                        var pairingCode = pcm.getPairingCode();
                        this.pairingDeviceConfiguration.onPairingCode(pairingCode);
                    }
                    else if (sdk.remotemessage.Method.PAIRING_RESPONSE == sdkMessage.getMethod()) {
                        this.logger.debug("Got PAIRING_RESPONSE");
                        var response = sdkMessage;
                        if (sdk.remotemessage.PairingState.PAIRED == response.getPairingState() ||
                            sdk.remotemessage.PairingState.INITIAL == response.getPairingState()) {
                            this.logger.debug("Got PAIRED pair response");
                            this.isPairing = false;
                            this.authToken = response.getAuthenticationToken();
                            try {
                                this.pairingDeviceConfiguration.onPairingSuccess(this.authToken);
                            }
                            catch (e) {
                                this.logger.debug("Error:" + e);
                            }
                            this.notifyDeviceReady();
                        }
                        else if (sdk.remotemessage.PairingState.FAILED == response.getPairingState()) {
                            this.logger.debug("Got FAILED pair response");
                            this.isPairing = true;
                            this.sendPairRequest();
                        }
                    }
                    else if (sdk.remotemessage.Method.ACK != sdkMessage.getMethod() || sdk.remotemessage.Method.UI_STATE != sdkMessage.getMethod()) {
                        this.logger.debug("Unexpected method: '" + sdkMessage.getMethod() + "' while in pairing mode.");
                    }
                }
                else {
                    this.logger.warn("Unrecognized message", message);
                }
            }
            else {
                _super.prototype.onMessage_cwscl.call(this, ws, message);
            }
        }
    };
    WebSocketPairedCloverTransport.prototype.setPairingDeviceConfiguration = function (pairingDeviceConfiguration) {
        this.pairingDeviceConfiguration = pairingDeviceConfiguration;
    };
    return WebSocketPairedCloverTransport;
}(WebSocketCloverTransport_1.WebSocketCloverTransport));
exports.WebSocketPairedCloverTransport = WebSocketPairedCloverTransport;

//# sourceMappingURL=../../../../../../maps/com/clover/remote/client/transport/websocket/WebSocketPairedCloverTransport.js.map
