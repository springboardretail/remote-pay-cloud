/**
 * Maps constant message types to specific message class types.
 *
 */
export declare class MethodToMessage {
    private static methodToType;
    static getType(method: string): any;
    static initialize(): any;
}
