"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sdk = require("remote-pay-cloud-api");
var WebSocketCloudCloverDeviceConfiguration_1 = require("./device/WebSocketCloudCloverDeviceConfiguration");
var Endpoints_1 = require("../../util/Endpoints");
var HttpSupport_1 = require("../../util/HttpSupport");
var CloverConnector_1 = require("./CloverConnector");
var BrowserWebSocketImpl_1 = require("../../websocket/BrowserWebSocketImpl");
var ImageUtil_1 = require("../../util/ImageUtil");
/**
 * This is for backwards compatibility.  It will not work for non-browser!!!
 *
 * This is the equivalent of the old way we created and ran the cloud.
 */
var CloverConnectorFactory = (function () {
    function CloverConnectorFactory() {
    }
    CloverConnectorFactory.prototype.createICloverConnector = function (configuration) {
        return new LegacyCloverConnector(configuration);
    };
    return CloverConnectorFactory;
}());
exports.CloverConnectorFactory = CloverConnectorFactory;
/**
 * This connector uses Browser specific objects to work in a manner compatible with the
 * 1.1.0 implementation of the ICloverConnector.
 *
 * It uses the domain && clientId to get the oauthtoken, then gets the merchantId,
 * and the deviceId.  This process may involve redirection of the page, and XHR requests,
 * all of which are performed using default Browser objects.
 *
 * Once these values have been obtained, a new WebSocketCloudCloverDeviceConfiguration is
 * generated using the default Browser WebSocket implementation, and the connector is initialized.
 *
 */
