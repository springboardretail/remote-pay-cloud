import { RemoteMessageParser } from '../../../../json/RemoteMessageParser';
import { CloverWebSocketClient } from './CloverWebSocketClient';
import { CloverTransport } from '../CloverTransport';
import { Logger } from '../../util/Logger';
import { CloverWebSocketClientListener } from "./CloverWebSocketClientListener";
/**
 * WebSocket Clover Transport
 *
 * This is a websocket implementation of the Clover Transport.
 */
export declare abstract class WebSocketCloverTransport extends CloverTransport implements CloverWebSocketClientListener {
    protected logger: Logger;
    private reconnectDelay;
    /**
     * We do not wantto start up multiple reconnect threads.  This should alleviate that
     * @type {boolean}
     */
    private reconnecting;
    /**
     * Subclasses need to set this at times.
     *
     * @param newValue
     */
    protected setReconnecting(newValue: boolean): void;
    cloverWebSocketClient: CloverWebSocketClient;
    private messageQueue;
    /**
     * This is the WebSocket implementation.  This is odd,
     * but it is how we can keep ourselves from being tied to a browser.
     *
     * A NodeJS app that uses this library would pass in a different
     * object than a browser implementation.  NodeJS has an object that
     * satisfies the requirements of the WebSocket (looks the same).
     *
     * https://www.npmjs.com/package/websocket
     */
    webSocketImplClass: any;
    status: string;
    /**
     * prevent reconnects if shutdown was requested
     */
    shutdown: boolean;
    messageParser: RemoteMessageParser;
    reconnector: any;
    reconnect(): void;
    reset(): void;
    static METHOD: string;
    static PAYLOAD: string;
    constructor(heartbeatInterval: number, reconnectDelay: number, retriesUntilDisconnect: number, webSocketImplClass: any);
    /**
     * Since this is javascript, this is not an actual thread, but it
     * represents threading the sending of the messages.
     *
     * This just checks the message queue for elements, then sends using
     * a FIFO pattern.
     */
    private sendMessageThread();
    /**
     * Pushes the message to the queue for sending by the send 'thread'
     *
     * @param message - a string message to send on the websocket
     * @returns {number} negative 1 (-1)
     */
    sendMessage(message: string): number;
    private clearWebsocket();
    protected abstract initialize(): void;
    /**
     * Called from subclasses at the end of the constructor.
     *
     * @param deviceEndpoint
     */
    protected initializeWithUri(deviceEndpoint: string): void;
    dispose(): void;
    private drainQueue();
    connectionError(ws: CloverWebSocketClient, message?: string): void;
    onNotResponding(ws: CloverWebSocketClient): void;
    onPingResponding(ws: CloverWebSocketClient): void;
    onOpen(ws: CloverWebSocketClient): void;
    onClose(ws: CloverWebSocketClient, code: number, reason: string, remote: boolean): void;
    /**
     * Messed up way ts/js does function overloading
     *
     * @param ws
     * @param message
     */
    onMessage(ws: CloverWebSocketClient, message: string): void;
    onMessage(message: string): void;
    onMessage_cwscl(ws: CloverWebSocketClient, message: string): void;
    onSendError(payloadText: string): void;
}
export declare namespace WebSocketCloverTransport {
    class CloverWebSocketCloseCode {
        code: number;
        reason: string;
        static RESET_CLOSE_CODE: CloverWebSocketCloseCode;
        constructor(code: number, reason: string);
    }
}
