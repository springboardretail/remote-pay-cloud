/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");

/** Snapshot of a line item modifier at the time that the order was placed. */
  /**
  * @constructor
  * @memberof order
  */
  DisplayModification = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof order.DisplayModification
    * @private
    */
    initialize: function() {
      this._class_ = DisplayModification;
      this.id = undefined;
      this.name = undefined;
      this.amount = undefined;
    },

    /**
    * Set the field value
    * @memberof order.DisplayModification
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * @memberof order.DisplayModification
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * @memberof order.DisplayModification
    * @param {String} name 
    */
    setName: function(name) {
      this.name = name;
    },

    /**
    * Get the field value
    * @memberof order.DisplayModification
    * @return {String} 
    */
    getName: function() {
      return this.name;
    },

    /**
    * Set the field value
    * @memberof order.DisplayModification
    * @param {String} amount 
    */
    setAmount: function(amount) {
      this.amount = amount;
    },

    /**
    * Get the field value
    * @memberof order.DisplayModification
    * @return {String} 
    */
    getAmount: function() {
      return this.amount;
    },

    /**
    * @memberof order.DisplayModification
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

DisplayModification._meta_ =  {fields:  {}};
DisplayModification._meta_.fields["id"] = {};
DisplayModification._meta_.fields["id"].type = String;
DisplayModification._meta_.fields["name"] = {};
DisplayModification._meta_.fields["name"].type = String;
DisplayModification._meta_.fields["amount"] = {};
DisplayModification._meta_.fields["amount"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = DisplayModification;
}

