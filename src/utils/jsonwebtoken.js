import jwt from "jsonwebtoken";

const generateToken = (user) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET no está definida en las variables de entorno");

    return jwt.sign(user, secret, { expiresIn: "1h" });
};
export default generateToken;
