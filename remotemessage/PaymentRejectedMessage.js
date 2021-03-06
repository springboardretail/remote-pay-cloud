/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotemessage_Method = require("../remotemessage/Method");
var order_VoidReason = require("../order/VoidReason");
var remotemessage_Message = require("../remotemessage/Message");
var payments_Payment = require("../payments/Payment");

  /**
  * @constructor
  * @augments remotemessage.Message
  * @memberof remotemessage
  */
  PaymentRejectedMessage = Class.create(remotemessage_Message, {
    /**
    * Initialize the values for this.
    * @memberof remotemessage.PaymentRejectedMessage
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = PaymentRejectedMessage;
      this.setMethod(remotemessage_Method["PAYMENT_REJECTED"]);
      this.payment = undefined;
      this.voidReason = undefined;
    },

    /**
    * Set the field value
    * A payment
    *
    * @memberof remotemessage.PaymentRejectedMessage
    * @param {payments.Payment} payment 
    */
    setPayment: function(payment) {
      this.payment = payment;
    },

    /**
    * Get the field value
    * A payment
    * @memberof remotemessage.PaymentRejectedMessage
    * @return {payments.Payment} 
    */
    getPayment: function() {
      return this.payment;
    },

    /**
    * Set the field value
    * The reason the payment is being rejected
    *
    * @memberof remotemessage.PaymentRejectedMessage
    * @param {order.VoidReason} voidReason 
    */
    setVoidReason: function(voidReason) {
      this.voidReason = voidReason;
    },

    /**
    * Get the field value
    * The reason the payment is being rejected
    * @memberof remotemessage.PaymentRejectedMessage
    * @return {order.VoidReason} 
    */
    getVoidReason: function() {
      return this.voidReason;
    }
  });

PaymentRejectedMessage._meta_ =  {fields:  {}};
PaymentRejectedMessage._meta_.fields["payment"] = {};
PaymentRejectedMessage._meta_.fields["payment"].type = payments_Payment;
PaymentRejectedMessage._meta_.fields["voidReason"] = {};
PaymentRejectedMessage._meta_.fields["voidReason"].type = order_VoidReason;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = PaymentRejectedMessage;
}

