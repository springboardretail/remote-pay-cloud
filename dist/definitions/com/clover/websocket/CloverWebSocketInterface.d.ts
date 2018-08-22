import { WebSocketListener } from './WebSocketListener';
import { WebSocketState } from './WebSocketState';
/**
 * Used to abstract implementation details to allow for NodeJS and
 * Browser usage of the library.
 *
 * WebSocket Clover Interface.  Abstracts the WebSocket implementation so that the library is not tied to a
 * Browser implementation.
 *
 * Interface to connect a websocket implementation to.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * or https://html.spec.whatwg.org/multipage/web-sockets.html
 */
export declare abstract class CloverWebSocketInterface {
    private listeners;
    private logger;
    private endpoint;
    private webSocket;
    constructor(endpoint: string);
    /**
     * For JS impls, we need to abstract out the WebSocket so that the library can be used in
     * browsers and non-browsers.
     *
     * This MUST return immediately!  It cannot use any type of promise or deferral, or the listener
     * will not be properly attached before events begin firing.
     *
     * @param endpoint - the uri to connect to
     */
    abstract createWebSocket(endpoint: string): any;
    connect(): CloverWebSocketInterface;
    private notifyOnOpen(event);
    private notifyOnMessage(event);
    /**
     * A simple error event is passed per the websocket spec - https://www.w3.org/TR/websockets/#concept-websocket-close-fail
     * It doesn't appear that an exact typing for the websocket error event is available, so I am using any.
     *
     * @param {any} event - simple event passed per websocket spec.
     */
    private notifyOnError(event);
    private notifyOnClose(event);
    sendClose(code?: number, reason?: string): CloverWebSocketInterface;
    sendText(data: string): CloverWebSocketInterface;
    getState(): WebSocketState;
    isOpen(): boolean;
    /**
     * Browser implementations do not do pong frames
     */
    abstract sendPong(): CloverWebSocketInterface;
    /**
     * Browser implementations do not do ping frames
     */
    abstract sendPing(): CloverWebSocketInterface;
    addListener(listener: WebSocketListener): void;
    removeListener(listener: WebSocketListener): boolean;
    getListeners(): Array<WebSocketListener>;
    getUrl(): String;
    getReadyState(): WebSocketState;
    getBufferedAmount(): number;
    getProtocol(): string;
}
