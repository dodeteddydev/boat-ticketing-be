import jwt from "jsonwebtoken";

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
      expiresIn: `${Number(refreshExpires)}m`,
    });

    return { access, refresh };
  }

  static verifyToken(token: string) {
    return jwt.verify(token, accessSecret);
  }
}
