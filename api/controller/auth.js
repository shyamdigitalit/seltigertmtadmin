import Account from '../model/admin/account';
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
      // console.log(accessToken);
      // console.log(refreshToken);

      res.status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'live',
        maxAge: 60 * 1000,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'live',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ status: 200, data: {
        account: {
          _id: response._id,
          accountName: response.accountName,
          accountEmail: response.accountEmail
        },
        accessToken
      } });
    }
    else res.status(500).json({ status: 500, message: "Incorrect Email or Password" })
  }catch (error) {
    res.status(500).json({ status: 500, err: error.message })
  }
}

const checkSession = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not authenticated', statuscode: 401 });

    const account = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!account) return res.status(404).json({ message: 'Account not found', statuscode: 404 });

    // console.log(account);
    res.status(200).json({ message: 'Session is live', statuscode: 200, data: account });
  } catch (err) {
    return res.status(419).json({ message: 'Session invalid or expired', statuscode: 419 });
  }
};

// const refreshToken = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ status: 401, message: "Refresh token is required", });

//     const account = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     const accessToken = generateAccessToken(account);

//     return res
//       .status(200)
//       .cookie('accessToken', accessToken, {
//         httpOnly: true,
//         sameSite: 'Lax',
//         secure: process.env.NODE_ENV === 'live',
//         maxAge: 60 * 1000,
//       })
//       .json({ status: 200, data: accessToken });
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(403).json({ status: 403, message: "Refresh token expired", });
//     }
//     return res.status(403).json({ status: 403, message: "Invalid refresh token", });
//   }
// };

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ status: 401, message: "Refresh token required" });

    const account = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const accessToken = generateAccessToken(account);

    return res
      .status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'live',
        maxAge: 60 * 1000,
      })
      .json({ status: 200, data: accessToken });

  } catch (error) {
    return res.status(403).json({ status: 403, message: "Invalid/Expired refresh token" });
  }
};


const logoutAccount = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  return res.status(200).json({
    status: 200,
    message: "Logged out",
    success: true
  });
};


export { loginAccount, checkSession, refreshToken, logoutAccount  };
