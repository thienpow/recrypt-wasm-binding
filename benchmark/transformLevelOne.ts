import {TransformKey, EncryptedValue} from "../recrypt_wasm_binding";
declare const Benchmark: any;

export default (Recrypt: typeof import("../lib/Api256Shim"), logResult: (results: string) => void) => {
    const api = new Recrypt.Api256();
    //prettier-ignore
    const privateSigningKey = new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 138, 136, 227, 221, 116, 9, 241, 149, 253, 82, 219, 45, 60, 186, 93, 114, 202, 103, 9, 191, 29, 148, 18, 27, 243, 116, 136, 1, 180, 15, 111, 92]);
    let transformKey: TransformKey, lvl0EncryptedValue: EncryptedValue;

    function onCycle() {
        const userKeys = api.generateKeyPair();
        const deviceKeys = api.generateKeyPair();

        lvl0EncryptedValue = api.encrypt(api.generatePlaintext(), userKeys.publicKey, privateSigningKey);
        transformKey = api.generateTransformKey(userKeys.privateKey, deviceKeys.publicKey, privateSigningKey);
    }
    onCycle();

    return new Benchmark("transformLevelOne", {
        fn: () => {
            api.transform(lvl0EncryptedValue, transformKey, privateSigningKey);
        },
        onError: (err: Error) => {
            console.log(err);
        },
        onCycle,
        onComplete: (result: any) => {
            const resultString = result.currentTarget.toString();
            logResult(resultString);
            console.log(result.currentTarget.toString());
        },
    });
};
