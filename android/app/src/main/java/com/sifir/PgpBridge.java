package com.sifir;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.proton.gopenpgp.helper.Helper;
import com.proton.gopenpgp.crypto.Crypto;


public class PgpBridge extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private com.proton.gopenpgp.crypto.Key unlockedKeyObj;
    private com.proton.gopenpgp.crypto.KeyRing keyRing;

    public PgpBridge(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;

    }

    @Override
    public String getName() {
        return "PgpBridge";
    }

    @ReactMethod
    public void initAndUnlockKeys(String privateKeyArmored, String pass, Promise promise) {
        try {
            byte[] passphrase = pass.getBytes();
            com.proton.gopenpgp.crypto.Key keyObj = Crypto.newKeyFromArmored(privateKeyArmored);
            this.unlockedKeyObj = keyObj.unlock(passphrase);
            this.keyRing = Crypto.newKeyRing(unlockedKeyObj);
            WritableMap reply = Arguments.createMap();
            reply.putString("pubkeyArmored", unlockedKeyObj.getArmoredPublicKey());
            reply.putString("fingerprint", unlockedKeyObj.getFingerprint());
            reply.putString("hexkeyId", unlockedKeyObj.getHexKeyID());
            promise.resolve(reply);
        } catch (Exception err) {
            promise.reject(err);
        }

    }

    @ReactMethod
    public void genNewKey(String pass, String email, String name, Promise promise) {
        try {
            byte[] passphrase = pass.getBytes();
            String ecKey = Helper.generateKey(name, email, passphrase, "x25519", 0);
            com.proton.gopenpgp.crypto.Key keyObj = Crypto.newKeyFromArmored(ecKey);
            com.proton.gopenpgp.crypto.Key unlockedKeyObj = keyObj.unlock(passphrase);
            com.proton.gopenpgp.crypto.KeyRing keyRing = Crypto.newKeyRing(unlockedKeyObj);

            WritableMap reply = Arguments.createMap();
            reply.putString("privkeyArmored", ecKey);
            reply.putString("pubkeyArmored", unlockedKeyObj.getArmoredPublicKey());
            reply.putString("fingerprint", unlockedKeyObj.getFingerprint());
            reply.putString("hexkeyId", unlockedKeyObj.getHexKeyID());
            promise.resolve(reply);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void signMessageWithArmoredKey(String msg, String privKey, String pass, Promise promise) {
        try {
            byte[] passphrase = pass.getBytes();
            com.proton.gopenpgp.crypto.PlainMessage plainText = Crypto.newPlainMessageFromString(msg);
            com.proton.gopenpgp.crypto.Key privKeyObj = Crypto.newKeyFromArmored(privKey);
            com.proton.gopenpgp.crypto.Key unlockedKeyObj = privKeyObj.unlock(passphrase);
            com.proton.gopenpgp.crypto.KeyRing signingKeyRing = Crypto.newKeyRing(unlockedKeyObj);
            com.proton.gopenpgp.crypto.PGPSignature pgpSignature = signingKeyRing.signDetached(plainText);
            WritableMap reply = Arguments.createMap();
            reply.putString("armoredSignature", pgpSignature.getArmored());
            reply.putString("message", plainText.getString());
            promise.resolve(reply);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void signMessage(String msg, Promise promise) {
        try {
            if (this.unlockedKeyObj == null || this.unlockedKeyObj.isUnlocked() != true){
                throw new Exception("Must unlock key first");
	    }
            com.proton.gopenpgp.crypto.PlainMessage plainText = Crypto.newPlainMessageFromString(msg);
//            com.proton.gopenpgp.crypto.KeyRing signingKeyRing = Crypto.newKeyRing(this.unlockedKeyObj);
            com.proton.gopenpgp.crypto.PGPSignature pgpSignature = this.keyRing.signDetached(plainText);
            promise.resolve(pgpSignature.getArmored());
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void verifySignedMessage(String msgToVerify, String armoredMessageSignature, String pubKey, Promise promise) {
        try {
            com.proton.gopenpgp.crypto.PlainMessage plainText = Crypto.newPlainMessageFromString(msgToVerify);
            com.proton.gopenpgp.crypto.PGPSignature pgpSignature = Crypto.newPGPSignatureFromArmored(armoredMessageSignature);
            com.proton.gopenpgp.crypto.Key pubKeyObj = Crypto.newKeyFromArmored(pubKey);
            com.proton.gopenpgp.crypto.KeyRing signingKeyRing = Crypto.newKeyRing(pubKeyObj);
            signingKeyRing.verifyDetached(plainText, pgpSignature, Crypto.getUnixTime());
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void encryptMessageWithArmoredPub(String msgToEncrypt, String armoredPub,Promise promise) {
        try {
            WritableMap resp = Arguments.createMap();
            String armored = Helper.encryptMessageArmored(armoredPub, msgToEncrypt);
            resp.putString("encryptedMsg", armored);
            if (this.unlockedKeyObj != null) {
                com.proton.gopenpgp.crypto.PlainMessage plainText = Crypto.newPlainMessageFromString(msgToEncrypt);
//                com.proton.gopenpgp.crypto.KeyRing signingKeyRing = Crypto.newKeyRing(this.unlockedKeyObj);
                com.proton.gopenpgp.crypto.PGPSignature pgpSignature = this.keyRing.signDetached(plainText);
                resp.putString("signature", pgpSignature.getArmored());

            }
            promise.resolve(resp);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void decryptMessage(String msgToDecrypt,Promise promise) {
        try {
            if (this.unlockedKeyObj == null || this.unlockedKeyObj.isUnlocked() != true){
                throw  new Exception("Must unlock key first");
            }
            Log.d("PGPBridge",msgToDecrypt);
            Log.d("PGPBridge",this.unlockedKeyObj.isUnlocked() ? "ttrue": "false");
            Log.d("PGPBridge",this.unlockedKeyObj.getFingerprint());
            com.proton.gopenpgp.crypto.PGPMessage pgpMessage = Crypto.newPGPMessageFromArmored(msgToDecrypt);
            Log.d("PGPBridge",pgpMessage.toString());

//            com.proton.gopenpgp.crypto.KeyRing signingKeyRing = Crypto.newKeyRing(this.unlockedKeyObj);
            // example https://github.com/ProtonMail/gopenpgp/blob/v2.0.0/helper/helper.go#L114
            com.proton.gopenpgp.crypto.PlainMessage msg = this.keyRing.decrypt(pgpMessage,null,0);
            Log.d("PGPBridge",msg.toString());
            promise.resolve(msg.getString());
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}
