/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotemessage_Method = require("../remotemessage/Method");
var remotemessage_Message = require("../remotemessage/Message");
var remotemessage_RemoveLineItemAction = require("../remotemessage/RemoveLineItemAction");

  /**
  * @constructor
  * @augments remotemessage.Message
  * @memberof remotemessage
  */
  OrderActionRemoveLineItemMessage = Class.create(remotemessage_Message, {
    /**
    * Initialize the values for this.
    * @memberof remotemessage.OrderActionRemoveLineItemMessage
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = OrderActionRemoveLineItemMessage;
      this.setMethod(remotemessage_Method["ORDER_ACTION_REMOVE_LINE_ITEM"]);
      this.removeLineItemAction = undefined;
    },

    /**
    * Set the field value
    * @memberof remotemessage.OrderActionRemoveLineItemMessage
    * @param {remotemessage.RemoveLineItemAction} removeLineItemAction 
    */
    setRemoveLineItemAction: function(removeLineItemAction) {
      this.removeLineItemAction = removeLineItemAction;
    },

    /**
    * Get the field value
    * @memberof remotemessage.OrderActionRemoveLineItemMessage
    * @return {remotemessage.RemoveLineItemAction} 
    */
    getRemoveLineItemAction: function() {
      return this.removeLineItemAction;
    }
  });

OrderActionRemoveLineItemMessage._meta_ =  {fields:  {}};
OrderActionRemoveLineItemMessage._meta_.fields["removeLineItemAction"] = {};
OrderActionRemoveLineItemMessage._meta_.fields["removeLineItemAction"].type = remotemessage_RemoveLineItemAction;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = OrderActionRemoveLineItemMessage;
}

