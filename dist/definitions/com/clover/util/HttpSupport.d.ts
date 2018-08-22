import { Logger } from '../remote/client/util/Logger';
/**
 * Interface used to abstract implementation details to allow for NodeJS and
 * Browser usage of the library.
 *
 */
export declare class HttpSupport {
    protected logger: Logger;
    /**
     * This is the xmlhttprequest implementation.  This is odd,
     * but it is how we can keep ourselves from being tied to a browser.
     *
     * A NodeJS app that uses this library would pass in a different
     * object than a browser implementation.  NodeJS has an object that
     * satisfies the requirements of the xmlhttprequest (looks the same).
     *
     * https://www.npmjs.com/package/xmlhttprequest
     */
    xmlHttpImplClass: any;
    constructor(xmlHttpImplClass: any);
    private setXmlHttpCallback(xmlHttpInst, endpoint, onDataLoaded, onError);
    /**
     * Make the REST call to get the data
     */
    doXmlHttp(method: string, endpoint: string, onDataLoaded: Function, onError: Function): void;
    doXmlHttpSendJson(method: string, sendData: any, endpoint: string, onDataLoaded: Function, onError: Function, additionalHeaders?: any): void;
    /**
     * Make the REST call to get the data
     */
    postData(endpoint: string, onDataLoaded: Function, onError: Function, sendData: any, additionalHeaders?: any): void;
    /**
     * Make the REST call to get the data
     */
    getData(endpoint: string, onDataLoaded: Function, onError: Function): void;
    /**
     * Make the REST call to get the data
     */
    options(endpoint: string, onDataLoaded: Function, onError: Function): void;
    /**
     * Make the REST call to get the data
     */
    putData(endpoint: string, onDataLoaded: Function, onError: Function, sendData: any): void;
    /**
     * Make the REST call to get the data
     */
    deleteData(endpoint: string, onDataLoaded: Function, onError: Function): void;
}
