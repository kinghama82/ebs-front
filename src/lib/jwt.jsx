import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "your-access-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret";

export const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_SECRET, { expiresIn: "10m" });
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
