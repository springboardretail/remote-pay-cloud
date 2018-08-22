"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sdk = require("remote-pay-cloud-api");
/**
 * Used to more closely match patterns used in other SDK's to allow for easier maintenance.
 *
 */
var PayIntent;
(function (PayIntent) {
    var Builder = (function () {
        function Builder() {
            /** @Deprecated // Please use TransactionSettings */
            this.isDisableCashBack = false;
            this.isTesting = false;
            this.isCardNotPresent = false;
            /** @Deprecated // Please use TransactionSettings */
            this.remotePrint = false;
            /** @Deprecated // Please use TransactionSettings */
            this.isForceSwipePinEntry = false;
            /** @Deprecated // Please use TransactionSettings */
            this.disableRestartTransactionWhenFailed = false;
            this.allowPartialAuth = true;
        }
        Builder.buildTransactionSettingsFromPayIntent = function (payIntent) {
            var transactionSettings = new sdk.payments.TransactionSettings();
            transactionSettings.setCloverShouldHandleReceipts(!payIntent.getRemotePrint());
            transactionSettings.setDisableRestartTransactionOnFailure(payIntent.getDisableRestartTransactionWhenFailed());
            transactionSettings.setForcePinEntryOnSwipe(payIntent.getIsForceSwipePinEntry());
            transactionSettings.setDisableCashBack(payIntent.getIsDisableCashBack());
            transactionSettings.setAllowOfflinePayment(payIntent.getAllowOfflinePayment());
            transactionSettings.setApproveOfflinePaymentWithoutPrompt(payIntent.getApproveOfflinePaymentWithoutPrompt());
            transactionSettings.setCardEntryMethods(payIntent.getCardEntryMethods());
            transactionSettings.setDisableDuplicateCheck(false); // default
            transactionSettings.setDisableReceiptSelection(false); // default
            transactionSettings.setSignatureEntryLocation(null); // will default to clover setting
            transactionSettings.setTipMode(null); // will default to clover setting
            transactionSettings.setTippableAmount(payIntent.getTippableAmount());
            return transactionSettings;
        };
        Builder.prototype.payment = function (payment) {
            this.amount = payment.getAmount();
            this.tipAmount = payment.getTipAmount();
            this.taxAmount = payment.getTaxAmount();
            this.employeeId = payment.getEmployee().getId();
            this.transactionNo = payment.getCardTransaction() ? payment.getCardTransaction().getTransactionNo() : null;
            this.transactionSettings = payment.getTransactionSettings();
            return this;
        };
        Builder.prototype.payIntent = function (payIntent) {
            this.action = payIntent.getAction();
            this.amount = payIntent.getAmount();
            this.tippableAmount = payIntent.getTippableAmount();
            this.tipAmount = payIntent.getTipAmount();
            this.taxAmount = payIntent.getTaxAmount();
            this.orderId = payIntent.getOrderId();
            this.paymentId = payIntent.getPaymentId();
            this.employeeId = payIntent.getEmployeeId();
            this.transactionType = payIntent.getTransactionType();
            this.taxableAmountRates = payIntent.getTaxableAmountRates();
            this.serviceChargeAmount = payIntent.getServiceChargeAmount();
            this.isDisableCashBack = payIntent.getIsDisableCashBack();
            this.isTesting = payIntent.getIsTesting();
            this.cardEntryMethods = payIntent.getCardEntryMethods();
            this.voiceAuthCode = payIntent.getVoiceAuthCode();
            this.postalCode = payIntent.getPostalCode();
            this.streetAddress = payIntent.getStreetAddress();
            this.isCardNotPresent = payIntent.getIsCardNotPresent();
            this.cardDataMessage = payIntent.getCardDataMessage();
            this.remotePrint = payIntent.getRemotePrint();
            this.transactionNo = payIntent.getTransactionNo();
            this.isForceSwipePinEntry = payIntent.getIsForceSwipePinEntry();
            this.disableRestartTransactionWhenFailed = payIntent.getDisableRestartTransactionWhenFailed();
            this.externalPaymentId = payIntent.getExternalPaymentId();
            this.vaultedCard = payIntent.getVaultedCard();
            this.allowOfflinePayment = payIntent.getAllowOfflinePayment();
            this.approveOfflinePaymentWithoutPrompt = payIntent.getApproveOfflinePaymentWithoutPrompt();
            this.requiresRemoteConfirmation = payIntent.getRequiresRemoteConfirmation();
            this.applicationTracking = payIntent.getApplicationTracking();
            this.allowPartialAuth = payIntent.getAllowPartialAuth();
            this.germanInfo = payIntent.getGermanInfo();
            if (payIntent.getTransactionSettings() != null) {
                this.transactionSettings = payIntent.getTransactionSettings();
            }
            else {
                this.transactionSettings = PayIntent.Builder.buildTransactionSettingsFromPayIntent(payIntent);
            }
            this.cashAdvanceCustomerIdentification = payIntent.getCashAdvanceCustomerIdentification();
            return this;
        };
        Builder.prototype.setAction = function (action) {
            this.action = action;
            return this;
        };
        Builder.prototype.setAmount = function (amount) {
            this.amount = amount;
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setTippableAmount = function (tippableAmount) {
            this.tippableAmount = tippableAmount;
            if (this.transactionSettings != null) {
                this.transactionSettings.setTippableAmount(tippableAmount);
            }
            return this;
        };
        Builder.prototype.setTaxAmount = function (taxAmount) {
            this.taxAmount = taxAmount;
            return this;
        };
        Builder.prototype.setEmployeeId = function (employeeId) {
            this.employeeId = employeeId;
            return this;
        };
        Builder.prototype.setTipAmount = function (tipAmount) {
            this.tipAmount = tipAmount;
            return this;
        };
        Builder.prototype.setTransactionType = function (transactionType) {
            this.transactionType = transactionType;
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setCardEntryMethods = function (cardEntryMethods) {
            this.cardEntryMethods = cardEntryMethods;
            return this;
        };
        Builder.prototype.setCardDataMessage = function (cardDataMessage) {
            this.cardDataMessage = cardDataMessage;
            return this;
        };
        Builder.prototype.setTaxableAmountRates = function (taxableAmountRates) {
            this.taxableAmountRates = new Array(taxableAmountRates);
            return this;
        };
        Builder.prototype.setServiceChargeAmount = function (serviceChargeAmount) {
            this.serviceChargeAmount = serviceChargeAmount;
            return this;
        };
        Builder.prototype.setOrderId = function (orderId) {
            this.orderId = orderId;
            return this;
        };
        Builder.prototype.setPaymentId = function (paymentId) {
            this.paymentId = paymentId;
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setRemotePrint = function (remotePrint) {
            if (remotePrint === void 0) { remotePrint = false; }
            this.remotePrint = remotePrint;
            if (this.transactionSettings != null) {
                this.transactionSettings.setCloverShouldHandleReceipts(!remotePrint);
            }
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setDisableCashback = function (disableCashBack) {
            if (disableCashBack === void 0) { disableCashBack = false; }
            this.isDisableCashBack = disableCashBack;
            if (this.transactionSettings != null) {
                this.transactionSettings.setDisableCashBack(disableCashBack);
            }
            return this;
        };
        Builder.prototype.setTransactionNo = function (transactionNo) {
            this.transactionNo = transactionNo;
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setForceSwipePinEntry = function (isForceSwipePinEntry) {
            if (isForceSwipePinEntry === void 0) { isForceSwipePinEntry = false; }
            this.isForceSwipePinEntry = isForceSwipePinEntry;
            if (this.transactionSettings != null) {
                this.transactionSettings.setForcePinEntryOnSwipe(isForceSwipePinEntry);
            }
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setDisableRestartTransactionWhenFailed = function (disableRestartTransactionWhenFailed) {
            if (disableRestartTransactionWhenFailed === void 0) { disableRestartTransactionWhenFailed = false; }
            this.disableRestartTransactionWhenFailed = disableRestartTransactionWhenFailed;
            if (this.transactionSettings != null) {
                this.transactionSettings.setDisableRestartTransactionOnFailure(disableRestartTransactionWhenFailed);
            }
            return this;
        };
        Builder.prototype.setExternalPaymentId = function (externalPaymentId) {
            this.externalPaymentId = externalPaymentId;
            return this;
        };
        Builder.prototype.setVaultedCard = function (vaultedCard) {
            this.vaultedCard = vaultedCard;
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setAllowOfflinePayment = function (allowOfflinePayment) {
            this.allowOfflinePayment = allowOfflinePayment;
            if (this.transactionSettings != null) {
                this.transactionSettings.setAllowOfflinePayment(allowOfflinePayment);
            }
            return this;
        };
        /** @Deprecated */
        Builder.prototype.setAapproveOfflinePaymentWithoutPrompt = function (approveOfflinePaymentWithoutPrompt) {
            this.approveOfflinePaymentWithoutPrompt = approveOfflinePaymentWithoutPrompt;
            if (this.transactionSettings != null) {
                this.transactionSettings.setApproveOfflinePaymentWithoutPrompt(approveOfflinePaymentWithoutPrompt);
            }
            return this;
        };
        Builder.prototype.setRequiresRemoteConfirmation = function (requiresRemoteConfirmation) {
            this.requiresRemoteConfirmation = requiresRemoteConfirmation;
            return this;
        };
        Builder.prototype.setApplicationTracking = function (applicationTracking) {
            this.applicationTracking = applicationTracking;
            return this;
        };
        Builder.prototype.setAllowPartialAuth = function (allowPartialAuth) {
            if (allowPartialAuth === void 0) { allowPartialAuth = false; }
            this.allowPartialAuth = allowPartialAuth;
            return this;
        };
        Builder.prototype.setGermanInfo = function (germanInfo) {
            this.germanInfo = germanInfo;
            return this;
        };
        Builder.prototype.setCustomerIdentification = function (customerIdentification) {
            this.cashAdvanceCustomerIdentification = customerIdentification;
            return this;
        };
        Builder.prototype.setTransactionSettings = function (transactionSettings) {
            this.transactionSettings = transactionSettings;
            return this;
        };
        Builder.prototype.setCardNotPresent = function (cardNotPresent) {
            if (cardNotPresent === void 0) { cardNotPresent = false; }
            this.isCardNotPresent = cardNotPresent;
            return this;
        };
        Builder.prototype.build = function () {
            var payIntent = new sdk.remotemessage.PayIntent();
            payIntent.setAction(this.action);
            payIntent.setAmount(this.amount);
            payIntent.setTippableAmount(this.tippableAmount);
            payIntent.setTipAmount(this.tipAmount);
            payIntent.setTaxAmount(this.taxAmount);
            payIntent.setOrderId(this.orderId);
            payIntent.setPaymentId(this.paymentId);
            payIntent.setEmployeeId(this.employeeId);
            payIntent.setTransactionType(this.transactionType);
            payIntent.setTaxableAmountRates(this.taxableAmountRates);
            payIntent.setServiceChargeAmount(this.serviceChargeAmount);
            payIntent.setIsDisableCashBack(this.isDisableCashBack);
            payIntent.setIsTesting(this.isTesting);
            payIntent.setCardEntryMethods(this.cardEntryMethods);
            payIntent.setVoiceAuthCode(this.voiceAuthCode);
            payIntent.setPostalCode(this.postalCode);
            payIntent.setStreetAddress(this.streetAddress);
            payIntent.setIsCardNotPresent(this.isCardNotPresent);
            payIntent.setCardDataMessage(this.cardDataMessage);
            payIntent.setRemotePrint(this.remotePrint);
            payIntent.setTransactionNo(this.transactionNo);
            payIntent.setIsForceSwipePinEntry(this.isForceSwipePinEntry);
            payIntent.setDisableRestartTransactionWhenFailed(this.disableRestartTransactionWhenFailed);
            payIntent.setExternalPaymentId(this.externalPaymentId);
            payIntent.setVaultedCard(this.vaultedCard);
            payIntent.setAllowOfflinePayment(this.allowOfflinePayment);
            payIntent.setApproveOfflinePaymentWithoutPrompt(this.approveOfflinePaymentWithoutPrompt);
            payIntent.setRequiresRemoteConfirmation(this.requiresRemoteConfirmation);
            payIntent.setApplicationTracking(this.applicationTracking);
            payIntent.setAllowPartialAuth(this.allowPartialAuth);
            payIntent.setGermanInfo(this.germanInfo);
            payIntent.setCashAdvanceCustomerIdentification(this.cashAdvanceCustomerIdentification);
            payIntent.setTransactionSettings(this.transactionSettings);
            return payIntent;
        };
        return Builder;
    }());
    PayIntent.Builder = Builder;
})(PayIntent = exports.PayIntent || (exports.PayIntent = {}));

//# sourceMappingURL=../../../../maps/com/clover/util/PayIntent/Builder.js.map
