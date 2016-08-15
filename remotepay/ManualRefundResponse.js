/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotepay_BaseResponse = require("../remotepay/BaseResponse");
var payments_Credit = require("../payments/Credit");

  /**
  * @constructor
  * @augments remotepay.BaseResponse
  * @memberof remotepay
  */
  ManualRefundResponse = Class.create(remotepay_BaseResponse, {
    /**
    * Initialize the values for this.
    * @memberof remotepay.ManualRefundResponse
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = ManualRefundResponse;
      this.credit = undefined;
    },

    /**
    * Set the field value
    * The credit that resulted from the request
    *
    * @memberof remotepay.ManualRefundResponse
    * @param {payments.Credit} credit 
    */
    setCredit: function(credit) {
      this.credit = credit;
    },

    /**
    * Get the field value
    * The credit that resulted from the request
    * @memberof remotepay.ManualRefundResponse
    * @return {payments.Credit} 
    */
    getCredit: function() {
      return this.credit;
    }
  });

ManualRefundResponse._meta_ =  {fields:  {}};
ManualRefundResponse._meta_.fields["credit"] = {};
ManualRefundResponse._meta_.fields["credit"].type = payments_Credit;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = ManualRefundResponse;
}
