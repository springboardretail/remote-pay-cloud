import { CloverWebSocketClient } from './CloverWebSocketClient';
/**
 * A websocket listener interface definition.
 */
export interface CloverWebSocketClientListener {
    onOpen(ws: CloverWebSocketClient): any;
    onNotResponding(ws: CloverWebSocketClient): any;
    onPingResponding(ws: CloverWebSocketClient): any;
    onClose(ws: CloverWebSocketClient, code: number, reason: String, remote: boolean): any;
    onMessage(ws: CloverWebSocketClient, message: string): any;
    connectionError(cloverNVWebSocketClient: CloverWebSocketClient, message?: string): any;
    onSendError(payloadText: string): any;
}
