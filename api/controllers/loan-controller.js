/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const moment = require('moment');

const {
  getTotalMatch,
  storeLoan,
  findById,
  deleteLoan,
  updateOneLoan,
  search,
  getClientById,
  listAllLoans
} = require('../services/loan-service');

const statuses = ['DRAFTED', 'UNDER REVIEW', 'APPROVED', 'DISBURSED'];

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 1000;
    const skip = parseInt(req.query.offset, 10) || 0;
    const branch = req.query.branch || '';
    const totalMatch = await getTotalMatch(branch);
    const loans = await listAllLoans(branch, skip, limit);
    return res.status(200).json({
      results: loans,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0
    });
  } catch (e) {
    return res.status(500).json({
      message: e
    });
  }
};

const store = async (req, res) => {
  const { amount, serviceCharge, installmentType, loanDuration } = req.body;
  const totalAmount = (parseInt(amount, 10) * parseInt(serviceCharge, 10)) / 100 + parseInt(amount, 10);
  let totalInstallment = Math.ceil(parseInt(loanDuration, 10) * 12 * 365 - 6 * parseInt(loanDuration, 10) * 12);
  if (installmentType === 'WEEKLY') {
    totalInstallment = Math.ceil((parseInt(loanDuration, 10) * 365) / 7);
  } else if (installmentType === 'MONTHLY') {
    totalInstallment = Math.ceil(parseInt(loanDuration, 10) * 12);
  }
  const installmentAmount = Math.ceil(totalAmount / totalInstallment);
  const applicant = await getClientById(req.body.client);
  const { center } = applicant;
  const data = {
    _id: mongoose.Types.ObjectId(),
    client: req.body.client,
    nominee: req.body.nominee,
    granter: req.body.granter,
    center,
    granterRelation: req.body.granterRelation,
    nomineeRelation: req.body.nomineeRelation,
    installmentType,
    loanDuration,
    amount,
    serviceCharge,
    totalAmount,
    totalInstallment,
    installmentAmount,
    billingCycle: req.body.billingCycle
  };
  try {
    const loan = await storeLoan(data);
    const getLoan = await findById(loan.id);
    return res.status(200).json({
      results: getLoan[0] || null,
      message: 'Successfully created loan'
    });
  } catch (e) {
    return res.status(500).json({
      message: e
    });
  }
};

