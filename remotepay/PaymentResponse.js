/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var payments_Payment = require("../payments/Payment");
var remotepay_BaseResponse = require("../remotepay/BaseResponse");
var base_Signature = require("../base/Signature");

  /**
  * @constructor
  * @augments remotepay.BaseResponse
  * @memberof remotepay
  */
  PaymentResponse = Class.create(remotepay_BaseResponse, {
    /**
    * Initialize the values for this.
    * @memberof remotepay.PaymentResponse
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = PaymentResponse;
      this.payment = undefined;
      this.isSale = false;
      this.isPreAuth = false;
      this.isAuth = false;
      this.signature = undefined;
    },

    /**
    * Set the field value
    * The payment from the sale
    *
    * @memberof remotepay.PaymentResponse
    * @param {payments.Payment} payment 
    */
    setPayment: function(payment) {
      this.payment = payment;
    },

    /**
    * Get the field value
    * The payment from the sale
    * @memberof remotepay.PaymentResponse
    * @return {payments.Payment} 
    */
    getPayment: function() {
      return this.payment;
    },

    /**
    * Set the field value
    * @memberof remotepay.PaymentResponse
    * @param {Boolean} isSale 
    */
    setIsSale: function(isSale) {
      this.isSale = isSale;
    },

    /**
    * Get the field value
    * @memberof remotepay.PaymentResponse
    * @return {Boolean} 
    */
    getIsSale: function() {
      return this.isSale;
    },

    /**
    * Set the field value
    * @memberof remotepay.PaymentResponse
    * @param {Boolean} isPreAuth 
    */
    setIsPreAuth: function(isPreAuth) {
      this.isPreAuth = isPreAuth;
    },

    /**
    * Get the field value
    * @memberof remotepay.PaymentResponse
    * @return {Boolean} 
    */
    getIsPreAuth: function() {
      return this.isPreAuth;
    },

    /**
    * Set the field value
    * @memberof remotepay.PaymentResponse
    * @param {Boolean} isAuth 
    */
    setIsAuth: function(isAuth) {
      this.isAuth = isAuth;
    },

    /**
    * Get the field value
    * @memberof remotepay.PaymentResponse
    * @return {Boolean} 
    */
    getIsAuth: function() {
      return this.isAuth;
    },

    /**
    * Set the field value
    * @memberof remotepay.PaymentResponse
    * @param {base.Signature|Null} signature 
    */
    setSignature: function(signature) {
      this.signature = signature;
    },

    /**
    * Get the field value
    * @memberof remotepay.PaymentResponse
    * @return {base.Signature|Null} 
    */
    getSignature: function() {
      return this.signature;
    }
  });

PaymentResponse._meta_ =  {fields:  {}};
PaymentResponse._meta_.fields["payment"] = {};
PaymentResponse._meta_.fields["payment"].type = payments_Payment;
PaymentResponse._meta_.fields["isSale"] = {};
PaymentResponse._meta_.fields["isSale"].type = Boolean;
PaymentResponse._meta_.fields["isPreAuth"] = {};
PaymentResponse._meta_.fields["isPreAuth"].type = Boolean;
PaymentResponse._meta_.fields["isAuth"] = {};
PaymentResponse._meta_.fields["isAuth"].type = Boolean;
PaymentResponse._meta_.fields["signature"] = {};
PaymentResponse._meta_.fields["signature"].type = base_Signature;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = PaymentResponse;
}

