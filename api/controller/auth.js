import Account from '../model/account';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../config/token';

const loginAccount = async (req, res) => {    
    const { accountEmail, accountPassword } = req.body;
    if(!accountEmail || !accountPassword)
    return res.status(400).json({ status: 400, message: "Email and Password are required" });

    try {
        const response = await Account.findOne({accountEmail})
        if(!response) res.status(500).json({ status:500, message: "Incorrect Email or Password." })
        
        const isMatch = await bcrypt.compare(accountPassword, response.accountPassword);
        if(isMatch) {
            const accessToken = generateAccessToken(response);
            const refreshToken = generateRefreshToken(response);
            
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.APP_ENV === "production",
                sameSite: process.env.APP_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/api/auth/refresh-token",
            });
            res.status(200).json({ status: 200, account: {
                _id: response._id,
                accountName: response.accountName,
                accountEmail: response.accountEmail,   
            }, accessToken })
        }
        else res.status(500).json({ status: 500, message: "Incorrect Email or Password" })
    }catch (error) {
        res.status(500).json({ status: 500, err: error.message })
    }
}

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ status: 401, message: "Refresh token is required", });

    const account = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(account)
    return res.status(200).json({ status: 200, accessToken, });

  } catch (error) {
    if (error.name === "TokenExpiredError")
    return res.status(403).json({ status: 403, message: "Refresh token expired", });

    return res.status(403).json({ status: 403, message: "Invalid refresh token", });
  }
};


const logoutAccount = (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/aith/refresh-token", });
  return res.status(200).json({ status: 200, message: "Logged out" });
};


export { loginAccount, refreshToken, logoutAccount  };
