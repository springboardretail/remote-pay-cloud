import * as sdk from 'remote-pay-cloud-api';
import { CloverDeviceConfiguration } from './device/CloverDeviceConfiguration';
import { ICloverConnectorFactory } from './ICloverConnectorFactory';
/**
 * Produces ICloverConnector objects that can be configured using CloverDeviceConfiguration objects.
 *
 * The connectors produced are dependant on the configuration and can be used to connect directly to
 * the device from a Web Browser, or via the Cloud.  They can also be used to connect directly to the
 * device or through the cloud using a NodeJS application.
 *
 */
export declare class CloverConnectorFactoryV2 implements ICloverConnectorFactory {
    constructor();
    /**
     * Produces a ICloverConnector given a configuration.
     *
     * @param configuration - a configuration that determines how the connector connects to the device
     * @returns {CloverConnector}
     */
    createICloverConnector(configuration: CloverDeviceConfiguration): sdk.remotepay.ICloverConnector;
}
