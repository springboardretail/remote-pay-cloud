/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");


 /**
 *  Interface to the Clover remote-pay API.
 *
 *  Defines the interface used to interact with remote pay
 *  adapters.
 */
  /**
  * @constructor
  * @memberof remotepay
  */
  ICloverConnector = Class.create( {
    /**
    * Send a signature acceptance
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.VerifySignatureRequest} request 
    * @return void
    */
    acceptSignature: function(request) {
    },

    /**
    * Accepts a payment that has been challenged.
    * @memberof remotepay.ICloverConnector
    *
    * @param {payments.Payment} payment 
    * @return void
    */
    acceptPayment: function(payment) {
    },

    /**
    * Rejects a payment that has been challenged.
    * @memberof remotepay.ICloverConnector
    *
    * @param {payments.Payment} payment 
    * @param {base.Challenge} challenge 
    * @return void
    */
    rejectPayment: function(payment, challenge) {
    },

    /**
    * Request an authorization operation.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.AuthRequest} authRequest 
    * @return void
    */
    auth: function(authRequest) {
    },

    /**
    * Request a preauth operation.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.PreAuthRequest} preAuthRequest 
    * @return void
    */
    preAuth: function(preAuthRequest) {
    },

    /**
    * Request a cancel be sent to the device.
    * @memberof remotepay.ICloverConnector
    *
    * @return void
    */
    cancel: function() {
    },

    /**
    * Request a preauth be captured.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.CapturePreAuthRequest} capturePreAuthRequest 
    * @return void
    */
    capturePreAuth: function(capturePreAuthRequest) {
    },

    /**
    * Request a closeout.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.CloseoutRequest} closeoutRequest 
    * @return void
    */
    closeout: function(closeoutRequest) {
    },

    /**
    * Show the customer facing receipt option screen for the specified payment
    * @memberof remotepay.ICloverConnector
    *
    * @param {String} orderId 
    * @param {String} paymentId 
    * @return void
    */
    showPaymentReceiptOptions: function(orderId, paymentId) {
    },

    /**
    * Display order information on the screen. Calls to this method will cause the DisplayOrder
  * to show on the clover device. If a DisplayOrder is already showing on the Clover device,
  * it will replace the existing DisplayOrder on the device.
    * @memberof remotepay.ICloverConnector
    *
    * @param {order.DisplayOrder} order 
    * @return void
    */
    showDisplayOrder: function(order) {
    },

    /**
    * Removes the Display order information on the screen.
    * @memberof remotepay.ICloverConnector
    *
    * @param {order.DisplayOrder} order 
    * @return void
    */
    removeDisplayOrder: function(order) {
    },

    /**
    * Notify device of a discount being added to the order. The discount will then reflect in the displayOrder.
  * Note: This is independent of a discount being added to a display line item.
    * @memberof remotepay.ICloverConnector
    *
    * @param {order.DisplayDiscount} discount 
    * @param {order.DisplayOrder} order 
    * @return void
    */
    discountAddedToDisplayOrder: function(discount, order) {
    },

    /**
    * Notify device of a discount being removed to the order. The discount will then reflect in the displayOrder.
  * Note: This is independent of a discount being removed to a display line item.
    * @memberof remotepay.ICloverConnector
    *
    * @param {order.DisplayDiscount} discount 
    * @param {order.DisplayOrder} order 
    * @return void
    */
    discountRemovedFromDisplayOrder: function(discount, order) {
    },

    /**
    * Notify device of a line item being added to the order. The line item will then reflect in the displayOrder.
  * Note: This is independent of a line item being added to a display line item.
    * @memberof remotepay.ICloverConnector
    *
    * @param {order.DisplayLineItem} lineItem 
    * @param {order.DisplayOrder} order 
    * @return void
    */
    lineItemAddedToDisplayOrder: function(lineItem, order) {
    },

    /**
    * Notify device of a line item being removed to the order. The line item will then reflect in the displayOrder.
  * Note: This is independent of a line item being removed to a display line item.
    * @memberof remotepay.ICloverConnector
    *
    * @param {order.DisplayLineItem} lineItem 
    * @param {order.DisplayOrder} order 
    * @return void
    */
    lineItemRemovedFromDisplayOrder: function(lineItem, order) {
    },

    /**
    * Destroy the connector.  After this is called, the connection to the device is severed, and this object is
  * no longer usable
    * @memberof remotepay.ICloverConnector
    *
    * @return void
    */
    dispose: function() {
    },

    /**
    * Send a keystroke to the device.  When in non secure displays are on the device, this can be used to
  * act in the role of the user to 'press' available keys.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.InputOption} io 
    * @return void
    */
    invokeInputOption: function(io) {
    },

    /**
    * Do a refund to a card.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.ManualRefundRequest} request 
    * @return void
    */
    manualRefund: function(request) {
    },

    /**
    * Do a refund on a previously made payment.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.RefundPaymentRequest} request 
    * @return void
    */
    refundPayment: function(request) {
    },

    /**
    * Open the first cash drawer that is found connected to the clover device.
    * @memberof remotepay.ICloverConnector
    *
    * @param {String} reason 
    * @return void
    */
    openCashDrawer: function(reason) {
    },

    /**
    * Print the passed image. bitmap is a language specific object that represents an image.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.Img} bitmap 
    * @return void
    */
    printImage: function(bitmap) {
    },

    /**
    * Print an image on the clover device that is found at the passed url.
    * @memberof remotepay.ICloverConnector
    *
    * @param {String} imgUrl 
    * @return void
    */
    printImageFromURL: function(imgUrl) {
    },

    /**
    * Print text on the clover device printer.
    * @memberof remotepay.ICloverConnector
    *
    * @param {Array.<String>} messages An array of 
    * @return void
    */
    printText: function(messages) {
    },

    /**
    * Reject a signature
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.VerifySignatureRequest} request 
    * @return void
    */
    rejectSignature: function(request) {
    },

    /**
    * Send a message to the device to reset back to the welcome screen.  Can be used when the device is in
  * an unknown state.
    * @memberof remotepay.ICloverConnector
    *
    * @return void
    */
    resetDevice: function() {
    },

    /**
    * Begin a sale transaction.
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.SaleRequest} request 
    * @return void
    */
    sale: function(request) {
    },

    /**
    * Show a text message on the device.
    * @memberof remotepay.ICloverConnector
    *
    * @param {String} message 
    * @return void
    */
    showMessage: function(message) {
    },

    /**
    * Show the thank you display on the device.
    * @memberof remotepay.ICloverConnector
    *
    * @return void
    */
    showThankYouScreen: function() {
    },

    /**
    * Show the welcome display on the device.
    * @memberof remotepay.ICloverConnector
    *
    * @return void
    */
    showWelcomeScreen: function() {
    },

    /**
    * Tip adjust an existing auth
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.TipAdjustAuthRequest} request 
    * @return void
    */
    tipAdjustAuth: function(request) {
    },

    /**
    * Vault a card using optional cardEntryMethods
    * @memberof remotepay.ICloverConnector
    *
    * @param {Number} cardEntryMethods must be an integer
    * @return void
    */
    vaultCard: function(cardEntryMethods) {
    },

    /**
    * Void a payment
    * @memberof remotepay.ICloverConnector
    *
    * @param {remotepay.VoidPaymentRequest} request 
    * @return void
    */
    voidPayment: function(request) {
    },

    /**
    * Starts communication with the device.  This is called after the connector is created and listeners are added to the connector.
    * @memberof remotepay.ICloverConnector
    *
    * @return void
    */
    initializeConnection: function() {
    },

    /**
    * Used to request a list of pending payments that have been taken offline, but
  * haven't processed yet. will trigger an onRetrievePendingPaymentsResponse callback
    * @memberof remotepay.ICloverConnector
    *
    * @return void
    */
    retrievePendingPayments: function() {
    },

    /**
    * Sends a request to read card information and call back with the information collected.
  * @see ICloverConnectorListener.onReadCardDataResponse(ReadCardDataResponse)
    * @memberof remotepay.ICloverConnector
    *
    * @param {Number} cardEntryMethods must be an integer
    * @return void
    */
    readCardData: function(cardEntryMethods) {
    }
  });


//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = ICloverConnector;
}

