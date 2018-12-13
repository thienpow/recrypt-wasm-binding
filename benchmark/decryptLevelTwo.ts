import {EncryptedValue} from "../recrypt_wasm_binding";
declare const Benchmark: any;

export default (Recrypt: typeof import("../lib/Api256Shim"), logResult: (results: string) => void) => {
    const api = new Recrypt.Api256();
    //prettier-ignore
    const privateSigningKey = new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 138, 136, 227, 221, 116, 9, 241, 149, 253, 82, 219, 45, 60, 186, 93, 114, 202, 103, 9, 191, 29, 148, 18, 27, 243, 116, 136, 1, 180, 15, 111, 92]);

    let devicePrivateKey: Uint8Array, lvl2EncryptedValue: EncryptedValue;

    function onCycle() {
        const plaintext = api.generatePlaintext();
        const groupKeys = api.generateKeyPair();
        const userKeys = api.generateKeyPair();
        const deviceKeys = api.generateKeyPair();
        devicePrivateKey = deviceKeys.privateKey;

        const groupToUserTransform = api.generateTransformKey(groupKeys.privateKey, userKeys.publicKey, privateSigningKey);
        const userToDeviceTransform = api.generateTransformKey(userKeys.privateKey, deviceKeys.publicKey, privateSigningKey);

        const lvl0EncryptedValue = api.encrypt(plaintext, groupKeys.publicKey, privateSigningKey);
        const lvl1EncryptedValue = api.transform(lvl0EncryptedValue, groupToUserTransform, privateSigningKey);
        lvl2EncryptedValue = api.transform(lvl1EncryptedValue, userToDeviceTransform, privateSigningKey);
    }
    onCycle();

    return new Benchmark("decryptLevel2", {
        fn: () => {
            api.decrypt(lvl2EncryptedValue, devicePrivateKey);
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
