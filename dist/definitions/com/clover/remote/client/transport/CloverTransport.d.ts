import { CloverTransportObserver } from './CloverTransportObserver';
import { ObjectMessageSender } from './ObjectMessageSender';
/**
 * Clover Transport
 *
 * The clover transport facilitates notification distribution
 * from the device to a list of observers.
 */
export declare abstract class CloverTransport {
    protected observers: CloverTransportObserver[];
    protected objectMessageSender: ObjectMessageSender;
    protected ready: Boolean;
    constructor();
    /**
     * Notify observers that the device is connected
     */
    protected notifyDeviceConnected(): void;
    /**
     * Notify observers that the device is ready
     */
    protected notifyDeviceReady(): void;
    /**
     * Notify observers that the device has disconnected
     */
    protected notifyDeviceDisconnected(): void;
    /**
     * Should be called by subclasses (_super.onMessage) when a message is received
     * in order to forward to all observers
     *
     * @param {string} message - The message we received
     */
    protected onMessage(message: string): void;
    /**
     * Send a message
     *
     * @param {string} message - the message to send
     * @return int - status indicator of 0 or -1 where 0 is success and -1 is failure
     */
    abstract sendMessage(message: string): number;
    /**
     * Add new observer to receive notifications from the device
     *
     * @param {CloverTransportObserver} observer - the observer to notify
     */
    subscribe(observer: CloverTransportObserver): void;
    /**
     * Remove an observer from the list of observers
     *
     * @param {CloverTransportObserver} observer - the observer to remove
     */
    unsubscribe(observer: CloverTransportObserver): void;
    /**
     * Clear the observers list
     */
    clearListeners(): void;
    setObjectMessageSender(objectMessageSender: ObjectMessageSender): void;
    /**
     * Properly dispose of this object
     */
    abstract dispose(): void;
    /**
     * Request a disconnect then reconnect
     */
    abstract reset(): void;
}
