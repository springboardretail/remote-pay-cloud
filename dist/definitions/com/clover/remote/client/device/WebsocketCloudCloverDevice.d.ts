import * as sdk from 'remote-pay-cloud-api';
import { CloverDeviceConfiguration } from './CloverDeviceConfiguration';
import { DefaultCloverDevice } from './DefaultCloverDevice';
/**
 * Device definition that has Cloud specific implementation details.
 */
export declare class WebsocketCloudCloverDevice extends DefaultCloverDevice {
    constructor(configuration: CloverDeviceConfiguration);
    /**
     * The cloud sends a message to the device to let it know that the client is disconnecting
     *
     * @override
     */
    dispose(): void;
    private disposeWithoutMessage();
    /**
     * Cloud connections can be interrupted by another terminal.  This handles this unique case by
     * disconnecting without sending the shutdown command to the device.
     *
     * @param rMessage
     */
    protected handleRemoteMessageEVENT(rMessage: sdk.remotemessage.RemoteMessage): void;
    /**
     * Reports that this connection has been severed via a onDeviceError() notification
     * @param message
     */
    private notifyObserversForceConnect(message);
    /**
     * Handles "RESET" and "SHUTDOWN" messages that originate from the server. The RESET message is a request that the connection be
     * severed and re-established.  This is done because open long-lived connections can cause load balancers orother proxy
     * type servers to hang when an attempt to restart them is made. The SHUTDOWN message is sent when Cloud Pay Display stops.
     *
     * @param rMessage
     */
    protected handleRemoteMessage(rMessage: sdk.remotemessage.RemoteMessage): void;
}
