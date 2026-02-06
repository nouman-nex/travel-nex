const cleanReqData = require("../../helpers/cleanReqdata.helper");
const BankAccounts = require("../../models/BankAccounts");

/**
 * Add Bank Account
 */
exports.add = async (req, res) => {
  try {
    const allowedFields = [
      "bankName",
      "accountTitle",
      "iban",
      "branchCode",
      "accountNumber",
      "accountType",
      "isActive",
      "remarks",
      "logo",
    ];

    const cleanedData = cleanReqData(req.body, allowedFields);

    const bankAccount = await BankAccounts.create(cleanedData);

    res.status(201).json({
      status: "success",
      message: "Bank account added successfully",
      data: bankAccount,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Read All Bank Accounts
 */
exports.readAll = async (req, res) => {
  try {
    const accounts = await BankAccounts.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Update Bank Account
 */
exports.update = async (req, res) => {
  try {
    const allowedFields = [
      "bankName",
      "accountTitle",
      "iban",
      "branchCode",
      "accountNumber",
      "accountType",
      "isActive",
      "remarks",
      "logo",
    ];

    const cleanedData = cleanReqData(req.body, allowedFields);

    const account = await BankAccounts.findByIdAndUpdate(
      req.params.id,
      cleanedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Bank account not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Bank account updated successfully",
      data: account,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Delete Bank Account
 */
exports.remove = async (req, res) => {
  try {
    const account = await BankAccounts.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Bank account not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Bank account deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }
};
