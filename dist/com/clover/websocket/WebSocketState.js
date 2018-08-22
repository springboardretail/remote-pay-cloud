"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * WebSocket state.
 *
 *
 * </p>
 */
var WebSocketState;
(function (WebSocketState) {
    /**
     * This value does not exist in the web
     *
     * The initial state of a {@link WebSocket} instance.
     */
    // CREATED,
    /**
     * An <a href="https://tools.ietf.org/html/rfc6455#section-4">opening
     * handshake</a> is being performed.
     */
    WebSocketState[WebSocketState["CONNECTING"] = 0] = "CONNECTING";
    /**
     * The WebSocket connection is established ( the <a href=
     * "https://tools.ietf.org/html/rfc6455#section-4">opening handshake</a>
     * has succeeded) and usable.
     */
    WebSocketState[WebSocketState["OPEN"] = 1] = "OPEN";
    /**
     * A <a href="https://tools.ietf.org/html/rfc6455#section-7">closing
     * handshake</a> is being performed.
     */
    WebSocketState[WebSocketState["CLOSING"] = 2] = "CLOSING";
    /**
     * The WebSocket connection is closed.
     */
    WebSocketState[WebSocketState["CLOSED"] = 3] = "CLOSED";
})(WebSocketState = exports.WebSocketState || (exports.WebSocketState = {}));

//# sourceMappingURL=../../../maps/com/clover/websocket/WebSocketState.js.map
