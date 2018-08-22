import { CloverWebSocketInterface } from '../../../../websocket/CloverWebSocketInterface';
import { WebSocketListener } from '../../../../websocket/WebSocketListener';
import { CloverWebSocketClientListener } from './CloverWebSocketClientListener';
import { WebSocketState } from '../../../../websocket/WebSocketState';
/**
 * The implementation of the websocket listener.  The websocket connection is
 * initiated from this class, and many of the low level functionality is housed here.
 */
export declare class CloverWebSocketClient implements WebSocketListener {
    private endpoint;
    listener: CloverWebSocketClientListener;
    heartbeatInterval: number;
    private webSocketImplClass;
    private socket;
    private notifyClose;
    private logger;
    constructor(endpoint: string, listener: CloverWebSocketClientListener, heartbeatInterval: number, webSocketImplClass: any);
    getWebSocketState(): WebSocketState;
    getBufferedAmount(): number;
    connect(): void;
    close(code?: number, reason?: string): void;
    isConnecting(): boolean;
    isOpen(): boolean;
    isClosing(): boolean;
    isClosed(): boolean;
    onTextMessage(websocket: CloverWebSocketInterface, text: string): void;
    onConnected(websocket: CloverWebSocketInterface): void;
    /**
     *
     * @param {CloverWebSocketInterface} websocket
     * @param event - A simple error event is passed per the websocket spec - https://www.w3.org/TR/websockets/#concept-websocket-close-fail
     * It doesn't appear that an exact typing for the websocket error event is available, so I am using any.
     */
    onConnectError(websocket: CloverWebSocketInterface, event: any): void;
    onDisconnected(websocket: CloverWebSocketInterface): void;
    onCloseFrame(websocket: CloverWebSocketInterface, closeCode: number, reason: string): void;
    onError(websocket: CloverWebSocketInterface): void;
    onPingFrame(websocket: CloverWebSocketInterface): void;
    onSendError(websocket: CloverWebSocketInterface): void;
    onUnexpectedError(websocket: CloverWebSocketInterface): void;
    send(message: string): void;
    clearListener(): void;
    setNotifyClose(b: boolean): void;
    shouldNotifyClose(): boolean;
}
