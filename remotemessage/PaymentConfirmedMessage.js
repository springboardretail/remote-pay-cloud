/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotemessage_Method = require("../remotemessage/Method");
var remotemessage_Message = require("../remotemessage/Message");
var payments_Payment = require("../payments/Payment");

  /**
  * @constructor
  * @augments remotemessage.Message
  * @memberof remotemessage
  */
  PaymentConfirmedMessage = Class.create(remotemessage_Message, {
    /**
    * Initialize the values for this.
    * @memberof remotemessage.PaymentConfirmedMessage
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = PaymentConfirmedMessage;
      this.setMethod(remotemessage_Method["PAYMENT_CONFIRMED"]);
      this.payment = undefined;
    },

    /**
    * Set the field value
    * A payment
    *
    * @memberof remotemessage.PaymentConfirmedMessage
    * @param {payments.Payment} payment 
    */
    setPayment: function(payment) {
      this.payment = payment;
    },

    /**
    * Get the field value
    * A payment
    * @memberof remotemessage.PaymentConfirmedMessage
    * @return {payments.Payment} 
    */
    getPayment: function() {
      return this.payment;
    }
  });

PaymentConfirmedMessage._meta_ =  {fields:  {}};
PaymentConfirmedMessage._meta_.fields["payment"] = {};
PaymentConfirmedMessage._meta_.fields["payment"].type = payments_Payment;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = PaymentConfirmedMessage;
}

