import { CloverTransport } from '../transport/CloverTransport';
import { WebSocketCloverDeviceConfiguration } from './WebSocketCloverDeviceConfiguration';
import { HttpSupport } from '../../../util/HttpSupport';
import { IImageUtil } from '../../../util/IImageUtil';
/**
 * Configuration used to create a connection to a device via the Clover cloud.
 */
export declare class WebSocketCloudCloverDeviceConfiguration extends WebSocketCloverDeviceConfiguration {
    private cloverServer;
    private accessToken;
    private httpSupport;
    private merchantId;
    private deviceId;
    private friendlyId;
    private forceConnect;
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
    constructor(applicationId: string, webSocketFactoryFunction: any, imageUtil: IImageUtil, cloverServer: string, accessToken: string, httpSupport: HttpSupport, merchantId: string, deviceId: string, friendlyId: string, forceConnect?: boolean, heartbeatInterval?: number, reconnectDelay?: number);
    getMessagePackageName(): string;
    getName(): string;
    getCloverDeviceType(): any;
    getCloverTransport(): CloverTransport;
}
