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
  Tag = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof inventory.Tag
    * @private
    */
    initialize: function() {
      this._class_ = Tag;
      this.id = undefined;
      this.name = undefined;
      this.items = undefined;
      this.printers = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof inventory.Tag
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof inventory.Tag
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * Tag name
    *
    * @memberof inventory.Tag
    * @param {String} name 
    */
    setName: function(name) {
      this.name = name;
    },

    /**
    * Get the field value
    * Tag name
    * @memberof inventory.Tag
    * @return {String} 
    */
    getName: function() {
      return this.name;
    },

    /**
    * Set the field value
    * Items associated with this tag
    *
    * @memberof inventory.Tag
    * @param {Array.<base.Reference>} items An array of 
    */
    setItems: function(items) {
      this.items = items;
    },

    /**
    * Get the field value
    * Items associated with this tag
    * @memberof inventory.Tag
    * @return {Array.<base.Reference>} An array of 
    */
    getItems: function() {
      return this.items;
    },

    /**
    * Set the field value
    * Printers associated with this tag
    *
    * @memberof inventory.Tag
    * @param {Array.<base.Reference>} printers An array of 
    */
    setPrinters: function(printers) {
      this.printers = printers;
    },

    /**
    * Get the field value
    * Printers associated with this tag
    * @memberof inventory.Tag
    * @return {Array.<base.Reference>} An array of 
    */
    getPrinters: function() {
      return this.printers;
    },

    /**
    * @memberof inventory.Tag
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

Tag._meta_ =  {fields:  {}};
Tag._meta_.fields["id"] = {};
Tag._meta_.fields["id"].type = String;
Tag._meta_.fields["name"] = {};
Tag._meta_.fields["name"].type = String;
Tag._meta_.fields["items"] = {};
Tag._meta_.fields["items"].type = Array;
Tag._meta_.fields["items"].elementType = base_Reference;
Tag._meta_.fields["printers"] = {};
Tag._meta_.fields["printers"].type = Array;
Tag._meta_.fields["printers"].elementType = base_Reference;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = Tag;
}

