/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotepay_DeviceEventState = require("../remotepay/DeviceEventState");
var remotepay_InputOption = require("../remotepay/InputOption");

  /**
  * @constructor
  * @memberof remotepay
  */
  CloverDeviceEvent = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof remotepay.CloverDeviceEvent
    * @private
    */
    initialize: function() {
      this._class_ = CloverDeviceEvent;
      this.message = undefined;
      this.code = undefined;
      this.eventState = undefined;
      this.inputOptions = undefined;
    },

    /**
    * Set the field value
    * Identifier for the request
    *
    * @memberof remotepay.CloverDeviceEvent
    * @param {String} message 
    */
    setMessage: function(message) {
      this.message = message;
    },

    /**
    * Get the field value
    * Identifier for the request
    * @memberof remotepay.CloverDeviceEvent
    * @return {String} 
    */
    getMessage: function() {
      return this.message;
    },

    /**
    * Set the field value
    * @memberof remotepay.CloverDeviceEvent
    * @param {Number} code must be an integer
    */
    setCode: function(code) {
      this.code = code;
    },

    /**
    * Get the field value
    * @memberof remotepay.CloverDeviceEvent
    * @return {Number} must be an integer
    */
    getCode: function() {
      return this.code;
    },

    /**
    * Set the field value
    * The event state
    *
    * @memberof remotepay.CloverDeviceEvent
    * @param {remotepay.DeviceEventState} eventState 
    */
    setEventState: function(eventState) {
      this.eventState = eventState;
    },

    /**
    * Get the field value
    * The event state
    * @memberof remotepay.CloverDeviceEvent
    * @return {remotepay.DeviceEventState} 
    */
    getEventState: function() {
      return this.eventState;
    },

    /**
    * Set the field value
    * Available input options
    *
    * @memberof remotepay.CloverDeviceEvent
    * @param {Array.<remotepay.InputOption>} inputOptions An array of 
    */
    setInputOptions: function(inputOptions) {
      this.inputOptions = inputOptions;
    },

    /**
    * Get the field value
    * Available input options
    * @memberof remotepay.CloverDeviceEvent
    * @return {Array.<remotepay.InputOption>} An array of 
    */
    getInputOptions: function() {
      return this.inputOptions;
    },

    /**
    * @memberof remotepay.CloverDeviceEvent
    * @private
    */
    getMetaInfo: function(fieldName) {
      var curclass = this._class_;
      do {
        var fieldMetaInfo = curclass._meta_.fields[fieldName];
        if(fieldMetaInfo) {
          return fieldMetaInfo;
        }
        curclass = curclass.superclass;
      } while(curclass);
      return null;
    },

    toString: function() {
      return JSON.stringify(this);
    }

  });

CloverDeviceEvent._meta_ =  {fields:  {}};
CloverDeviceEvent._meta_.fields["message"] = {};
CloverDeviceEvent._meta_.fields["message"].type = String;
CloverDeviceEvent._meta_.fields["code"] = {};
CloverDeviceEvent._meta_.fields["code"].type = Number;
CloverDeviceEvent._meta_.fields["eventState"] = {};
CloverDeviceEvent._meta_.fields["eventState"].type = remotepay_DeviceEventState;
CloverDeviceEvent._meta_.fields["inputOptions"] = {};
CloverDeviceEvent._meta_.fields["inputOptions"].type = Array;
CloverDeviceEvent._meta_.fields["inputOptions"].elementType = remotepay_InputOption;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = CloverDeviceEvent;
}

