"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CloverConnectorFactoryV2_1 = require("./CloverConnectorFactoryV2");
var CloverConnectorFactory_1 = require("./CloverConnectorFactory");
/**
 * This allows the construction of factories that may produce connectors that behave differently based on the
 * version.
 *
 * Currently the default version will return a factory that is compatible with the 1.1.0 release.  If
 * VERSION_12 is specified in the configuration, then the factory returned is not browser dependant, and
 * can be used to produce a connector that is capable of a direct connection to the device via the
 * "Network Pay Display" app.
 */
var CloverConnectorFactoryBuilder = (function () {
    function CloverConnectorFactoryBuilder() {
    }
    /**
     * Produces factories that are version specific.  The passed configuration object is used to determine the
     * factory returned.  If the configuration is null or the value of the property
     * CloverConnectorFactoryBuilder.FACTORY_VERSION is not recognized, then the factory returned is
     * compatible with the 1.1.0 version of remote-pay-cloud.
     *
     * @param configuration contains a property for CloverConnectorFactoryBuilder.FACTORY_VERSION, or null.
     * @returns {any}
     */
    CloverConnectorFactoryBuilder.createICloverConnectorFactory = function (configuration) {
        if (configuration && configuration[CloverConnectorFactoryBuilder.FACTORY_VERSION]) {
            if (configuration[CloverConnectorFactoryBuilder.FACTORY_VERSION] == CloverConnectorFactoryBuilder.VERSION_12) {
                return new CloverConnectorFactoryV2_1.CloverConnectorFactoryV2();
            }
            console.error("Factory version specified, but not found!", configuration);
        }
        else {
            // Technically the oldest version, only supports browser compatible connectors.
            return new CloverConnectorFactory_1.CloverConnectorFactory();
        }
    };
    CloverConnectorFactoryBuilder.DEFAULT_VERSION = "DEFAULT";
    CloverConnectorFactoryBuilder.VERSION_12 = "VERSION_12";
    CloverConnectorFactoryBuilder.FACTORY_VERSION = "FACTORY_VERSION";
    return CloverConnectorFactoryBuilder;
}());
exports.CloverConnectorFactoryBuilder = CloverConnectorFactoryBuilder;

//# sourceMappingURL=../../../../maps/com/clover/remote/client/CloverConnectorFactoryBuilder.js.map
