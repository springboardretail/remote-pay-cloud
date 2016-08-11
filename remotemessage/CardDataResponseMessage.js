/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");
var remotemessage_Method = require("../remotemessage/Method");
var remotemessage_ResultStatus = require("../remotemessage/ResultStatus");
var remotemessage_Message = require("../remotemessage/Message");

  /**
  * @constructor
  * @augments remotemessage.Message
  * @memberof remotemessage
  */
  CardDataResponseMessage = Class.create(remotemessage_Message, {
    /**
    * Initialize the values for this.
    * @memberof remotemessage.CardDataResponseMessage
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = CardDataResponseMessage;
      this.setMethod(remotemessage_Method["CARD_DATA_RESPONSE"]);
      this.reason = undefined;
      this.status = undefined;
      this.track1 = undefined;
      this.track2 = undefined;
    },

    /**
    * Set the field value
    * May be populated when the operation fails.
    *
    * @memberof remotemessage.CardDataResponseMessage
    * @param {String} reason 
    */
    setReason: function(reason) {
      this.reason = reason;
    },

    /**
    * Get the field value
    * May be populated when the operation fails.
    * @memberof remotemessage.CardDataResponseMessage
    * @return {String} 
    */
    getReason: function() {
      return this.reason;
    },

    /**
    * Set the field value
    * @memberof remotemessage.CardDataResponseMessage
    * @param {remotemessage.ResultStatus} status 
    */
    setStatus: function(status) {
      this.status = status;
    },

    /**
    * Get the field value
    * @memberof remotemessage.CardDataResponseMessage
    * @return {remotemessage.ResultStatus} 
    */
    getStatus: function() {
      return this.status;
    },

    /**
    * Set the field value
    * The track1 data from the card
    *
    * @memberof remotemessage.CardDataResponseMessage
    * @param {String} track1 
    */
    setTrack1: function(track1) {
      this.track1 = track1;
    },

    /**
    * Get the field value
    * The track1 data from the card
    * @memberof remotemessage.CardDataResponseMessage
    * @return {String} 
    */
    getTrack1: function() {
      return this.track1;
    },

    /**
    * Set the field value
    * The track2 data from the card
    *
    * @memberof remotemessage.CardDataResponseMessage
    * @param {String} track2 
    */
    setTrack2: function(track2) {
      this.track2 = track2;
    },

    /**
    * Get the field value
    * The track2 data from the card
    * @memberof remotemessage.CardDataResponseMessage
    * @return {String} 
    */
    getTrack2: function() {
      return this.track2;
    }
  });

CardDataResponseMessage._meta_ =  {fields:  {}};
CardDataResponseMessage._meta_.fields["reason"] = {};
CardDataResponseMessage._meta_.fields["reason"].type = String;
CardDataResponseMessage._meta_.fields["status"] = {};
CardDataResponseMessage._meta_.fields["status"].type = remotemessage_ResultStatus;
CardDataResponseMessage._meta_.fields["track1"] = {};
CardDataResponseMessage._meta_.fields["track1"].type = String;
CardDataResponseMessage._meta_.fields["track2"] = {};
CardDataResponseMessage._meta_.fields["track2"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = CardDataResponseMessage;
}

