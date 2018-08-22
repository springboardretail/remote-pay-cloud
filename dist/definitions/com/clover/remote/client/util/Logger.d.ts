/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * A simple logging utility that uses the underlying console.
 */
export declare class Logger extends EventEmitter {
    enabled: boolean;
    constructor();
    static create(): Logger;
    silly(...any: any[]): void;
    verbose(...any: any[]): void;
    info(...any: any[]): void;
    warn(...any: any[]): void;
    error(...any: any[]): void;
    debug(...any: any[]): void;
}
