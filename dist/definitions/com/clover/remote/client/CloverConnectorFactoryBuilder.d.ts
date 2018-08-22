import { ICloverConnectorFactory } from './ICloverConnectorFactory';
/**
 * This allows the construction of factories that may produce connectors that behave differently based on the
 * version.
 *
 * Currently the default version will return a factory that is compatible with the 1.1.0 release.  If
 * VERSION_12 is specified in the configuration, then the factory returned is not browser dependant, and
 * can be used to produce a connector that is capable of a direct connection to the device via the
 * "Network Pay Display" app.
 */
export declare class CloverConnectorFactoryBuilder {
    static DEFAULT_VERSION: string;
    static VERSION_12: string;
    static FACTORY_VERSION: string;
    /**
     * Produces factories that are version specific.  The passed configuration object is used to determine the
     * factory returned.  If the configuration is null or the value of the property
     * CloverConnectorFactoryBuilder.FACTORY_VERSION is not recognized, then the factory returned is
     * compatible with the 1.1.0 version of remote-pay-cloud.
     *
     * @param configuration contains a property for CloverConnectorFactoryBuilder.FACTORY_VERSION, or null.
     * @returns {any}
     */
    static createICloverConnectorFactory(configuration: any): ICloverConnectorFactory;
}
