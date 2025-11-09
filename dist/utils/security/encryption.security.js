import { AES } from "crypto-js";
class EncryptionSecurityUtil {
    static encryptText = ({ plainText, secretKey = process.env.ENCRYPTION_KEY, }) => {
        return AES.encrypt(plainText, secretKey).toString();
    };
    static decryptText = ({ cipherText, secreteKey = process.env.ENCRYPTION_KEY, }) => {
        return AES.decrypt(cipherText, secreteKey).toString();
    };
}
export default EncryptionSecurityUtil;
