/**
 * WebSocket state.
 *
 *
 * </p>
 */
export declare enum WebSocketState {
    /**
     * This value does not exist in the web
     *
     * The initial state of a {@link WebSocket} instance.
     */
    /**
     * An <a href="https://tools.ietf.org/html/rfc6455#section-4">opening
     * handshake</a> is being performed.
     */
    CONNECTING = 0,
    /**
     * The WebSocket connection is established ( the <a href=
     * "https://tools.ietf.org/html/rfc6455#section-4">opening handshake</a>
     * has succeeded) and usable.
     */
    OPEN = 1,
    /**
     * A <a href="https://tools.ietf.org/html/rfc6455#section-7">closing
     * handshake</a> is being performed.
     */
    CLOSING = 2,
    /**
     * The WebSocket connection is closed.
     */
    CLOSED = 3,
}
