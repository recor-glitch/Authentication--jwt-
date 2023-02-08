import jwt from "jsonwebtoken";

export const verify_token = async (req, res, next) => {
  const access_token = req.headers.authorization.split(" ")[1];
  const refresh_token = req.headers.refresh_token;
  if (!access_token) {
    return res.json({ message: "No authorization token send!" });
  }
  if (!refresh_token) return res.json({ message: "No refresh token send!" });
  try {
    const access_verification = jwt.verify(
      access_token,
      process.env.ACCESS_SECRET
    );
    next();
  } catch (exception) {
    try {
      const refresh_verification = jwt.verify(
        refresh_token,
        process.env.REFRESH_SECRET
      );
      //we need to create a custom payload not just store the refresh_verification directly
      const new_access_token = jwt.sign(
        { name: refresh_verification.name, email: refresh_verification.email },
        process.env.ACCESS_SECRET,
        { expiresIn: "5m" }
      );
      req.headers.authorization = "Bearer " + new_access_token;
      next();
    } catch (e) {
      return res.status(401).json({
        message: "You are logged out!",
      });
    }
  }
};
