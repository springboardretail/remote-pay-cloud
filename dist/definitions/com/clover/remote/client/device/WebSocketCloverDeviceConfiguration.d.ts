import { CloverTransport } from '../transport/CloverTransport';
import { CloverDeviceConfiguration } from './CloverDeviceConfiguration';
import { IImageUtil } from '../../../util/IImageUtil';
/**
 * The base for WebSocket device configurations.
 */
export declare abstract class WebSocketCloverDeviceConfiguration implements CloverDeviceConfiguration {
    protected heartbeatInterval: number;
    protected reconnectDelay: number;
    protected pingRetryCountBeforeReconnect: number;
    maxCharInMessage: number;
    private appId;
    protected webSocketImplClass: any;
    protected imageUtil: IImageUtil;
    /**
     * @param {string} applicationId - the applicationId that uniquely identifies the POS. e.g. com.company.MyPOS:2.3.1
     * @param {Object} webSocketFactoryFunction - the function that will return an instance of the CloverWebSocketInterface
     *    that will be used when connecting.
     * @param {IImageUtil} imageUtil - utility to translate images into base64 strings.
     * @param {number} [heartbeatInterval] - duration to wait for a PING before disconnecting
     * @param {number} [reconnectDelay] - duration to wait until a reconnect is attempted
     */
    constructor(applicationId: string, webSocketFactoryFunction: any, imageUtil: IImageUtil, heartbeatInterval?: number, reconnectDelay?: number);
    getApplicationId(): string;
    getHeartbeatInterval(): number;
    setHeartbeatInterval(heartbeatInterval: number): void;
    getReconnectDelay(): number;
    setReconnectDelay(reconnectDelay: number): void;
    getPingRetryCountBeforeReconnect(): number;
    setPingRetryCountBeforeReconnect(pingRetryCountBeforeReconnect: number): void;
    getCloverDeviceType(): any;
    getName(): string;
    /**
     * @override
     */
    getImageUtil(): IImageUtil;
    /**
     * @override
     */
    abstract getMessagePackageName(): string;
    /**
     * @override
     */
    abstract getCloverTransport(): CloverTransport;
    getMaxMessageCharacters(): number;
}
