/**
 * Clover Device Factory
 *
 * The clover device factory returns new clover devices.
 */
export declare class CloverDeviceFactory {
    constructor();
    /**
     * Returns a new clover device based on the configuration
     *
     * @param {CloverDeviceConfiguration} configuration
     * @returns CloverDevice
     */
    static get(configuration: any): any;
}
