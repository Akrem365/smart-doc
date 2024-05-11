import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const Auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  console.log("Authorization Header:", authHeader);

  if (!authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError(
      "Authentication invalid: Invalid Authorization header format"
    );
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT Payload:", payload);

    req.user = { userId: payload.id };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication invalid: Invalid token");
  }
};

export default Auth;
