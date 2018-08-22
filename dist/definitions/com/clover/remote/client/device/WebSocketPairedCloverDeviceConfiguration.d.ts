import { CloverTransport } from '../transport/CloverTransport';
import { PairingDeviceConfiguration } from '../transport/PairingDeviceConfiguration';
import { WebSocketCloverDeviceConfiguration } from './WebSocketCloverDeviceConfiguration';
import { IImageUtil } from '../../../util/IImageUtil';
/**
 * This is the base class that is used when connecting directly to a device via the "Network Pay Display".
 *
 * A pairing scheme is used when connecting, so the function callbacks for when a pairing code is received,
 * and when the pairing completes must be implemented here.
 */
export declare abstract class WebSocketPairedCloverDeviceConfiguration extends WebSocketCloverDeviceConfiguration implements PairingDeviceConfiguration {
    private uri;
    private posName;
    private serialNumber;
    private authToken;
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
    constructor(endpoint: string, applicationId: string, posName: string, serialNumber: string, authToken: string, webSocketFactoryFunction: any, imageUtil: IImageUtil, heartbeatInterval?: number, reconnectDelay?: number);
    getMessagePackageName(): string;
    getName(): string;
    getCloverTransport(): CloverTransport;
    setAuthToken(authToken: string): void;
    abstract onPairingCode(pairingCode: string): void;
    abstract onPairingSuccess(authToken: string): void;
}
