import {PublicKey, EncryptedValue} from "../recrypt_wasm_binding";
declare const Benchmark: any;

export default (Recrypt: typeof import("../lib/Api256Shim"), logResult: (results: string) => void) => {
    const api = new Recrypt.Api256();

    let plaintext: Uint8Array, publicKey: PublicKey, privateKey: Uint8Array, lvl0EncryptedValue: EncryptedValue;

    function onCycle() {
        plaintext = api.generatePlaintext();
        const keys = api.generateKeyPair();
        //prettier-ignore
        const privateSigningKey = new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 138, 136, 227, 221, 116, 9, 241, 149, 253, 82, 219, 45, 60, 186, 93, 114, 202, 103, 9, 191, 29, 148, 18, 27, 243, 116, 136, 1, 180, 15, 111, 92]);
        publicKey = keys.publicKey;
        privateKey = keys.privateKey;
        lvl0EncryptedValue = api.encrypt(plaintext, publicKey, privateSigningKey);
    }
    onCycle();

    return new Benchmark("decryptLevel0", {
        fn: () => {
            api.decrypt(lvl0EncryptedValue, privateKey);
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
