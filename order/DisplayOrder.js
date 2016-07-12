/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var order_DisplayPayment = require("../order/DisplayPayment");
var order_DisplayDiscount = require("../order/DisplayDiscount");
var order_DisplayLineItem = require("../order/DisplayLineItem");

  /**
  * @constructor
  * @memberof order
  */
  DisplayOrder = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof order.DisplayOrder
    * @private
    */
    initialize: function() {
      this._class_ = DisplayOrder;
      this.id = undefined;
      this.currency = undefined;
      this.employee = undefined;
      this.subtotal = undefined;
      this.tax = undefined;
      this.total = undefined;
      this.title = undefined;
      this.note = undefined;
      this.serviceChargeName = undefined;
      this.serviceChargeAmount = undefined;
      this.discounts = undefined;
      this.lineItems = undefined;
      this.amountRemaining = undefined;
      this.payments = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof order.DisplayOrder
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof order.DisplayOrder
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * Currency of this order
    *
    * @memberof order.DisplayOrder
    * @param {String} currency 
    */
    setCurrency: function(currency) {
      this.currency = currency;
    },

    /**
    * Get the field value
    * Currency of this order
    * @memberof order.DisplayOrder
    * @return {String} 
    */
    getCurrency: function() {
      return this.currency;
    },

    /**
    * Set the field value
    * The employee associated with this order
    *
    * @memberof order.DisplayOrder
    * @param {String} employee 
    */
    setEmployee: function(employee) {
      this.employee = employee;
    },

    /**
    * Get the field value
    * The employee associated with this order
    * @memberof order.DisplayOrder
    * @return {String} 
    */
    getEmployee: function() {
      return this.employee;
    },

    /**
    * Set the field value
    * Formatted subtotal of the order
    *
    * @memberof order.DisplayOrder
    * @param {String} subtotal 
    */
    setSubtotal: function(subtotal) {
      this.subtotal = subtotal;
    },

    /**
    * Get the field value
    * Formatted subtotal of the order
    * @memberof order.DisplayOrder
    * @return {String} 
    */
    getSubtotal: function() {
      return this.subtotal;
    },

    /**
    * Set the field value
    * Formatted tax of the order
    *
    * @memberof order.DisplayOrder
    * @param {String} tax 
    */
    setTax: function(tax) {
      this.tax = tax;
    },

    /**
    * Get the field value
    * Formatted tax of the order
    * @memberof order.DisplayOrder
    * @return {String} 
    */
    getTax: function() {
      return this.tax;
    },

    /**
    * Set the field value
    * Formatted total of the order
    *
    * @memberof order.DisplayOrder
    * @param {String} total 
    */
    setTotal: function(total) {
      this.total = total;
    },

    /**
    * Get the field value
    * Formatted total of the order
    * @memberof order.DisplayOrder
    * @return {String} 
    */
    getTotal: function() {
      return this.total;
    },

    /**
    * Set the field value
    * @memberof order.DisplayOrder
    * @param {Null|String} title 
    */
    setTitle: function(title) {
      this.title = title;
    },

    /**
    * Get the field value
    * @memberof order.DisplayOrder
    * @return {Null|String} 
    */
    getTitle: function() {
      return this.title;
    },

    /**
    * Set the field value
    * @memberof order.DisplayOrder
    * @param {Null|String} note 
    */
    setNote: function(note) {
      this.note = note;
    },

    /**
    * Get the field value
    * @memberof order.DisplayOrder
    * @return {Null|String} 
    */
    getNote: function() {
      return this.note;
    },

    /**
    * Set the field value
    * Optional service charge name (gratuity) applied to this order
    *
    * @memberof order.DisplayOrder
    * @param {Null|String} serviceChargeName 
    */
    setServiceChargeName: function(serviceChargeName) {
      this.serviceChargeName = serviceChargeName;
    },

    /**
    * Get the field value
    * Optional service charge name (gratuity) applied to this order
    * @memberof order.DisplayOrder
    * @return {Null|String} 
    */
    getServiceChargeName: function() {
      return this.serviceChargeName;
    },

    /**
    * Set the field value
    * Optional service charge amount (gratuity) applied to this order
    *
    * @memberof order.DisplayOrder
    * @param {Null|String} serviceChargeAmount 
    */
    setServiceChargeAmount: function(serviceChargeAmount) {
      this.serviceChargeAmount = serviceChargeAmount;
    },

    /**
    * Get the field value
    * Optional service charge amount (gratuity) applied to this order
    * @memberof order.DisplayOrder
    * @return {Null|String} 
    */
    getServiceChargeAmount: function() {
      return this.serviceChargeAmount;
    },

    /**
    * Set the field value
    * @memberof order.DisplayOrder
    * @param {Array.<order.DisplayDiscount>} discounts An array of 
    */
    setDiscounts: function(discounts) {
      this.discounts = discounts;
    },

    /**
    * Get the field value
    * @memberof order.DisplayOrder
    * @return {Array.<order.DisplayDiscount>} An array of 
    */
    getDiscounts: function() {
      return this.discounts;
    },

    /**
    * Set the field value
    * @memberof order.DisplayOrder
    * @param {Array.<order.DisplayLineItem>} lineItems An array of 
    */
    setLineItems: function(lineItems) {
      this.lineItems = lineItems;
    },

    /**
    * Get the field value
    * @memberof order.DisplayOrder
    * @return {Array.<order.DisplayLineItem>} An array of 
    */
    getLineItems: function() {
      return this.lineItems;
    },

    /**
    * Set the field value
    * Formatted amount remaining
    *
    * @memberof order.DisplayOrder
    * @param {String} amountRemaining 
    */
    setAmountRemaining: function(amountRemaining) {
      this.amountRemaining = amountRemaining;
    },

    /**
    * Get the field value
    * Formatted amount remaining
    * @memberof order.DisplayOrder
    * @return {String} 
    */
    getAmountRemaining: function() {
      return this.amountRemaining;
    },

    /**
    * Set the field value
    * Payments that were made for this order
    *
    * @memberof order.DisplayOrder
    * @param {Array.<order.DisplayPayment>} payments An array of 
    */
    setPayments: function(payments) {
      this.payments = payments;
    },

    /**
    * Get the field value
    * Payments that were made for this order
    * @memberof order.DisplayOrder
    * @return {Array.<order.DisplayPayment>} An array of 
    */
    getPayments: function() {
      return this.payments;
    },

    /**
    * @memberof order.DisplayOrder
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

DisplayOrder._meta_ =  {fields:  {}};
DisplayOrder._meta_.fields["id"] = {};
DisplayOrder._meta_.fields["id"].type = String;
DisplayOrder._meta_.fields["currency"] = {};
DisplayOrder._meta_.fields["currency"].type = String;
DisplayOrder._meta_.fields["employee"] = {};
DisplayOrder._meta_.fields["employee"].type = String;
DisplayOrder._meta_.fields["subtotal"] = {};
DisplayOrder._meta_.fields["subtotal"].type = String;
DisplayOrder._meta_.fields["tax"] = {};
DisplayOrder._meta_.fields["tax"].type = String;
DisplayOrder._meta_.fields["total"] = {};
DisplayOrder._meta_.fields["total"].type = String;
DisplayOrder._meta_.fields["title"] = {};
DisplayOrder._meta_.fields["title"].type = String;
DisplayOrder._meta_.fields["note"] = {};
DisplayOrder._meta_.fields["note"].type = String;
DisplayOrder._meta_.fields["serviceChargeName"] = {};
DisplayOrder._meta_.fields["serviceChargeName"].type = String;
DisplayOrder._meta_.fields["serviceChargeAmount"] = {};
DisplayOrder._meta_.fields["serviceChargeAmount"].type = String;
DisplayOrder._meta_.fields["discounts"] = {};
DisplayOrder._meta_.fields["discounts"].type = Array;
DisplayOrder._meta_.fields["discounts"].elementType = order_DisplayDiscount;
DisplayOrder._meta_.fields["lineItems"] = {};
DisplayOrder._meta_.fields["lineItems"].type = Array;
DisplayOrder._meta_.fields["lineItems"].elementType = order_DisplayLineItem;
DisplayOrder._meta_.fields["amountRemaining"] = {};
DisplayOrder._meta_.fields["amountRemaining"].type = String;
DisplayOrder._meta_.fields["payments"] = {};
DisplayOrder._meta_.fields["payments"].type = Array;
DisplayOrder._meta_.fields["payments"].elementType = order_DisplayPayment;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = DisplayOrder;
}

