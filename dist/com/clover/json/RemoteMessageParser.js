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
var MethodToMessage_1 = require("./MethodToMessage");
var JSONToCustomObject_1 = require("./JSONToCustomObject");
/**
 * Parses remote messages from raw json, and extracts messages from the
 * remote message payload object.
 *
 */
var RemoteMessageParser = (function (_super) {
    __extends(RemoteMessageParser, _super);
    function RemoteMessageParser() {
        return _super.call(this) || this;
    }
    RemoteMessageParser.getDefaultInstance = function () {
        return RemoteMessageParser.INSTANCE;
    };
    /**
     *
     * @param remoteMessageObj - the sdk.remotemessage.RemoteMessage that has a payload that will be parsed to a
     * sdk.remotemessage.Message
     * @returns {sdk.remotemessage.Message}
     */
    RemoteMessageParser.prototype.parseMessageFromRemoteMessageObj = function (remoteMessageObj, attachUnknownProperties) {
        if (attachUnknownProperties === void 0) { attachUnknownProperties = false; }
        var responseMessageType = MethodToMessage_1.MethodToMessage.getType(remoteMessageObj.getMethod());
        if (responseMessageType) {
            var messageToPopulate = new responseMessageType;
            if (remoteMessageObj.getPayload()) {
                // Older versions of the remote-pay lib did not return a body here
                var payload = JSON.parse(remoteMessageObj.getPayload());
                var copied = this.transfertoObject(payload, messageToPopulate, attachUnknownProperties);
                if (copied) {
                    return copied;
                }
            }
        }
        return messageToPopulate;
    };
    /**
     * @param remoteMessage - a json object that is a serialized RemoteMessage
     * @returns {sdk.remotemessage.RemoteMessage} - object populated from the input json object.
     */
    RemoteMessageParser.prototype.parseToRemoteMessage = function (remoteMessage) {
        var remoteMessageObj = new sdk.remotemessage.RemoteMessage();
        this.transfertoObject(remoteMessage, remoteMessageObj, false);
        return remoteMessageObj;
    };
    // packageName:string;
    RemoteMessageParser.INSTANCE = new RemoteMessageParser();
    return RemoteMessageParser;
}(JSONToCustomObject_1.JSONToCustomObject));
exports.RemoteMessageParser = RemoteMessageParser;

//# sourceMappingURL=../../../maps/com/clover/json/RemoteMessageParser.js.map
