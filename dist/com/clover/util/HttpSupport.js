"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../remote/client/util/Logger");
/**
 * Interface used to abstract implementation details to allow for NodeJS and
 * Browser usage of the library.
 *
 */
var HttpSupport = (function () {
    function HttpSupport(xmlHttpImplClass) {
        // Create a logger - when we need it
        this.logger = Logger_1.Logger.create();
        this.xmlHttpImplClass = xmlHttpImplClass;
    }
    HttpSupport.prototype.setXmlHttpCallback = function (xmlHttpInst, endpoint, onDataLoaded, onError) {
        xmlHttpInst.onreadystatechange = function () {
            if (xmlHttpInst.readyState == 4) {
                if (xmlHttpInst.status == 200) {
                    try {
                        if (onDataLoaded) {
                            var data = null;
                            if (xmlHttpInst.responseText && xmlHttpInst.responseText != "") {
                                data = JSON.parse(xmlHttpInst.responseText);
                            }
                            onDataLoaded(data, xmlHttpInst);
                        }
                    }
                    catch (e) {
                        this.logger.error(endpoint, e);
                        if (onDataLoaded) {
                            onDataLoaded({});
                        }
                    }
                }
                else {
                    if (onError) {
                        onError({
                            message: "status returned was not 200",
                            endpoint: endpoint,
                            status: xmlHttpInst.status
                        });
                    }
                }
            }
            else {
            }
        }.bind(this);
    };
    /**
     * Make the REST call to get the data
     */
    HttpSupport.prototype.doXmlHttp = function (method, endpoint, onDataLoaded, onError) {
        var xmlHttp = new this.xmlHttpImplClass();
        this.setXmlHttpCallback(xmlHttp, endpoint, onDataLoaded, onError);
        xmlHttp.open(method, endpoint, true);
        // Handle the following Firefox bug - https://bugzilla.mozilla.org/show_bug.cgi?id=433859#c4
        // This check can only be performed in a browser environment so make sure navigator is defined first.
        if (typeof (navigator) !== "undefined" && navigator.userAgent.search("Firefox")) {
            xmlHttp.setRequestHeader("Accept", "*/*");
        }
        xmlHttp.send();
    };
    HttpSupport.prototype.doXmlHttpSendJson = function (method, sendData, endpoint, onDataLoaded, onError, additionalHeaders) {
        var xmlHttp = new this.xmlHttpImplClass();
        this.setXmlHttpCallback(xmlHttp, endpoint, onDataLoaded, onError);
        xmlHttp.open(method, endpoint, true);
        if (additionalHeaders) {
            for (var key in additionalHeaders) {
                if (additionalHeaders.hasOwnProperty(key)) {
                    xmlHttp.setRequestHeader(key, additionalHeaders[key]);
                }
            }
        }
        if (sendData) {
            xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            var sendDataStr = JSON.stringify(sendData);
            xmlHttp.send(sendDataStr);
        }
        else {
            xmlHttp.send();
        }
    };
    /**
     * Make the REST call to get the data
     */
    HttpSupport.prototype.postData = function (endpoint, onDataLoaded, onError, sendData, additionalHeaders) {
        this.doXmlHttpSendJson("POST", sendData, endpoint, onDataLoaded, onError, additionalHeaders);
    };
    /**
     * Make the REST call to get the data
     */
    HttpSupport.prototype.getData = function (endpoint, onDataLoaded, onError) {
        this.doXmlHttp("GET", endpoint, onDataLoaded, onError);
    };
    /**
     * Make the REST call to get the data
     */
    HttpSupport.prototype.options = function (endpoint, onDataLoaded, onError) {
        this.doXmlHttp("OPTIONS", endpoint, onDataLoaded, onError);
    };
    /**
     * Make the REST call to get the data
     */
    HttpSupport.prototype.putData = function (endpoint, onDataLoaded, onError, sendData) {
        this.doXmlHttpSendJson("PUT", sendData, endpoint, onDataLoaded, onError);
    };
    /**
     * Make the REST call to get the data
     */
    HttpSupport.prototype.deleteData = function (endpoint, onDataLoaded, onError) {
        this.doXmlHttp("DELETE", endpoint, onDataLoaded, onError);
    };
    return HttpSupport;
}());
exports.HttpSupport = HttpSupport;

//# sourceMappingURL=../../../maps/com/clover/util/HttpSupport.js.map
