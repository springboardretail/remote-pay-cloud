import * as sdk from 'remote-pay-cloud-api';
import { JSONToCustomObject } from './JSONToCustomObject';
/**
 * Parses remote messages from raw json, and extracts messages from the
 * remote message payload object.
 *
 */
export declare class RemoteMessageParser extends JSONToCustomObject {
    private static INSTANCE;
    static getDefaultInstance(): RemoteMessageParser;
    constructor();
    /**
     *
     * @param remoteMessageObj - the sdk.remotemessage.RemoteMessage that has a payload that will be parsed to a
     * sdk.remotemessage.Message
     * @returns {sdk.remotemessage.Message}
     */
    parseMessageFromRemoteMessageObj(remoteMessageObj: sdk.remotemessage.RemoteMessage, attachUnknownProperties?: boolean): sdk.remotemessage.Message;
    /**
     * @param remoteMessage - a json object that is a serialized RemoteMessage
     * @returns {sdk.remotemessage.RemoteMessage} - object populated from the input json object.
     */
    parseToRemoteMessage(remoteMessage: any): sdk.remotemessage.RemoteMessage;
}
