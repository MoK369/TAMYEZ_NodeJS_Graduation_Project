import { sign, verify } from "jsonwebtoken";
class TokenSecurityUtil {
    static generateToken = ({ payload, secretKey, options = {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    }, }) => {
        return sign(payload, secretKey, options);
    };
    static verifyToken = ({ token, secretKey, }) => {
        return verify(token, secretKey);
    };
}
export default TokenSecurityUtil;
