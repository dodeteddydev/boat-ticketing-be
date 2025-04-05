import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
const accessExpires = process.env.JWT_ACCESS_EXPIRES;
const refreshExpires = process.env.JWT_REFRESH_EXPIRES;

export class JwtHelpers {
  static generateToken(userId: string): { access: string; refresh: string } {
    const access = jwt.sign({ userId }, accessSecret, {
      expiresIn: `${Number(accessExpires)}m`,
    });

    const refresh = jwt.sign({ userId }, refreshSecret, {
      expiresIn: `${Number(refreshExpires)}d`,
    });

    return { access, refresh };
  }

  static verifyAccessToken(token: string): JwtPayload & { userId: number } {
    return jwt.verify(token, accessSecret) as JwtPayload & { userId: number };
  }

  static verifyRefreshToken(token: string): JwtPayload & { userId: number } {
    return jwt.verify(token, refreshSecret) as JwtPayload & { userId: number };
  }
}
