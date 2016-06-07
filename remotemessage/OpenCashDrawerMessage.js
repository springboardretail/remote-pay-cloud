/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotemessage_Method = require("../remotemessage/Method");
var remotemessage_Message = require("../remotemessage/Message");

  /**
  * @constructor
  */
  OpenCashDrawerMessage = Class.create(remotemessage_Message, {
    /**
    * Initialize the values for this.
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = OpenCashDrawerMessage;
      this.setMethod(remotemessage_Method["OPEN_CASH_DRAWER"]);
      this.reason = undefined;
    },

    /**
    * Set the field value
    * The reason the cash drawer was opened.
    *
    * @param {String} reason 
    */
    setReason: function(reason) {
      this.reason = reason;
    },

    /**
    * Get the field value
    * The reason the cash drawer was opened.
      * @return {String} 
    */
    getReason: function() {
      return this.reason;
    }
  });

OpenCashDrawerMessage._meta_ =  {fields:  {}};
OpenCashDrawerMessage._meta_.fields["reason"] = {};
OpenCashDrawerMessage._meta_.fields["reason"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = OpenCashDrawerMessage;
}
