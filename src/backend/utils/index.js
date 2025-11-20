/**
 * Export tất cả utility functions
 */

const generateEmployeeId = require('./generateEmployeeId');
const calculateSalary = require('./calculateSalary');
const validators = require('./validators');
const dateHelper = require('./dateHelper');
const responseHelper = require('./responseHelper');
const constants = require('./constants');

module.exports = {
  // Generate Employee ID
  ...generateEmployeeId,
  
  // Calculate Salary
  ...calculateSalary,
  
  // Validators
  ...validators,
  
  // Date Helper
  ...dateHelper,
  
  // Response Helper
  response: responseHelper,
  
  // Constants
  constants
};