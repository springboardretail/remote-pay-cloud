import { IImageUtil } from './IImageUtil';
export declare class ImageUtil implements IImageUtil {
    /**
     * Appropriate for browsers. Uses a canvas element to base64
     * encode the image.
     *
     * @param {HTMLImageElement} img
     * @param {(response: any) => void} onEncode
     */
    getBase64Image(img: HTMLImageElement, onEncode: (response: any) => void): string | void;
    /**
     * Appropriate for browsers.  Uses an image tag and the load event to load an image from a url.
     *
     * @param {string} url
     * @param {(image: any) => void} onLoad
     * @param {(errorMessage: string) => void} onError
     */
    loadImageFromURL(url: string, onLoad: (image: any) => void, onError: (errorMessage: string) => void): void;
}
