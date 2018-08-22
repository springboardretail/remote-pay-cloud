"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CloverConnector_1 = require("./CloverConnector");
/**
 * Produces ICloverConnector objects that can be configured using CloverDeviceConfiguration objects.
 *
 * The connectors produced are dependant on the configuration and can be used to connect directly to
 * the device from a Web Browser, or via the Cloud.  They can also be used to connect directly to the
 * device or through the cloud using a NodeJS application.
 *
 */
var CloverConnectorFactoryV2 = (function () {
    function CloverConnectorFactoryV2() {
    }
    /**
     * Produces a ICloverConnector given a configuration.
     *
     * @param configuration - a configuration that determines how the connector connects to the device
     * @returns {CloverConnector}
     */
    CloverConnectorFactoryV2.prototype.createICloverConnector = function (configuration) {
        return new CloverConnector_1.CloverConnector(configuration);
    };
    return CloverConnectorFactoryV2;
}());
exports.CloverConnectorFactoryV2 = CloverConnectorFactoryV2;

//# sourceMappingURL=../../../../maps/com/clover/remote/client/CloverConnectorFactoryV2.js.map