var LegacyCloverConnector = (function (_super) {
    __extends(LegacyCloverConnector, _super);
    function LegacyCloverConnector(legacyConfiguration) {
        var _this = _super.call(this, null) || this;
        _this.urlParamsInfo = null;
        _this.httpSupport = new HttpSupport_1.HttpSupport(XMLHttpRequest);
        _this.imageUtil = new ImageUtil_1.ImageUtil();
        _this.legacyConfiguration = legacyConfiguration;
        return _this;
    }
    LegacyCloverConnector.prototype.initializeConnection = function () {
        if (this.device == null) {
            this.initializeLegacyConnection(this.legacyConfiguration);
        }
    };
    /**
     * Generates a WebSocketCloudCloverDeviceConfiguration with a "raw" configuration
     * @param rawConfiguration - a Json object that has values that can be used to construct the
     *  object configuration.
     */
    LegacyCloverConnector.prototype.generateNewConfigurationAndInitialize = function (rawConfiguration) {
        var newConfig = new WebSocketCloudCloverDeviceConfiguration_1.WebSocketCloudCloverDeviceConfiguration(rawConfiguration.remoteApplicationId, BrowserWebSocketImpl_1.BrowserWebSocketImpl.createInstance, this.imageUtil, rawConfiguration.domain, rawConfiguration.oauthToken, this.httpSupport, rawConfiguration.merchantId, rawConfiguration.deviceId, rawConfiguration.friendlyId, rawConfiguration.forceConnect);
        if (this.device == null) {
            this.initialize(newConfig);
        }
    };
    /**
     * Checks for a oauth token, does a redirect based on the configuration domain and
     * clientid if necessary, then moves on to #onceWeHaveTheAccessToken(...)
     *
     * @param configuration - the raw configuration object
     */
    LegacyCloverConnector.prototype.initializeLegacyConnection = function (configuration) {
        if (configuration.oauthToken) {
            this.onceWeHaveTheAccessToken(configuration);
        }
        else {
            // We MUST have the domain and clientId, or we are unable to go on.
            if (configuration.domain && configuration.clientId) {
                // The following will return the token, or else the page will redirect.
                configuration.oauthToken = this.getAccessToken(configuration);
                this.onceWeHaveTheAccessToken(configuration);
            }
            else {
                var errorResponse = new sdk.remotepay.CloverDeviceErrorEvent();
                errorResponse.setCode(sdk.remotepay.DeviceErrorEventCode.InvalidConfig);
                errorResponse.setType(sdk.remotepay.ErrorType.EXCEPTION);
                errorResponse.setMessage("Both 'clientId' and 'domain' are unset.  Cannot initialize.");
                this.broadcaster.notifyOnDeviceError(errorResponse);
            }
        }
    };
    /**
     * Gets the merchantId, redirecting if necessary, then moves on to #getDeviceId(...)
     *
     * @param configuration - the raw configuration object
     */
    LegacyCloverConnector.prototype.onceWeHaveTheAccessToken = function (configuration) {
        // If we had the oauth token, but we do not have the merchantId, this will redirect
        configuration.merchantId = this.getMerchantId(configuration);
        // We need the deviceId in order to send the notification.
        if (configuration.deviceId) {
            this.generateNewConfigurationAndInitialize(configuration);
        }
        else {
            this.getDeviceId(configuration);
        }
    };
    /**
     * Gets the deviceId, calling the webservice to get the device list if necessary.
     * If the deviceId is not set, and the deviceSerialId is not set, then this will call
     * notify of an error. If the deviceId is not set, and the deviceSerialId is set then
     * the call to get the devices is made the result is used to build a mapping that is
     * passed to handleDeviceResult.
     *
     * @param configuration - the raw configuration object
     */
    LegacyCloverConnector.prototype.getDeviceId = function (configuration) {
        if (configuration.deviceSerialId || configuration.deviceId) {
            if (configuration.deviceId) {
                this.generateNewConfigurationAndInitialize(configuration);
            }
            else {
                var devicesEndpoint = Endpoints_1.Endpoints.getDevicesEndpoint(configuration.domain, configuration.merchantId, configuration.oauthToken);
                this.httpSupport.getData(devicesEndpoint, function (devices) {
                    this.handleDeviceResult(LegacyCloverConnector.buildMapOfSerialToDevice(devices), configuration);
                }.bind(this), function (error) {
                    var errorResponse = new sdk.remotepay.CloverDeviceErrorEvent();
                    errorResponse.setCode(sdk.remotepay.DeviceErrorEventCode.InvalidConfig);
                    errorResponse.setType(sdk.remotepay.ErrorType.EXCEPTION);
                    errorResponse.setMessage(JSON.stringify({ "Error retreiving devices:": error }, null, '\t'));
                    this.broadcaster.notifyOnDeviceError(errorResponse);
                }.bind(this));
            }
        }
        else {
            var errorResponse = new sdk.remotepay.CloverDeviceErrorEvent();
            errorResponse.setCode(sdk.remotepay.DeviceErrorEventCode.InvalidConfig);
            errorResponse.setType(sdk.remotepay.ErrorType.EXCEPTION);
            errorResponse.setMessage("Neither 'deviceId' or 'deviceSerialId' passed, one must be set.  Cannot initialize.");
            this.broadcaster.notifyOnDeviceError(errorResponse);
        }
    };
    /**
     * Builds a mapping of the passed set of devices, from the device serial number to the device.
     *
     * @param devicesVX
     * @returns {{}} the mapping from the device serial number to the device
     */
    LegacyCloverConnector.buildMapOfSerialToDevice = function (devicesVX) {
        var devices = null;
        var deviceBySerial = {};
        // depending on the version of the call, the devices might be in a slightly different format.
        // We would need to determine what devices were capable of doing what we want.  This means we
        // need to know if the device has the websocket connection enabled.  The best way to do this is
        // to make a different REST call, but we could filter the devices here.
        if (devicesVX['devices']) {
            devices = devicesVX.devices;
        }
        else if (devicesVX['elements']) {
            devices = devicesVX.elements;
        }
        if (devices) {
            var i;
            for (i = 0; i < devices.length; i++) {
                deviceBySerial[devices[i].serial] = devices[i];
            }
        }
        return deviceBySerial;
    };
    /**
     * Uses the mapping of devices to find the correct deviceId to use in the configuration.
     * This then moves on to generateNewConfigurationAndInitialize.
     *
     * @param devices
     * @param configuration
     */
    LegacyCloverConnector.prototype.handleDeviceResult = function (devices, configuration) {
        var myDevice = devices[configuration.deviceSerialId];
        if (null == myDevice) {
            var errorResponse = new sdk.remotepay.CloverDeviceErrorEvent();
            errorResponse.setCode(sdk.remotepay.DeviceErrorEventCode.InvalidConfig);
            errorResponse.setType(sdk.remotepay.ErrorType.EXCEPTION);
            errorResponse.setMessage("Cannot determine device to use.  " +
                "Device " + configuration.deviceSerialId + " not in set returned.");
            this.broadcaster.notifyOnDeviceError(errorResponse);
        }
        else {
            // Stations do not support the kiosk/pay display.
            // If the user has selected one, then print out a (loud) warning
            if (myDevice.model == "Clover_C100") {
                this.logger.warn("Warning - Selected device model (" +
                    devices[configuration.deviceSerialId].model +
                    ") does not support pay display." +
                    "  Will attempt to send notification to device, but no response" +
                    " should be expected.");
            }
            configuration.deviceId = myDevice.id;
            this.generateNewConfigurationAndInitialize(configuration);
        }
    };
    /**
     * Get the merchantId or redirect.
     *
     * @param configuration
     * @returns {string|any}
     */
    LegacyCloverConnector.prototype.getMerchantId = function (configuration) {
        if (!configuration.merchantId) {
            if (!this.urlParamsInfo) {
                if (configuration.domain && configuration.clientId) {
                    // We must have the merchant id.  This will make the merchant log in again.
                    this.getAccessToken(configuration);
                    var errorResponse = new sdk.remotepay.CloverDeviceErrorEvent();
                    errorResponse.setCode(sdk.remotepay.DeviceErrorEventCode.InvalidConfig);
                    errorResponse.setType(sdk.remotepay.ErrorType.EXCEPTION);
                    errorResponse.setMessage("Neither 'merchantId' or '" +
                        LegacyCloverConnector.URL_MERCHANT_ID_KEY + "' specified. Cannot initialize.");
                    this.broadcaster.notifyOnDeviceError(errorResponse);
                }
                else {
                    var errorResponse = new sdk.remotepay.CloverDeviceErrorEvent();
                    errorResponse.setCode(sdk.remotepay.DeviceErrorEventCode.InvalidConfig);
                    errorResponse.setType(sdk.remotepay.ErrorType.EXCEPTION);
                    errorResponse.setMessage("Both 'clientId' and 'domain' are unset.  Cannot initialize.");
                    this.broadcaster.notifyOnDeviceError(errorResponse);
                }
            }
            else {
                configuration.merchantId = this.urlParamsInfo[LegacyCloverConnector.URL_MERCHANT_ID_KEY];
            }
        }
        return configuration.merchantId;
    };
    /**
     * Get the access token, either from the configuration or from the window URL, or redirect.
     *
     * @param configuration
     * @returns {null}
     */
    LegacyCloverConnector.prototype.getAccessToken = function (configuration) {
        this.parseWindowURL();
        var token = null;
        if (this.urlParamsInfo) {
            token = this.urlParamsInfo[LegacyCloverConnector.accessTokenKey];
        }
        if (token == null) {
            // There is no token attempt to redirect
            LegacyCloverConnector.redirect(configuration);
        }
        return token;
    };
    LegacyCloverConnector.redirect = function (configuration) {
        var finalRedirect = window.location.href.replace(window.location.hash, '');
        var oAuthRedirectUrl = Endpoints_1.Endpoints.getOAuthURL(configuration.domain, configuration.clientId, null, finalRedirect);
        window.location.href = oAuthRedirectUrl;
    };
    LegacyCloverConnector.prototype.parseWindowURL = function () {
        if (!this.urlParamsInfo) {
            this.parseURL(window.location);
        }
    };
    LegacyCloverConnector.prototype.parseURL = function (windowLocationObject) {
        this.urlParamsInfo = {};
        var params = windowLocationObject.hash.split('&');
        this.parseStuff(params);
        var params2 = windowLocationObject.search.substr(1).split('&');
        this.parseStuff(params2);
    };
    LegacyCloverConnector.prototype.parseStuff = function (params) {
        var i = 0;
        var param = null;
        while (param = params[i++]) {
            var multiParam = param.split("=");
            this.urlParamsInfo[multiParam[0]] = multiParam[1];
            // Make sure the access_token is mapped with the hash infront,
            // and without.
            if (multiParam[0] === LegacyCloverConnector._accessTokenKey) {
                this.urlParamsInfo[LegacyCloverConnector.accessTokenKey] = multiParam[1];
            }
        }
    };
    LegacyCloverConnector._accessTokenKey = 'access_token';
    LegacyCloverConnector.accessTokenKey = '#' + LegacyCloverConnector._accessTokenKey;
    LegacyCloverConnector.URL_MERCHANT_ID_KEY = "merchant_id";
    return LegacyCloverConnector;
}(CloverConnector_1.CloverConnector));
exports.LegacyCloverConnector = LegacyCloverConnector;

//# sourceMappingURL=../../../../maps/com/clover/remote/client/CloverConnectorFactory.js.map
