"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_pay_cloud_api_1 = require("remote-pay-cloud-api");
/**
 * Maps constant message types to specific message class types.
 *
 */
var MethodToMessage = (function () {
    function MethodToMessage() {
    }
    MethodToMessage.getType = function (method) {
        if (MethodToMessage.methodToType == null) {
            MethodToMessage.initialize();
        }
        return MethodToMessage.methodToType[method];
    };
    MethodToMessage.initialize = function () {
        MethodToMessage.methodToType = {};
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ACK] = remote_pay_cloud_api_1.remotemessage.AcknowledgementMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CLOSEOUT_RESPONSE] = remote_pay_cloud_api_1.remotemessage.CloseoutResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CLOSEOUT_REQUEST] = remote_pay_cloud_api_1.remotemessage.CloseoutRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CAPTURE_PREAUTH_RESPONSE] = remote_pay_cloud_api_1.remotemessage.CapturePreAuthResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CAPTURE_PREAUTH] = remote_pay_cloud_api_1.remotemessage.CapturePreAuthMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CONFIRM_PAYMENT_MESSAGE] = remote_pay_cloud_api_1.remotemessage.ConfirmPaymentMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.LAST_MSG_REQUEST] = remote_pay_cloud_api_1.remotemessage.LastMessageRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.LAST_MSG_RESPONSE] = remote_pay_cloud_api_1.remotemessage.LastMessageResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.TIP_ADJUST] = remote_pay_cloud_api_1.remotemessage.TipAdjustMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.TIP_ADJUST_RESPONSE] = remote_pay_cloud_api_1.remotemessage.TipAdjustResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.OPEN_CASH_DRAWER] = remote_pay_cloud_api_1.remotemessage.OpenCashDrawerMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.SHOW_PAYMENT_RECEIPT_OPTIONS] = remote_pay_cloud_api_1.remotemessage.ShowPaymentReceiptOptionsMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.REFUND_RESPONSE] = remote_pay_cloud_api_1.remotemessage.RefundResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.REFUND_REQUEST] = remote_pay_cloud_api_1.remotemessage.RefundRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.TX_START] = remote_pay_cloud_api_1.remotemessage.TxStartRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.TX_START_RESPONSE] = remote_pay_cloud_api_1.remotemessage.TxStartResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.KEY_PRESS] = remote_pay_cloud_api_1.remotemessage.KeyPressMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.UI_STATE] = remote_pay_cloud_api_1.remotemessage.UiStateMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.TX_STATE] = remote_pay_cloud_api_1.remotemessage.TxStateMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.FINISH_OK] = remote_pay_cloud_api_1.remotemessage.FinishOkMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.FINISH_CANCEL] = remote_pay_cloud_api_1.remotemessage.FinishCancelMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.DISCOVERY_REQUEST] = remote_pay_cloud_api_1.remotemessage.DiscoveryRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.DISCOVERY_RESPONSE] = remote_pay_cloud_api_1.remotemessage.DiscoveryResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.TIP_ADDED] = remote_pay_cloud_api_1.remotemessage.TipAddedMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.VERIFY_SIGNATURE] = remote_pay_cloud_api_1.remotemessage.VerifySignatureMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.SIGNATURE_VERIFIED] = remote_pay_cloud_api_1.remotemessage.SignatureVerifiedMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PAYMENT_CONFIRMED] = remote_pay_cloud_api_1.remotemessage.PaymentConfirmedMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PAYMENT_REJECTED] = remote_pay_cloud_api_1.remotemessage.PaymentRejectedMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PAYMENT_VOIDED] = remote_pay_cloud_api_1.remotemessage.PaymentVoidedMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PRINT_TEXT] = remote_pay_cloud_api_1.remotemessage.TextPrintMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PRINT_IMAGE] = remote_pay_cloud_api_1.remotemessage.ImagePrintMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.TERMINAL_MESSAGE] = remote_pay_cloud_api_1.remotemessage.TerminalMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.SHOW_WELCOME_SCREEN] = remote_pay_cloud_api_1.remotemessage.WelcomeMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.SHOW_THANK_YOU_SCREEN] = remote_pay_cloud_api_1.remotemessage.ThankYouMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.SHOW_ORDER_SCREEN] = remote_pay_cloud_api_1.remotemessage.OrderUpdateMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.BREAK] = remote_pay_cloud_api_1.remotemessage.BreakMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CASHBACK_SELECTED] = remote_pay_cloud_api_1.remotemessage.CashbackSelectedMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PARTIAL_AUTH] = remote_pay_cloud_api_1.remotemessage.PartialAuthMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.VOID_PAYMENT] = remote_pay_cloud_api_1.remotemessage.VoidPaymentMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ORDER_ACTION_ADD_DISCOUNT] = remote_pay_cloud_api_1.remotemessage.OrderActionAddDiscountMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ORDER_ACTION_REMOVE_DISCOUNT] = remote_pay_cloud_api_1.remotemessage.OrderActionRemoveDiscountMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ORDER_ACTION_ADD_LINE_ITEM] = remote_pay_cloud_api_1.remotemessage.OrderActionAddLineItemMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ORDER_ACTION_REMOVE_LINE_ITEM] = remote_pay_cloud_api_1.remotemessage.OrderActionRemoveLineItemMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ORDER_ACTION_RESPONSE] = remote_pay_cloud_api_1.remotemessage.OrderActionResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.VAULT_CARD] = remote_pay_cloud_api_1.remotemessage.VaultCardMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.VAULT_CARD_RESPONSE] = remote_pay_cloud_api_1.remotemessage.VaultCardResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.LOG_MESSAGE] = remote_pay_cloud_api_1.remotemessage.LogMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RETRIEVE_PENDING_PAYMENTS] = remote_pay_cloud_api_1.remotemessage.RetrievePendingPaymentsMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RETRIEVE_PENDING_PAYMENTS_RESPONSE] = remote_pay_cloud_api_1.remotemessage.RetrievePendingPaymentsResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CARD_DATA] = remote_pay_cloud_api_1.remotemessage.CardDataRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.CARD_DATA_RESPONSE] = remote_pay_cloud_api_1.remotemessage.CardDataResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PAIRING_REQUEST] = remote_pay_cloud_api_1.remotemessage.PairingRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PAIRING_RESPONSE] = remote_pay_cloud_api_1.remotemessage.PairingResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PAIRING_CODE] = remote_pay_cloud_api_1.remotemessage.PairingCodeMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.REMOTE_ERROR] = remote_pay_cloud_api_1.remotemessage.RemoteError;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ACTIVITY_REQUEST] = remote_pay_cloud_api_1.remotemessage.ActivityRequest;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ACTIVITY_RESPONSE] = remote_pay_cloud_api_1.remotemessage.ActivityResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.SHUTDOWN] = remote_pay_cloud_api_1.remotemessage.ShutDownMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RESET] = remote_pay_cloud_api_1.remotemessage.ResetMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.FORCECONNECT] = remote_pay_cloud_api_1.remotemessage.ForceConnectMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RETRIEVE_DEVICE_STATUS_REQUEST] = remote_pay_cloud_api_1.remotemessage.RetrieveDeviceStatusRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RETRIEVE_DEVICE_STATUS_RESPONSE] = remote_pay_cloud_api_1.remotemessage.RetrieveDeviceStatusResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RESET_DEVICE_RESPONSE] = remote_pay_cloud_api_1.remotemessage.ResetDeviceResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ACTIVITY_MESSAGE_TO_ACTIVITY] = remote_pay_cloud_api_1.remotemessage.ActivityMessageToActivity;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.ACTIVITY_MESSAGE_FROM_ACTIVITY] = remote_pay_cloud_api_1.remotemessage.ActivityMessageFromActivity;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RETRIEVE_PAYMENT_RESPONSE] = remote_pay_cloud_api_1.remotemessage.RetrievePaymentResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.RETRIEVE_PAYMENT_REQUEST] = remote_pay_cloud_api_1.remotemessage.RetrievePaymentRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.GET_PRINTERS_REQUEST] = remote_pay_cloud_api_1.remotemessage.GetPrintersRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.GET_PRINTERS_RESPONSE] = remote_pay_cloud_api_1.remotemessage.GetPrintersResponseMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PRINT_JOB_STATUS_REQUEST] = remote_pay_cloud_api_1.remotemessage.PrintJobStatusRequestMessage;
        MethodToMessage.methodToType[remote_pay_cloud_api_1.remotemessage.Method.PRINT_JOB_STATUS_RESPONSE] = remote_pay_cloud_api_1.remotemessage.PrintJobStatusResponseMessage;
    };
    MethodToMessage.methodToType = null;
    return MethodToMessage;
}());
exports.MethodToMessage = MethodToMessage;

//# sourceMappingURL=../../../maps/com/clover/json/MethodToMessage.js.map
