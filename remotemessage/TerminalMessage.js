/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotemessage_Method = require("../remotemessage/Method");
var remotemessage_Message = require("../remotemessage/Message");

  /**
  * @constructor
  * @augments remotemessage.Message
  * @memberof remotemessage
  */
  TerminalMessage = Class.create(remotemessage_Message, {
    /**
    * Initialize the values for this.
    * @memberof remotemessage.TerminalMessage
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = TerminalMessage;
      this.setMethod(remotemessage_Method["TERMINAL_MESSAGE"]);
      this.text = undefined;
    },

    /**
    * Set the field value
    * The message to display.
    *
    * @memberof remotemessage.TerminalMessage
    * @param {String} text 
    */
    setText: function(text) {
      this.text = text;
    },

    /**
    * Get the field value
    * The message to display.
    * @memberof remotemessage.TerminalMessage
    * @return {String} 
    */
    getText: function() {
      return this.text;
    }
  });

TerminalMessage._meta_ =  {fields:  {}};
TerminalMessage._meta_.fields["text"] = {};
TerminalMessage._meta_.fields["text"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = TerminalMessage;
}

