/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");

  /**
  * @constructor
  * @memberof base
  */
  Tender = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof base.Tender
    * @private
    */
    initialize: function() {
      this._class_ = Tender;
      this.id = undefined;
      this.editable = undefined;
      this.labelKey = undefined;
      this.label = undefined;
      this.opensCashDrawer = undefined;
      this.supportsTipping = undefined;
      this.enabled = undefined;
      this.visible = undefined;
      this.instructions = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof base.Tender
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof base.Tender
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * If this merchant tender is editable
    *
    * @memberof base.Tender
    * @param {Boolean} editable 
    */
    setEditable: function(editable) {
      this.editable = editable;
    },

    /**
    * Get the field value
    * If this merchant tender is editable
    * @memberof base.Tender
    * @return {Boolean} 
    */
    getEditable: function() {
      return this.editable;
    },

    /**
    * Set the field value
    * Label Key
    *
    * @memberof base.Tender
    * @param {String} labelKey 
    */
    setLabelKey: function(labelKey) {
      this.labelKey = labelKey;
    },

    /**
    * Get the field value
    * Label Key
    * @memberof base.Tender
    * @return {String} 
    */
    getLabelKey: function() {
      return this.labelKey;
    },

    /**
    * Set the field value
    * Label Key
    *
    * @memberof base.Tender
    * @param {String} label 
    */
    setLabel: function(label) {
      this.label = label;
    },

    /**
    * Get the field value
    * Label Key
    * @memberof base.Tender
    * @return {String} 
    */
    getLabel: function() {
      return this.label;
    },

    /**
    * Set the field value
    * If this tender opens the cash drawer
    *
    * @memberof base.Tender
    * @param {Boolean} opensCashDrawer 
    */
    setOpensCashDrawer: function(opensCashDrawer) {
      this.opensCashDrawer = opensCashDrawer;
    },

    /**
    * Get the field value
    * If this tender opens the cash drawer
    * @memberof base.Tender
    * @return {Boolean} 
    */
    getOpensCashDrawer: function() {
      return this.opensCashDrawer;
    },

    /**
    * Set the field value
    * Allow tipping on payment from tender
    *
    * @memberof base.Tender
    * @param {Boolean} supportsTipping 
    */
    setSupportsTipping: function(supportsTipping) {
      this.supportsTipping = supportsTipping;
    },

    /**
    * Get the field value
    * Allow tipping on payment from tender
    * @memberof base.Tender
    * @return {Boolean} 
    */
    getSupportsTipping: function() {
      return this.supportsTipping;
    },

    /**
    * Set the field value
    * If this merchant tender is enabled
    *
    * @memberof base.Tender
    * @param {Boolean} enabled 
    */
    setEnabled: function(enabled) {
      this.enabled = enabled;
    },

    /**
    * Get the field value
    * If this merchant tender is enabled
    * @memberof base.Tender
    * @return {Boolean} 
    */
    getEnabled: function() {
      return this.enabled;
    },

    /**
    * Set the field value
    * If this merchant tender is visible
    *
    * @memberof base.Tender
    * @param {Boolean} visible 
    */
    setVisible: function(visible) {
      this.visible = visible;
    },

    /**
    * Get the field value
    * If this merchant tender is visible
    * @memberof base.Tender
    * @return {Boolean} 
    */
    getVisible: function() {
      return this.visible;
    },

    /**
    * Set the field value
    * Label Key
    *
    * @memberof base.Tender
    * @param {String} instructions 
    */
    setInstructions: function(instructions) {
      this.instructions = instructions;
    },

    /**
    * Get the field value
    * Label Key
    * @memberof base.Tender
    * @return {String} 
    */
    getInstructions: function() {
      return this.instructions;
    },

    /**
    * @memberof base.Tender
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

Tender._meta_ =  {fields:  {}};
Tender._meta_.fields["id"] = {};
Tender._meta_.fields["id"].type = String;
Tender._meta_.fields["editable"] = {};
Tender._meta_.fields["editable"].type = Boolean;
Tender._meta_.fields["labelKey"] = {};
Tender._meta_.fields["labelKey"].type = String;
Tender._meta_.fields["label"] = {};
Tender._meta_.fields["label"].type = String;
Tender._meta_.fields["opensCashDrawer"] = {};
Tender._meta_.fields["opensCashDrawer"].type = Boolean;
Tender._meta_.fields["supportsTipping"] = {};
Tender._meta_.fields["supportsTipping"].type = Boolean;
Tender._meta_.fields["enabled"] = {};
Tender._meta_.fields["enabled"].type = Boolean;
Tender._meta_.fields["visible"] = {};
Tender._meta_.fields["visible"].type = Boolean;
Tender._meta_.fields["instructions"] = {};
Tender._meta_.fields["instructions"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = Tender;
}