const updateOne = async (req, res) => {
  try {
    const { amount, serviceCharge, installmentType, loanDuration } = req.body;
    const totalAmount = (parseInt(amount, 10) * parseInt(serviceCharge, 10)) / 100 + parseInt(amount, 10);
    let totalInstallment = Math.ceil(parseInt(loanDuration, 10) * 12 * 365 - 6 * parseInt(loanDuration, 10) * 12);
    if (installmentType === 'WEEKLY') {
      totalInstallment = Math.ceil((parseInt(loanDuration, 10) * 365) / 7);
    } else if (installmentType === 'MONTHLY') {
      totalInstallment = Math.ceil(parseInt(loanDuration, 10) * 12);
    }
    const installmentAmount = Math.ceil(totalAmount / totalInstallment);
    const applicant = await getClientById(req.body.client);
    const { center } = applicant;
    const data = {
      client: applicant.client,
      nominee: req.body.nominee,
      granter: req.body.granter,
      center,
      granterRelation: req.body.granterRelation,
      nomineeRelation: req.body.nomineeRelation,
      installmentType,
      loanDuration,
      amount,
      serviceCharge,
      totalAmount,
      totalInstallment,
      installmentAmount,
      billingCycle: req.body.billingCycle
    };
    const { id } = req.params;
    await updateOneLoan(id, data);
    const loan = await findById(id);
    return res.status(200).json({
      results: loan[0] || {},
      message: 'Successfully updated loan',
      _id: id
    });
  } catch (e) {
    if (e.message.indexOf('duplicate key error') !== -1)
      return res.status(409).json({
        message: 'Validation failed.',
        errors: [{ name: `"${data.name}" Already exist.` }]
      });
    const errors = [];
    if (e.errors) {
      const keys = Object.keys(e.errors || {});
      for (let i = 0; i < keys.length; i += 1) {
        errors.push({ [keys[i]]: e.errors[keys[i]].message });
      }
    }
    if (errors.length)
      return res.status(400).json({
        message: 'Validation failed.',
        errors
      });

    return res.status(500).json({
      message: e.message
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteLoan(id);
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: 'Record could not found.',
        results: result
      });
    return res.status(200).json({
      message: 'Loan deleted successfully',
      results: result
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await findById(id);
    return res.status(200).json({
      results: loan[0]
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message
    });
  }
};

const searchLoan = async (req, res) => {
  const { query } = req.params;
  try {
    const loans = await search(query);
    return res.status(200).json({
      results: loans
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message
    });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const disbursementDate = req.body.disbursementDate || new Date();
  try {
    const loan = await findById(id);
    const { status, installmentType, billingCycle } = loan[0];
    const ind = statuses.indexOf(status);
    if (ind > -1 && ind < statuses.length - 1) {
      const s = statuses[ind + 1];
      if (s === 'DISBURSED') {
        const today = disbursementDate || new Date();
        const payload = {
          disbursementDate: today,
          openingStatus: 'OPEN'
        };
        if (installmentType === 'WEEKLY') {
          const d = today.getDay();
          let nextDay = 7 - today.getDay() + billingCycle;
          if (billingCycle > d) {
            nextDay = billingCycle - d;
          }
          if (nextDay <= 7) {
            const currentInstallmentDate = moment(today).add(nextDay, 'days');
            await updateOneLoan(id, { status: s, currentInstallmentDate, ...payload });
            const l = await findById(id);
            return res.status(200).json({
              results: l[0] || {},
              message: 'Successfully updated status',
              _id: id,
              disbursementDate
            });
          } else {
            return res.status(500).json({
              message: 'Incorrect billing cycle.',
              nextDay,
              today,
              disbursementDate
            });
          }
        } else {
          const nextDate = today.getDate() - billingCycle;
          const month = today.getMonth();
          if (nextDate < 0) {
            const currentInstallmentDate = new Date(today.getFullYear(), month, billingCycle);
            await updateOneLoan(id, { status: s, ...payload, currentInstallmentDate });
            const l = await findById(id);
            return res.status(200).json({
              results: l[0] || {},
              message: 'Successfully updated status',
              _id: id
            });
          } else {
            const currentInstallmentDate = new Date(today.getFullYear(), month + 1, billingCycle);
            await updateOneLoan(id, { status: s, ...payload, currentInstallmentDate });
            const l = await findById(id);
            const bc = billingCycle;
            return res.status(200).json({
              results: l[0] || {},
              message: 'Successfully updated status',
              _id: id
            });
          }
        }
      } else {
        await updateOneLoan(id, { status: s });
        const l = await findById(id);
        return res.status(200).json({
          results: l[0] || {},
          message: 'Successfully updated status',
          _id: id
        });
      }
    } else
      return res.status(500).json({
        message: 'Unknown error.'
      });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message
    });
  }
};

const revokeStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await findById(id);
    const { status } = loan[0];
    const ind = statuses.indexOf(status);
    if (ind > 0 && ind <= statuses.length - 1) {
      const s = statuses[ind - 1];
      await updateOneLoan(id, { status: s });
      const l = await findById(id);
      return res.status(200).json({
        results: l[0] || {},
        message: 'Successfully updated status',
        _id: id
      });
    } else
      return res.status(500).json({
        message: 'Undefined status.'
      });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message
    });
  }
};

/**
 https://drive.google.com/uc?id=12SRDZInmm4DYiPkG_dNi_cKsDOkLcPv5&export=download
 */

module.exports = {
  index,
  store,
  updateOne,
  deleteOne,
  findOne,
  searchLoan,
  updateStatus,
  revokeStatus
};
