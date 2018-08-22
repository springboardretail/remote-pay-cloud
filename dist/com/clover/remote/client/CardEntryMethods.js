"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines card entry method constants used in device communication.
 *
 */
var CardEntryMethods = (function () {
    function CardEntryMethods() {
    }
    CardEntryMethods.KIOSK_CARD_ENTRY_METHODS = 1 << 15;
    CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE = 1 | 256 | CardEntryMethods.KIOSK_CARD_ENTRY_METHODS; // 33025
    CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT = 2 | 512 | CardEntryMethods.KIOSK_CARD_ENTRY_METHODS; // 33282
    CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS = 4 | 1024 | CardEntryMethods.KIOSK_CARD_ENTRY_METHODS; // 33796
    CardEntryMethods.CARD_ENTRY_METHOD_MANUAL = 8 | 2048 | CardEntryMethods.KIOSK_CARD_ENTRY_METHODS; // 34824
    CardEntryMethods.DEFAULT = CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE |
        CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT |
        CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS; // | CARD_ENTRY_METHOD_MANUAL;
    CardEntryMethods.ALL = CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE |
        CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT |
        CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS |
        CardEntryMethods.CARD_ENTRY_METHOD_MANUAL;
    return CardEntryMethods;
}());
exports.CardEntryMethods = CardEntryMethods;

//# sourceMappingURL=../../../../maps/com/clover/remote/client/CardEntryMethods.js.map
