import { PairingDeviceConfiguration } from '../PairingDeviceConfiguration';
import { CloverWebSocketClient } from './CloverWebSocketClient';
import { WebSocketCloverTransport } from "./WebSocketCloverTransport";
/**
 * WebSocket Paired Clover Transport
 *
 * Implements code that is used to pair with a device.  Depending on the application running on a device,
 * a pairing protocol may be needed to successfully connect.  This implementation sends the pairing request
 * when the websocket is opened.
 */
export declare class WebSocketPairedCloverTransport extends WebSocketCloverTransport {
    private endpoint;
    private posName;
    private serialNumber;
    private authToken;
    pairingDeviceConfiguration: PairingDeviceConfiguration;
    isPairing: boolean;
    constructor(endpoint: string, heartbeatInterval: number, reconnectDelay: number, retriesUntilDisconnect: number, posName: string, serialNumber: string, authToken: string, webSocketImplClass: any);
    protected initialize(): void;
    /**
     *
     * @override
     * @param ws
     */
    onOpen(ws: CloverWebSocketClient): void;
    private sendPairRequest();
    /**
     * Handles routing pairing messages.  Routes PAIRING_CODE and PairingResponse PAIRED/INITIAL messages to the
     * configured PairingDeviceConfiguration
     *
     * @param ws
     * @param message
     */
    onMessage_cwscl(ws: CloverWebSocketClient, message: string): void;
    setPairingDeviceConfiguration(pairingDeviceConfiguration: PairingDeviceConfiguration): void;
}
