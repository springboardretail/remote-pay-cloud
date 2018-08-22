import * as sdk from 'remote-pay-cloud-api';
import { ICloverConnectorFactory } from './ICloverConnectorFactory';
import { CloverConnector } from './CloverConnector';
/**
 * This is for backwards compatibility.  It will not work for non-browser!!!
 *
 * This is the equivalent of the old way we created and ran the cloud.
 */
export declare class CloverConnectorFactory implements ICloverConnectorFactory {
    constructor();
    createICloverConnector(configuration: any): sdk.remotepay.ICloverConnector;
}
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
export declare class LegacyCloverConnector extends CloverConnector {
    legacyConfiguration: any;
    private urlParamsInfo;
    static _accessTokenKey: string;
    static accessTokenKey: string;
    static URL_MERCHANT_ID_KEY: string;
    private httpSupport;
    private imageUtil;
    constructor(legacyConfiguration: any);
    initializeConnection(): void;
    /**
     * Generates a WebSocketCloudCloverDeviceConfiguration with a "raw" configuration
     * @param rawConfiguration - a Json object that has values that can be used to construct the
     *  object configuration.
     */
    protected generateNewConfigurationAndInitialize(rawConfiguration: any): void;
    /**
     * Checks for a oauth token, does a redirect based on the configuration domain and
     * clientid if necessary, then moves on to #onceWeHaveTheAccessToken(...)
     *
     * @param configuration - the raw configuration object
     */
    protected initializeLegacyConnection(configuration: any): void;
    /**
     * Gets the merchantId, redirecting if necessary, then moves on to #getDeviceId(...)
     *
     * @param configuration - the raw configuration object
     */
    private onceWeHaveTheAccessToken(configuration);
    /**
     * Gets the deviceId, calling the webservice to get the device list if necessary.
     * If the deviceId is not set, and the deviceSerialId is not set, then this will call
     * notify of an error. If the deviceId is not set, and the deviceSerialId is set then
     * the call to get the devices is made the result is used to build a mapping that is
     * passed to handleDeviceResult.
     *
     * @param configuration - the raw configuration object
     */
    private getDeviceId(configuration);
    /**
     * Builds a mapping of the passed set of devices, from the device serial number to the device.
     *
     * @param devicesVX
     * @returns {{}} the mapping from the device serial number to the device
     */
    protected static buildMapOfSerialToDevice(devicesVX: any): any;
    /**
     * Uses the mapping of devices to find the correct deviceId to use in the configuration.
     * This then moves on to generateNewConfigurationAndInitialize.
     *
     * @param devices
     * @param configuration
     */
    protected handleDeviceResult(devices: any, configuration: any): void;
    /**
     * Get the merchantId or redirect.
     *
     * @param configuration
     * @returns {string|any}
     */
    private getMerchantId(configuration);
    /**
     * Get the access token, either from the configuration or from the window URL, or redirect.
     *
     * @param configuration
     * @returns {null}
     */
    private getAccessToken(configuration);
    private static redirect(configuration);
    private parseWindowURL();
    private parseURL(windowLocationObject);
    private parseStuff(params);
}
