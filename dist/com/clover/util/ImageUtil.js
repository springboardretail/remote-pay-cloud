"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImageUtil = (function () {
    function ImageUtil() {
    }
    /**
     * Appropriate for browsers. Uses a canvas element to base64
     * encode the image.
     *
     * @param {HTMLImageElement} img
     * @param {(response: any) => void} onEncode
     */
    ImageUtil.prototype.getBase64Image = function (img, onEncode) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
        onEncode(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };
    /**
     * Appropriate for browsers.  Uses an image tag and the load event to load an image from a url.
     *
     * @param {string} url
     * @param {(image: any) => void} onLoad
     * @param {(errorMessage: string) => void} onError
     */
    ImageUtil.prototype.loadImageFromURL = function (url, onLoad, onError) {
        var image = new Image();
        var imageLoadHandler = function () {
            if (onLoad) {
                onLoad(image);
            }
            clearEventListeners();
        };
        var imageErrorHandler = function () {
            if (onError) {
                onError("An Image could not be loaded. Please check that the URL (" + url + ") is accessible.");
            }
            clearEventListeners();
        };
        var clearEventListeners = function () {
            image.removeEventListener("load", imageLoadHandler);
            image.removeEventListener("error", imageErrorHandler);
        };
        image.addEventListener("load", imageLoadHandler);
        image.addEventListener("error", imageErrorHandler);
        image.crossOrigin = "Anonymous";
        image.src = url;
    };
    return ImageUtil;
}());
exports.ImageUtil = ImageUtil;

//# sourceMappingURL=../../../maps/com/clover/util/ImageUtil.js.map
