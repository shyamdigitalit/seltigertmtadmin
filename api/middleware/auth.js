import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized Access" });

  try {
    // console.log(token);
    const response = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // console.log(response);
    if (!response) return res.status(401).json({ status: 401, message: "Unauthorized Access" });
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: "Session Expired", error });
  }
};

export default authMiddleware;
