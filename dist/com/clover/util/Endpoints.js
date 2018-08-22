"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility to centralize endpoints.
 *
 * This simplifies building urls to contact services.  If there is a need to add
 * a call to a service on the server, it should be added here.
 *
 */
var Endpoints = (function () {
    function Endpoints() {
    }
    /**
     * Builds the OAuth url to get an OAuth token.
     *
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} clientId - the clover application uuid
     * @param {string} [merchantId] - the clover merchant id
     * @param {string} [redirectUri] - the url to redirect to after authentication
     * @returns {string}
     */
    Endpoints.getOAuthURL = function (domain, clientId, merchantId, redirectUri) {
        var variables = {};
        variables[Endpoints.DOMAIN_KEY] = domain;
        variables[Endpoints.OAUTH_CLIENT_ID_KEY] = clientId;
        var oauthEndpointPath = Endpoints.DOMAIN_PATH + Endpoints.OAUTH_PATH + Endpoints.OAUTH_CLIENT_ID_SUFFIX;
        if (merchantId) {
            variables[Endpoints.OAUTH_MERCHANT_ID_KEY] = merchantId;
            oauthEndpointPath += Endpoints.OAUTH_MERCHANT_ID_SUFFIX;
        }
        if (redirectUri) {
            variables[Endpoints.OAUTH_REDIRECT_URI_KEY] = encodeURIComponent(redirectUri);
            oauthEndpointPath += Endpoints.OAUTH_REDIRECT_URI_SUFFIX;
        }
        return Endpoints.setVariables(oauthEndpointPath, variables);
    };
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
    Endpoints.getDeviceWebSocketEndpoint = function (domain, wsToken, friendlyId, forceConnect) {
        var variables = {};
        variables[Endpoints.WEBSOCKET_TOKEN_KEY] = wsToken;
        variables[Endpoints.DOMAIN_KEY] = domain;
        variables[Endpoints.WEBSOCKET_FRIENDLY_ID_KEY] = friendlyId;
        variables[Endpoints.WEBSOCKET_FORCE_CONNECT_ID_KEY] = forceConnect;
        var merchantEndpointPath = Endpoints.DOMAIN_PATH + Endpoints.WEBSOCKET_PATH +
            Endpoints.WEBSOCKET_TOKEN_SUFFIX +
            Endpoints.WEBSOCKET_FRIENDLY_ID_SUFFIX +
            Endpoints.WEBSOCKET_FORCE_CONNECT_ID_SUFFIX;
        return Endpoints.setVariables(merchantEndpointPath, variables);
    };
    /**
     * The endpoint used to obtain a merchant
     *
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} merchantId - the id of the merchant to use when getting the merchant.
     * @param {string} accessToken - the OAuth token used when accessing the server
     * @returns {string} endpoint - the url to use to retrieve the merchant
     */
    Endpoints.getMerchantEndpoint = function (domain, merchantId, accessToken) {
        var variables = {};
        variables[Endpoints.MERCHANT_V3_KEY] = merchantId;
        variables[Endpoints.ACCESS_TOKEN_KEY] = accessToken;
        variables[Endpoints.DOMAIN_KEY] = domain;
        var merchantEndpointPath = Endpoints.DOMAIN_PATH + Endpoints.MERCHANT_V3_PATH + Endpoints.ACCESS_TOKEN_SUFFIX;
        return Endpoints.setVariables(merchantEndpointPath, variables);
    };
    /**
     * The endpoint used to obtain a list of devices
     *
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} merchantId - the id of the merchant to use when getting the merchant.
     * @param {string} accessToken - the OAuth token used when accessing the server
     * @returns {string}
     */
    Endpoints.getDevicesEndpoint = function (domain, merchantId, accessToken) {
        var variables = {};
        variables[Endpoints.MERCHANT_V3_KEY] = merchantId;
        variables[Endpoints.ACCESS_TOKEN_KEY] = accessToken;
        variables[Endpoints.DOMAIN_KEY] = domain;
        var devicesEndpointPath = Endpoints.DOMAIN_PATH + Endpoints.DEVICE_PATH + Endpoints.ACCESS_TOKEN_SUFFIX;
        return Endpoints.setVariables(devicesEndpointPath, variables);
    };
    /**
     * Builds the endpoint to send the message to the server to let the device know we want to talk to it.
     * @param {string} domain - the clover server.  EX: https://www.clover.com, http://localhost:9000
     * @param {string} merchantId - the id of the merchant to use when getting the merchant.
     * @param {string} accessToken - the OAuth token used when accessing the server
     * @returns {string} endpoint - the url to use alert a device that we want to communicate with it
     */
    Endpoints.getAlertDeviceEndpoint = function (domain, merchantId, accessToken) {
        var variables = {};
        variables[Endpoints.MERCHANT_V3_KEY] = merchantId;
        variables[Endpoints.ACCESS_TOKEN_KEY] = accessToken;
        variables[Endpoints.DOMAIN_KEY] = domain;
        var alertDeviceEndpointPath = Endpoints.DOMAIN_PATH + Endpoints.REMOTE_PAY_PATH + Endpoints.ACCESS_TOKEN_SUFFIX;
        return Endpoints.setVariables(alertDeviceEndpointPath, variables);
    };
    /**
     * Does variable replacement on a template
     *
     * @private
     * @param {string} template - a template string that will have tags replaced
     * @param {map} variableMap - a named map of tag to value for the replacement process
     * @returns {string}
     */
    Endpoints.setVariables = function (template, variableMap) {
        for (var key in variableMap) {
            if (variableMap.hasOwnProperty(key)) {
                var bracedKey = new RegExp(this.escapeRegExp("{" + key + "}"), "g");
                // If the value of DOMAIN_KEY does not have a trailing slash, add one.
                if (key === Endpoints.DOMAIN_KEY) {
                    variableMap[key] = Endpoints.appendTrailingSlashToDomain(variableMap[key]);
                }
                template = template.replace(bracedKey, variableMap[key]);
            }
        }
        return template;
    };
    ;
    Endpoints.appendTrailingSlashToDomain = function (domain) {
        if (domain && domain.charAt(domain.length - 1) !== '/') {
            return domain + "/";
        }
        return domain;
    };
    /**
     *
     * Does simple escaping to facilitate string replacement in a url
     * @param {string} stringToGoIntoTheRegex - the unescaped regex
     * @returns {XML|string|void} - the escaped regex
     * @private
     */
    Endpoints.escapeRegExp = function (stringToGoIntoTheRegex) {
        return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    Endpoints.ACCESS_TOKEN_KEY = "axsTkn";
    Endpoints.ACCESS_TOKEN_SUFFIX = "?access_token={" + Endpoints.ACCESS_TOKEN_KEY + "}";
    Endpoints.ACCOUNT_V3_KEY = "acntId";
    Endpoints.ACCOUNT_V3_PATH = "v3/accounts/{" + Endpoints.ACCOUNT_V3_KEY + "}";
    Endpoints.DEVELOPER_V3_KEY = "dId";
    Endpoints.DEVELOPER_V3_PATH = "v3/developers/{" + Endpoints.DEVELOPER_V3_KEY + "}";
    Endpoints.RESELLER_V3_KEY = "rId";
    Endpoints.RESELLER_V3_PATH = "v3/resellers/{" + Endpoints.RESELLER_V3_KEY + "}";
    Endpoints.MERCHANT_V2_KEY = "mId";
    Endpoints.MERCHANT_V2_PATH = "v2/merchant/{" + Endpoints.MERCHANT_V2_KEY + "}";
    Endpoints.MERCHANT_V3_KEY = "mId";
    Endpoints.MERCHANT_V3_PATH = "v3/merchants/{" + Endpoints.MERCHANT_V3_KEY + "}";
    Endpoints.APPS_V3_KEY = "appId";
    Endpoints.APPS_V3_PATH = "v3/apps/{" + Endpoints.APPS_V3_KEY + "}";
    Endpoints.ORDER_PATH = Endpoints.MERCHANT_V3_PATH + "/orders";
    Endpoints.ORDER_ID_KEY = "appId";
    Endpoints.ORDER_ID_PATH = Endpoints.ORDER_PATH + "/{" + Endpoints.ORDER_ID_KEY + "}";
    Endpoints.LINE_ITEM_PATH = Endpoints.ORDER_ID_PATH + "/line_items";
    Endpoints.LINE_ITEM_ID_KEY = "lniId";
    Endpoints.LINE_ITEM_ID_PATH = Endpoints.LINE_ITEM_PATH + "/{" + Endpoints.LINE_ITEM_ID_KEY + "}";
    Endpoints.DEVICE_PATH = Endpoints.MERCHANT_V3_PATH + "/devices";
    Endpoints.DEVICE_ID_KEY = "devId";
    Endpoints.DEVICE_ID_PATH = Endpoints.DEVICE_PATH + "/{" + Endpoints.DEVICE_ID_KEY + "}";
    Endpoints.REMOTE_PAY_PATH = Endpoints.MERCHANT_V2_PATH + "/remote_pay";
    Endpoints.WEBSOCKET_PATH = "support/remote_pay/cs";
    Endpoints.WEBSOCKET_TOKEN_KEY = "wsTkn";
    Endpoints.WEBSOCKET_TOKEN_SUFFIX = "?token={" + Endpoints.WEBSOCKET_TOKEN_KEY + "}";
    Endpoints.WEBSOCKET_FRIENDLY_ID_KEY = "wsFriendlyId";
    Endpoints.WEBSOCKET_FRIENDLY_ID_SUFFIX = "&friendlyId={" + Endpoints.WEBSOCKET_FRIENDLY_ID_KEY + "}";
    Endpoints.WEBSOCKET_FORCE_CONNECT_ID_KEY = "wsForceConnect";
    Endpoints.WEBSOCKET_FORCE_CONNECT_ID_SUFFIX = "&forceConnect={" + Endpoints.WEBSOCKET_FORCE_CONNECT_ID_KEY + "}";
    Endpoints.OAUTH_PATH = "oauth/authorize?response_type=token";
    Endpoints.OAUTH_CLIENT_ID_KEY = "client_id";
    Endpoints.OAUTH_CLIENT_ID_SUFFIX = "&client_id={" + Endpoints.OAUTH_CLIENT_ID_KEY + "}";
    Endpoints.OAUTH_MERCHANT_ID_KEY = "merchant_id";
    Endpoints.OAUTH_MERCHANT_ID_SUFFIX = "&merchant_id={" + Endpoints.OAUTH_MERCHANT_ID_KEY + "}";
    Endpoints.OAUTH_REDIRECT_URI_KEY = "redirect_uri";
    Endpoints.OAUTH_REDIRECT_URI_SUFFIX = "&redirect_uri={" + Endpoints.OAUTH_REDIRECT_URI_KEY + "}";
    Endpoints.DOMAIN_KEY = "server_url";
    Endpoints.DOMAIN_PATH = "{server_url}";
    return Endpoints;
}());
exports.Endpoints = Endpoints;

//# sourceMappingURL=../../../maps/com/clover/util/Endpoints.js.map
