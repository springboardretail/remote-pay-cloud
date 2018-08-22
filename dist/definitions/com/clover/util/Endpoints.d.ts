/**
 * Utility to centralize endpoints.
 *
 * This simplifies building urls to contact services.  If there is a need to add
 * a call to a service on the server, it should be added here.
 *
 */
export declare class Endpoints {
    static ACCESS_TOKEN_KEY: string;
    static ACCESS_TOKEN_SUFFIX: string;
    static ACCOUNT_V3_KEY: string;
    static ACCOUNT_V3_PATH: string;
    static DEVELOPER_V3_KEY: string;
    static DEVELOPER_V3_PATH: string;
    static RESELLER_V3_KEY: string;
    static RESELLER_V3_PATH: string;
    static MERCHANT_V2_KEY: string;
    static MERCHANT_V2_PATH: string;
    static MERCHANT_V3_KEY: string;
    static MERCHANT_V3_PATH: string;
    static APPS_V3_KEY: string;
    static APPS_V3_PATH: string;
    static ORDER_PATH: string;
    static ORDER_ID_KEY: string;
    static ORDER_ID_PATH: string;
    static LINE_ITEM_PATH: string;
    static LINE_ITEM_ID_KEY: string;
    static LINE_ITEM_ID_PATH: string;
    static DEVICE_PATH: string;
    static DEVICE_ID_KEY: string;
    static DEVICE_ID_PATH: string;
    static REMOTE_PAY_PATH: string;
    static WEBSOCKET_PATH: string;
    static WEBSOCKET_TOKEN_KEY: string;
    static WEBSOCKET_TOKEN_SUFFIX: string;
    static WEBSOCKET_FRIENDLY_ID_KEY: string;
    static WEBSOCKET_FRIENDLY_ID_SUFFIX: string;
    static WEBSOCKET_FORCE_CONNECT_ID_KEY: string;
    static WEBSOCKET_FORCE_CONNECT_ID_SUFFIX: string;
    static OAUTH_PATH: string;
    static OAUTH_CLIENT_ID_KEY: string;
    static OAUTH_CLIENT_ID_SUFFIX: string;
    static OAUTH_MERCHANT_ID_KEY: string;
    static OAUTH_MERCHANT_ID_SUFFIX: string;
    static OAUTH_REDIRECT_URI_KEY: string;
    static OAUTH_REDIRECT_URI_SUFFIX: string;
    static DOMAIN_KEY: string;
    static DOMAIN_PATH: string;
    /**
     * Builds the OAuth url to get an OAuth token.
     *
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} clientId - the clover application uuid
     * @param {string} [merchantId] - the clover merchant id
     * @param {string} [redirectUri] - the url to redirect to after authentication
     * @returns {string}
     */
    static getOAuthURL(domain: string, clientId: string, merchantId?: string, redirectUri?: string): string;
    /**
     * The endpoint used to connect to a websocket on the server that will proxy to a device.  Used by
     * remote-pay cloud connectors.
     *
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} wsToken - the token used to contact the device.
     * @param {string} friendlyId - an id used to identify the POS.
     * @param {boolean} forceConnect - if true, then the attempt will overtake any existing connection
     * @returns {string} The endpoint used to connect to a websocket on the server that will proxy to a device
     */
    static getDeviceWebSocketEndpoint(domain: string, wsToken: string, friendlyId: string, forceConnect: boolean): string;
    /**
     * The endpoint used to obtain a merchant
     *
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} merchantId - the id of the merchant to use when getting the merchant.
     * @param {string} accessToken - the OAuth token used when accessing the server
     * @returns {string} endpoint - the url to use to retrieve the merchant
     */
    static getMerchantEndpoint(domain: string, merchantId: string, accessToken: string): string;
    /**
     * The endpoint used to obtain a list of devices
     *
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} merchantId - the id of the merchant to use when getting the merchant.
     * @param {string} accessToken - the OAuth token used when accessing the server
     * @returns {string}
     */
    static getDevicesEndpoint(domain: string, merchantId: string, accessToken: string): string;
    /**
     * Builds the endpoint to send the message to the server to let the device know we want to talk to it.
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} merchantId - the id of the merchant to use when getting the merchant.
     * @param {string} accessToken - the OAuth token used when accessing the server
     * @returns {string} endpoint - the url to use alert a device that we want to communicate with it
     */
    static getAlertDeviceEndpoint(domain: string, merchantId: string, accessToken: string): string;
    /**
     * Does variable replacement on a template
     *
     * @private
     * @param {string} template - a template string that will have tags replaced
     * @param {map} variableMap - a named map of tag to value for the replacement process
     * @returns {string}
     */
    static setVariables(template: string, variableMap: any): string;
    private static appendTrailingSlashToDomain(domain);
    /**
     *
     * Does simple escaping to facilitate string replacement in a url
     * @param {string} stringToGoIntoTheRegex - the unescaped regex
     * @returns {XML|string|void} - the escaped regex
     * @private
     */
    private static escapeRegExp(stringToGoIntoTheRegex);
}
