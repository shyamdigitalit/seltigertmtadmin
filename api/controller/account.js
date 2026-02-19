import Account from "../model/account.js";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../config/token.js";

const createAccount = async (req, res) => {
  try {
    const {accountName, accountEmail, accountPassword, phoneNumber, employeeCode, location, status } = req.body;

    if (!accountName || !accountEmail) {
        return res.status(400).json({ status: 400, message: "Account name and email are required" });
    }

    const existingAccount = await Account.findOne({ accountEmail });
    if (existingAccount) {
        return res.status(400).json({ status: 400, message: "Account with this email already exists" });
    }

    const hashed = await bcrypt.hash(accountPassword, 10)
    const result = await Account.create({ accountName, accountEmail, accountPassword: hashed, accountPasswordBckup: accountPassword, phoneNumber, employeeCode, location, status });

    if (result) {
      const accessToken = generateAccessToken(result);
      const refreshToken = generateRefreshToken(result);
      res.status(200).json({ status: 200, message: "Account created successfully", data: result, accessToken, refreshToken });
    }
    else {
      res.status(500).json({ status: 400, message: "Account creation failed." })
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error creating account", error: error.message });
  }
};

const bulkCreateAccount = async (req, res) => {
  try {
    const { data } = req.body;
    const result = await Account.insertMany(data);
    // console.log(result)
    res.status(200).json({ status: 200, message: "Account created successfully", data: result });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error creating account", error: error.message });
  }
};


const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAccount = await Account.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedAccount) {
        return res.status(404).json({ status: 404, message: "Account not found" });
    }

    res.status(200).json({ status: 200, message: "Account updated successfully", data: updatedAccount });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error updating account", error: error.message });
  }
};


const accountList = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status } = req.query;
    const searchText = req.query.search?.trim();

    const matchStage = {};
    if (status !== undefined) matchStage.status = status === "true";
    if (searchText) {
      matchStage.$or = [
        { accountName: { $regex: searchText, $options: "i" } },
        { accountEmail: { $regex: searchText, $options: "i" } },
      ];
    }


    const today = new Date();

    const pipeline = [
      { $match: matchStage },

      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]

    const [accounts, total] = await Promise.all([
      Account.aggregate(pipeline),
      Account.countDocuments()
    ])

    res.status(200).json({
      status: 200,
      message: "Account list fetched successfully",
      data: accounts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit), }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching account list",
      error: error.message,
    });
  }
};

const getAccountById = async (req, res) => {
    const { id } = req.params;
    let data = await Account.findById(id);
    res.json({ status: 200, message: `Account data for id ${id}`, data })
}

const deleteAccount = async (req, res) => {
  try {
    const selectedIds = req.body; // Expecting an array of IDs to delete
    const deletedAccount = await Account.deleteMany({ _id: { $in: selectedIds } });
    res.status(200).json({ status: 200, message: "Accounts deleted successfully", data: deletedAccount });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error deleting activities", error: error.message });
  }
}



export { createAccount, bulkCreateAccount, updateAccount, accountList, getAccountById, deleteAccount };