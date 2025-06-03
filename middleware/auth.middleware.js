import JWT from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No Access Token!" });
    }

    JWT.verify(token, process.env.SECRET_ACCESS_KEY, (error, decode) => {
      if (error) {
        return res.status(401).json({ error: "Access Token is Invalid!" });
      }

      req.user = decode.id;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};
