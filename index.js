"use strict";
const core = require("@actions/core");
const openpgp = require("openpgp");
const fs = require("fs");
try {
    const inputText = core.getInput("text", { required: true });
    try {
        if (fs.existsSync(path)) {
            var text = fs.readFileSync(inputText);
        }
    } catch (err) {
        var text = inputText;
    }
    const useKeyserver =
        core.getInput("text", { required: true }) === "keyserver"
            ? true
            : false;
    const inputKey = core.getInput("key", { required: true });
    const isPrivate = !!key.includes("PRIVATE KEY BLOCK");
    if (isPrivate) {
        const passphrase = core.getInput("passphrase");
        console.log("inputted key is private and will be used for signing");
    } else {
        const privateKey = core.getInput("privateKey");
    }
    const keyserver = core.getInput("keyserver", { required: false });
    (async () => {
        if (useKeyserver) {
            var hkp = !!keyserver
                ? new openpgp.HKP(keyserver)
                : new openpgp.HKP();
            const key = await hkp.lookup({
                query: inputKey
            });
        } else {
            const key = inputKey;
        }
        if (isPrivate) {
            var privateKey = await openpgp.key.readArmored(key);
            if (!!passphrase) {
                await privateKey.decrypt(passphrase);
            }
            const result = await openpgp.sign({
                message: openpgp.cleartext.fromText(text),
                privateKeys: [privateKey]
            });
        } else {
            const result = await openpgp.encrypt({
                message: openpgp.message.fromText(text),
                publicKeys: await openpgp.key.readArmored(key),
                privateKeys: !!privateKey
                    ? [await openpgp.key.readArmored(privateKey)]
                    : []
            });
        }
        core.setOutput("encrypted-text", result);
        core.exportVariable("encryptedText", result);
    })();
} catch (error) {
    core.setFailed(error.message);
}
