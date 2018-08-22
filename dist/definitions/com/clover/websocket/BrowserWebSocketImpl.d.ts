import { CloverWebSocketInterface } from './CloverWebSocketInterface';
/**
 * Uses a browser Websocket.
 *
 *
 */
export declare class BrowserWebSocketImpl extends CloverWebSocketInterface {
    constructor(endpoint: string);
    /**
     *
     * @override
     * @param endpoint - the url that will connected to
     * @returns {WebSocket} - the specific implementation of a websocket
     */
    createWebSocket(endpoint: string): any;
    /**
     * Browser implementations do not do pong frames
     */
    sendPong(): CloverWebSocketInterface;
    /**
     * Browser implementations do not do ping frames
     */
    sendPing(): CloverWebSocketInterface;
    /**
     * Create an instance of this class
     *
     * @param endpoint
     * @returns {BrowserWebSocketImpl}
     */
    static createInstance(endpoint: string): BrowserWebSocketImpl;
}
