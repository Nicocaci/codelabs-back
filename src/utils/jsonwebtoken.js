import jwt from "jsonwebtoken";

const generateToken = (user) => {
    if(!PRIVATE_KEY) throw new Error("Private key is not defined in environment variables");

    return jwt.sign(user, PRIVATE_KEY, { expiresIn: "1h" });
};
export default generateToken;