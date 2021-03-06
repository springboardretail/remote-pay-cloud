/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var base_Reference = require("../base/Reference");

  /**
  * @constructor
  * @memberof inventory
  */
  Modifier = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof inventory.Modifier
    * @private
    */
    initialize: function() {
      this._class_ = Modifier;
      this.id = undefined;
      this.name = undefined;
      this.alternateName = undefined;
      this.price = 0;
      this.modifierGroup = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof inventory.Modifier
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof inventory.Modifier
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * Name of the modifier
    *
    * @memberof inventory.Modifier
    * @param {String} name 
    */
    setName: function(name) {
      this.name = name;
    },

    /**
    * Get the field value
    * Name of the modifier
    * @memberof inventory.Modifier
    * @return {String} 
    */
    getName: function() {
      return this.name;
    },

    /**
    * Set the field value
    * Alternate name of the modifier
    *
    * @memberof inventory.Modifier
    * @param {String} alternateName 
    */
    setAlternateName: function(alternateName) {
      this.alternateName = alternateName;
    },

    /**
    * Get the field value
    * Alternate name of the modifier
    * @memberof inventory.Modifier
    * @return {String} 
    */
    getAlternateName: function() {
      return this.alternateName;
    },

    /**
    * Set the field value
    * Additional cost when used
    *
    * @memberof inventory.Modifier
    * @param {Number} price must be a long integer
    */
    setPrice: function(price) {
      this.price = price;
    },

    /**
    * Get the field value
    * Additional cost when used
    * @memberof inventory.Modifier
    * @return {Number} must be a long integer
    */
    getPrice: function() {
      return this.price;
    },

    /**
    * Set the field value
    * @memberof inventory.Modifier
    * @param {base.Reference} modifierGroup 
    */
    setModifierGroup: function(modifierGroup) {
      this.modifierGroup = modifierGroup;
    },

    /**
    * Get the field value
    * @memberof inventory.Modifier
    * @return {base.Reference} 
    */
    getModifierGroup: function() {
      return this.modifierGroup;
    },

    /**
    * @memberof inventory.Modifier
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

Modifier._meta_ =  {fields:  {}};
Modifier._meta_.fields["id"] = {};
Modifier._meta_.fields["id"].type = String;
Modifier._meta_.fields["name"] = {};
Modifier._meta_.fields["name"].type = String;
Modifier._meta_.fields["alternateName"] = {};
Modifier._meta_.fields["alternateName"].type = String;
Modifier._meta_.fields["price"] = {};
Modifier._meta_.fields["price"].type = Number;
Modifier._meta_.fields["modifierGroup"] = {};
Modifier._meta_.fields["modifierGroup"].type = base_Reference;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = Modifier;
}

