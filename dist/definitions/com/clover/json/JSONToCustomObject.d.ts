/**
 * A generic parser to take annotated javascript objects and populate them with
 * raw json data.
 *
 */
export declare class JSONToCustomObject {
    private log;
    constructor();
    /**
     * Copies properties from a plain JavaScript object (sourceObject) into a remote-pay-cloud-api
     * object (targetObject) that contains meta information.
     *
     * Sample call:
     *
     *  const saleRequestJSON = {
     *    amount: 5000,
     *    cardEntryMethods: 1,
     *    externalId: "testexternal",
     *    tipMode: "NO_TIP"
     *  };
     *
     *  const saleRequest = new sdk.remotepay.SaleRequest();
     *  new JSONToCustomObject.transfertoObject(saleRequestJSON, saleRequest, true);
     *
     * @param {Object} sourceObject - A plain JavaScript Object.
     * @param {Object} targetObject - Generally an sdk object that has meta information (getter/setters, etc.)
     * @param attachUnknownProperties - if true, then properties that are not recognized will still be
     *  attached to the returned object, or; if the top level targetObject has no meta information,
     *  then a copy of the passed sourceObject will be returned.
     * @returns {Object | null}
     */
    transfertoObject(sourceObject: any, targetObject: any, attachUnknownProperties: boolean): any;
    isPrimitive: (metaInfo: any) => boolean;
    isArray: (metaInfo: any) => boolean;
    isObject: (metaInfo: any) => boolean;
    getArrayType: (metaInfo: any) => any;
    /**
     * Not used much.  Could be here for a map, but really do not want to see a map...
     * @param metaInfo
     * @returns {string}
     */
    getValueType: (metaInfo: any) => any;
    private hasMetaInfo;
}
