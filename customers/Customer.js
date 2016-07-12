/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var customers_EmailAddress = require("../customers/EmailAddress");
var customers_PhoneNumber = require("../customers/PhoneNumber");
var base_Reference = require("../base/Reference");
var customers_Address = require("../customers/Address");
var customers_Card = require("../customers/Card");

  /**
  * @constructor
  * @memberof customers
  */
  Customer = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof customers.Customer
    * @private
    */
    initialize: function() {
      this._class_ = Customer;
      this.id = undefined;
      this.orderRef = undefined;
      this.firstName = undefined;
      this.lastName = undefined;
      this.marketingAllowed = undefined;
      this.customerSince = undefined;
      this.orders = undefined;
      this.addresses = undefined;
      this.emailAddresses = undefined;
      this.phoneNumbers = undefined;
      this.cards = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof customers.Customer
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof customers.Customer
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * The order with which the customer is associated
    *
    * @memberof customers.Customer
    * @param {base.Reference} orderRef 
    */
    setOrderRef: function(orderRef) {
      this.orderRef = orderRef;
    },

    /**
    * Get the field value
    * The order with which the customer is associated
    * @memberof customers.Customer
    * @return {base.Reference} 
    */
    getOrderRef: function() {
      return this.orderRef;
    },

    /**
    * Set the field value
    * First/given name of the customer
    *
    * @memberof customers.Customer
    * @param {Null|String} firstName 
    */
    setFirstName: function(firstName) {
      this.firstName = firstName;
    },

    /**
    * Get the field value
    * First/given name of the customer
    * @memberof customers.Customer
    * @return {Null|String} 
    */
    getFirstName: function() {
      return this.firstName;
    },

    /**
    * Set the field value
    * Last name/surname of the customer
    *
    * @memberof customers.Customer
    * @param {Null|String} lastName 
    */
    setLastName: function(lastName) {
      this.lastName = lastName;
    },

    /**
    * Get the field value
    * Last name/surname of the customer
    * @memberof customers.Customer
    * @return {Null|String} 
    */
    getLastName: function() {
      return this.lastName;
    },

    /**
    * Set the field value
    * @memberof customers.Customer
    * @param {Boolean} marketingAllowed 
    */
    setMarketingAllowed: function(marketingAllowed) {
      this.marketingAllowed = marketingAllowed;
    },

    /**
    * Get the field value
    * @memberof customers.Customer
    * @return {Boolean} 
    */
    getMarketingAllowed: function() {
      return this.marketingAllowed;
    },

    /**
    * Set the field value
    * @memberof customers.Customer
    * @param {Number} customerSince must be a long integer
    */
    setCustomerSince: function(customerSince) {
      this.customerSince = customerSince;
    },

    /**
    * Get the field value
    * @memberof customers.Customer
    * @return {Number} must be a long integer
    */
    getCustomerSince: function() {
      return this.customerSince;
    },

    /**
    * Set the field value
    * @memberof customers.Customer
    * @param {Array.<base.Reference>} orders An array of 
    */
    setOrders: function(orders) {
      this.orders = orders;
    },

    /**
    * Get the field value
    * @memberof customers.Customer
    * @return {Array.<base.Reference>} An array of 
    */
    getOrders: function() {
      return this.orders;
    },

    /**
    * Set the field value
    * @memberof customers.Customer
    * @param {Array.<customers.Address>} addresses An array of 
    */
    setAddresses: function(addresses) {
      this.addresses = addresses;
    },

    /**
    * Get the field value
    * @memberof customers.Customer
    * @return {Array.<customers.Address>} An array of 
    */
    getAddresses: function() {
      return this.addresses;
    },

    /**
    * Set the field value
    * @memberof customers.Customer
    * @param {Array.<customers.EmailAddress>} emailAddresses An array of 
    */
    setEmailAddresses: function(emailAddresses) {
      this.emailAddresses = emailAddresses;
    },

    /**
    * Get the field value
    * @memberof customers.Customer
    * @return {Array.<customers.EmailAddress>} An array of 
    */
    getEmailAddresses: function() {
      return this.emailAddresses;
    },

    /**
    * Set the field value
    * @memberof customers.Customer
    * @param {Array.<customers.PhoneNumber>} phoneNumbers An array of 
    */
    setPhoneNumbers: function(phoneNumbers) {
      this.phoneNumbers = phoneNumbers;
    },

    /**
    * Get the field value
    * @memberof customers.Customer
    * @return {Array.<customers.PhoneNumber>} An array of 
    */
    getPhoneNumbers: function() {
      return this.phoneNumbers;
    },

    /**
    * Set the field value
    * @memberof customers.Customer
    * @param {Array.<customers.Card>} cards An array of 
    */
    setCards: function(cards) {
      this.cards = cards;
    },

    /**
    * Get the field value
    * @memberof customers.Customer
    * @return {Array.<customers.Card>} An array of 
    */
    getCards: function() {
      return this.cards;
    },

    /**
    * @memberof customers.Customer
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

Customer._meta_ =  {fields:  {}};
Customer._meta_.fields["id"] = {};
Customer._meta_.fields["id"].type = String;
Customer._meta_.fields["orderRef"] = {};
Customer._meta_.fields["orderRef"].type = base_Reference;
Customer._meta_.fields["firstName"] = {};
Customer._meta_.fields["firstName"].type = String;
Customer._meta_.fields["lastName"] = {};
Customer._meta_.fields["lastName"].type = String;
Customer._meta_.fields["marketingAllowed"] = {};
Customer._meta_.fields["marketingAllowed"].type = Boolean;
Customer._meta_.fields["customerSince"] = {};
Customer._meta_.fields["customerSince"].type = Number;
Customer._meta_.fields["orders"] = {};
Customer._meta_.fields["orders"].type = Array;
Customer._meta_.fields["orders"].elementType = base_Reference;
Customer._meta_.fields["addresses"] = {};
Customer._meta_.fields["addresses"].type = Array;
Customer._meta_.fields["addresses"].elementType = customers_Address;
Customer._meta_.fields["emailAddresses"] = {};
Customer._meta_.fields["emailAddresses"].type = Array;
Customer._meta_.fields["emailAddresses"].elementType = customers_EmailAddress;
Customer._meta_.fields["phoneNumbers"] = {};
Customer._meta_.fields["phoneNumbers"].type = Array;
Customer._meta_.fields["phoneNumbers"].elementType = customers_PhoneNumber;
Customer._meta_.fields["cards"] = {};
Customer._meta_.fields["cards"].type = Array;
Customer._meta_.fields["cards"].elementType = customers_Card;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = Customer;
}

