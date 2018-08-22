import { HttpSupport } from '../../../../util/HttpSupport';
import { CloverWebSocketClient } from './CloverWebSocketClient';
import { WebSocketCloverTransport } from "./WebSocketCloverTransport";
/**
 * WebSocket Cloud Clover Transport.  This handles the need to notify the device before a connection attempt is made.
 *
 */
export declare class WebSocketCloudCloverTransport extends WebSocketCloverTransport {
    /**
     * HTTP Header key that helps identify the connected client.  Typically set to the
     * 'friendlyId'.
     *
     * @type {string}
     */
    static X_CLOVER_CONNECTED_ID: string;
    private httpSupport;
    private cloverServer;
    private merchantId;
    private accessToken;
    private deviceId;
    private friendlyId;
    private forceConnect;
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
    constructor(heartbeatInterval: number, reconnectDelay: number, retriesUntilDisconnect: number, webSocketImplClass: any, cloverServer: string, merchantId: string, accessToken: string, deviceId: string, friendlyId: string, forceConnect: boolean, httpSupport: HttpSupport);
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
    protected initialize(): void;
    /**
     * This handles the response from the server of the request to send a notification to the device. If the
     * notification was successful, then an OPTIONS call is made using the information provided.
     *
     * @param notificationResponse - has a boolean property for 'sent', that indicates if the notification
     *  was sent to the device.  If it was, then the properties 'host' and 'token' are used to derive the
     *  websocket endpoint uri.
     */
    private deviceNotificationSent(notificationResponse);
    /**
     * Do an OPTIONS call to the web socket endpoint (using http).  This helps with a problem where a 401
     * response came back from the websocket endpoint.
     *
     * @param deviceWebSocketEndpoint
     */
    private doOptionsCallToAvoid401Error(deviceWebSocketEndpoint);
    /**
     * Handles the response to the OPTIONS call.  This helps with a 401 response, and is used to help identify
     * any existing connection to the device.
     *
     * If the endpoint is available, then the transport is connected to the websocket.
     *
     * @param deviceWebSocketEndpoint
     */
    private afterOptionsCall(deviceWebSocketEndpoint, xmlHttpReqImpl);
    /**
     *
     * @override
     * @param ws
     */
    onOpen(ws: CloverWebSocketClient): void;
}
