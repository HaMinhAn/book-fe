/**
 * Comprehensive validation utilities for the entire application
 */

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  if (typeof email !== "string") {
    return { isValid: false, error: "Email must be a string" };
  }

  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) {
    return { isValid: false, error: "Email cannot be empty" };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: "Email is too long (max 254 characters)" };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, error: "" };
};

// Password validation
export const validatePassword = (
  password: string,
  confirmPassword?: string
): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (typeof password !== "string") {
    return { isValid: false, error: "Password must be a string" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password is too long (max 128 characters)",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
    };
  }

  // If confirm password is provided, check if they match
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: "" };
};

// Username validation
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: "Username is required" };
  }

  if (typeof username !== "string") {
    return { isValid: false, error: "Username must be a string" };
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername.length === 0) {
    return { isValid: false, error: "Username cannot be empty" };
  }

  if (trimmedUsername.length < 3) {
    return {
      isValid: false,
      error: "Username must be at least 3 characters long",
    };
  }

  if (trimmedUsername.length > 50) {
    return {
      isValid: false,
      error: "Username is too long (max 50 characters)",
    };
  }

  // Only allow alphanumeric characters, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
    return {
      isValid: false,
      error:
        "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }

  return { isValid: true, error: "" };
};

// Name validation (first name, last name)
export const validateName = (
  name: string,
  fieldName: string = "Name"
): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof name !== "string") {
    return { isValid: false, error: `${fieldName} must be a string` };
  }

  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters long`,
    };
  }

  if (trimmedName.length > 50) {
    return {
      isValid: false,
      error: `${fieldName} is too long (max 50 characters)`,
    };
  }

  return { isValid: true, error: "" };
};

// Phone number validation
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  if (typeof phone !== "string") {
    return { isValid: false, error: "Phone number must be a string" };
  }

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 0) {
    return { isValid: false, error: "Phone number cannot be empty" };
  }

  if (cleanPhone.length !== 10) {
    return { isValid: false, error: "Phone number must be exactly 10 digits" };
  }

  // US phone number format validation
  const phoneRegex =
    /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
  if (!phoneRegex.test(phone.trim())) {
    return {
      isValid: false,
      error: "Please enter a valid phone number (e.g., (555) 123-4567)",
    };
  }

  return { isValid: true, error: "" };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  if (!address) {
    return { isValid: false, error: "Address is required" };
  }

  if (typeof address !== "string") {
    return { isValid: false, error: "Address must be a string" };
  }

  const trimmedAddress = address.trim();
  if (trimmedAddress.length === 0) {
    return { isValid: false, error: "Address cannot be empty" };
  }

  if (trimmedAddress.length < 5) {
    return {
      isValid: false,
      error: "Address must be at least 5 characters long",
    };
  }

  if (trimmedAddress.length > 200) {
    return {
      isValid: false,
      error: "Address is too long (max 200 characters)",
    };
  }

  return { isValid: true, error: "" };
};

// ZIP code validation
export const validateZipCode = (zipCode: string): ValidationResult => {
  if (!zipCode) {
    return { isValid: false, error: "ZIP code is required" };
  }

  if (typeof zipCode !== "string") {
    return { isValid: false, error: "ZIP code must be a string" };
  }

  const trimmedZip = zipCode.trim();
  if (trimmedZip.length === 0) {
    return { isValid: false, error: "ZIP code cannot be empty" };
  }

  // US ZIP code format (5 digits or 5+4 format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(trimmedZip)) {
    return {
      isValid: false,
      error: "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)",
    };
  }

  return { isValid: true, error: "" };
};

// Quantity validation
export const validateQuantity = (
  qty: number,
  maxStock?: number,
  minQty: number = 1
): ValidationResult => {
  if (!qty && qty !== 0) {
    return { isValid: false, error: "Quantity is required" };
  }

  if (typeof qty !== "number" || isNaN(qty)) {
    return { isValid: false, error: "Quantity must be a valid number" };
  }

  if (qty < minQty) {
    return { isValid: false, error: `Quantity must be at least ${minQty}` };
  }

  if (qty > 999) {
    return { isValid: false, error: "Quantity cannot exceed 999" };
  }

  if (!Number.isInteger(qty)) {
    return { isValid: false, error: "Quantity must be a whole number" };
  }

  if (maxStock && qty > maxStock) {
    return {
      isValid: false,
      error: `Only ${maxStock} items available in stock`,
    };
  }

  return { isValid: true, error: "" };
};

// Price validation
export const validatePrice = (
  price: number,
  minPrice: number = 0
): ValidationResult => {
  if (!price && price !== 0) {
    return { isValid: false, error: "Price is required" };
  }

  if (typeof price !== "number" || isNaN(price)) {
    return { isValid: false, error: "Price must be a valid number" };
  }

  if (price < minPrice) {
    return { isValid: false, error: `Price must be at least $${minPrice}` };
  }

  if (price > 9999.99) {
    return { isValid: false, error: "Price cannot exceed $9,999.99" };
  }

  // Check if price has more than 2 decimal places
  if (Number(price.toFixed(2)) !== price) {
    return {
      isValid: false,
      error: "Price cannot have more than 2 decimal places",
    };
  }

  return { isValid: true, error: "" };
};

// Credit card number validation
export const validateCreditCard = (cardNumber: string): ValidationResult => {
  if (!cardNumber) {
    return { isValid: false, error: "Credit card number is required" };
  }

  if (typeof cardNumber !== "string") {
    return { isValid: false, error: "Credit card number must be a string" };
  }

  // Remove all non-digit characters
  const cleanCardNumber = cardNumber.replace(/\D/g, "");

  if (cleanCardNumber.length === 0) {
    return { isValid: false, error: "Credit card number cannot be empty" };
  }

  if (cleanCardNumber.length !== 16) {
    return {
      isValid: false,
      error: "Credit card number must be exactly 16 digits",
    };
  }

  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;

  for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanCardNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return { isValid: true, error: "" };
};

// CVV validation
export const validateCVV = (
  cvv: string,
  cardType?: string
): ValidationResult => {
  if (!cvv) {
    return { isValid: false, error: "CVV is required" };
  }

  if (typeof cvv !== "string") {
    return { isValid: false, error: "CVV must be a string" };
  }

  const cleanCVV = cvv.replace(/\D/g, "");

  if (cleanCVV.length === 0) {
    return { isValid: false, error: "CVV cannot be empty" };
  }

  // American Express CVV is 4 digits, others are 3
  const expectedLength = cardType === "amex" ? 4 : 3;

  if (cleanCVV.length !== expectedLength) {
    return { isValid: false, error: `CVV must be ${expectedLength} digits` };
  }

  return { isValid: true, error: "" };
};

// Expiration date validation
export const validateExpirationDate = (
  month: string,
  year: string
): ValidationResult => {
  if (!month || !year) {
    return { isValid: false, error: "Expiration date is required" };
  }

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (isNaN(monthNum) || isNaN(yearNum)) {
    return { isValid: false, error: "Invalid expiration date format" };
  }

  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, error: "Month must be between 1 and 12" };
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Handle 2-digit years (assume 20xx)
  const fullYear = yearNum < 100 ? 2000 + yearNum : yearNum;

  if (
    fullYear < currentYear ||
    (fullYear === currentYear && monthNum < currentMonth)
  ) {
    return { isValid: false, error: "Card has expired" };
  }

  if (fullYear > currentYear + 20) {
    return {
      isValid: false,
      error: "Expiration year is too far in the future",
    };
  }

  return { isValid: true, error: "" };
};

// Book title validation
export const validateBookTitle = (title: string): ValidationResult => {
  if (!title) {
    return { isValid: false, error: "Book title is required" };
  }

  if (typeof title !== "string") {
    return { isValid: false, error: "Book title must be a string" };
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    return { isValid: false, error: "Book title cannot be empty" };
  }

  if (trimmedTitle.length < 1) {
    return {
      isValid: false,
      error: "Book title must be at least 1 character long",
    };
  }

  if (trimmedTitle.length > 200) {
    return {
      isValid: false,
      error: "Book title is too long (max 200 characters)",
    };
  }

  return { isValid: true, error: "" };
};

// Author validation
export const validateAuthor = (author: string): ValidationResult => {
  return validateName(author, "Author");
};

// ISBN validation
export const validateISBN = (isbn: string): ValidationResult => {
  if (!isbn) {
    return { isValid: false, error: "ISBN is required" };
  }

  if (typeof isbn !== "string") {
    return { isValid: false, error: "ISBN must be a string" };
  }

  // Remove hyphens and spaces
  const cleanISBN = isbn.replace(/[-\s]/g, "");

  if (cleanISBN.length === 0) {
    return { isValid: false, error: "ISBN cannot be empty" };
  }

  // Check for ISBN-10 or ISBN-13
  if (cleanISBN.length === 10) {
    // ISBN-10 validation
    if (!/^\d{9}[\dX]$/.test(cleanISBN)) {
      return { isValid: false, error: "Invalid ISBN-10 format" };
    }
  } else if (cleanISBN.length === 13) {
    // ISBN-13 validation
    if (!/^\d{13}$/.test(cleanISBN)) {
      return { isValid: false, error: "Invalid ISBN-13 format" };
    }
  } else {
    return { isValid: false, error: "ISBN must be 10 or 13 characters long" };
  }

  return { isValid: true, error: "" };
};

// Search query validation
export const validateSearchQuery = (query: string): ValidationResult => {
  if (!query) {
    return { isValid: false, error: "Search query is required" };
  }

  if (typeof query !== "string") {
    return { isValid: false, error: "Search query must be a string" };
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return { isValid: false, error: "Search query cannot be empty" };
  }

  if (trimmedQuery.length < 2) {
    return {
      isValid: false,
      error: "Search query must be at least 2 characters long",
    };
  }

  if (trimmedQuery.length > 100) {
    return {
      isValid: false,
      error: "Search query is too long (max 100 characters)",
    };
  }

  return { isValid: true, error: "" };
};

// Generic required field validation
export const validateRequired = (
  value: any,
  fieldName: string
): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === "string" && value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return {
      isValid: false,
      error: `${fieldName} must have at least one item`,
    };
  }

  return { isValid: true, error: "" };
};

// Formatting functions for better user experience

// Format credit card number with spaces
export const formatCreditCard = (cardNumber: string): string => {
  if (!cardNumber) return "";

  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, "");

  // Limit to 16 digits max
  const limitedNumber = cleanNumber.substring(0, 16);

  // Add spaces every 4 digits
  const formatted = limitedNumber.replace(/(\d{4})(?=\d)/g, "$1 ");

  // Return formatted string
  return formatted;
};

// Format expiry date as MM/YY
export const formatExpiryDate = (expiryDate: string): string => {
  if (!expiryDate) return "";

  // Remove all non-digit characters
  const cleanDate = expiryDate.replace(/\D/g, "");

  // Add slash after 2 digits
  if (cleanDate.length >= 2) {
    return cleanDate.substring(0, 2) + "/" + cleanDate.substring(2, 4);
  }

  return cleanDate;
};

// Format phone number as (XXX) XXX-XXXX
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, "");

  // Limit to 10 digits max
  const limitedPhone = cleanPhone.substring(0, 10);

  // Format as (XXX) XXX-XXXX
  if (limitedPhone.length >= 10) {
    return `(${limitedPhone.substring(0, 3)}) ${limitedPhone.substring(
      3,
      6
    )}-${limitedPhone.substring(6, 10)}`;
  } else if (limitedPhone.length >= 6) {
    return `(${limitedPhone.substring(0, 3)}) ${limitedPhone.substring(
      3,
      6
    )}-${limitedPhone.substring(6)}`;
  } else if (limitedPhone.length >= 3) {
    return `(${limitedPhone.substring(0, 3)}) ${limitedPhone.substring(3)}`;
  }

  return limitedPhone;

  return cleanPhone;
};

// Format ZIP code as XXXXX or XXXXX-XXXX
export const formatZipCode = (zipCode: string): string => {
  if (!zipCode) return "";

  // Remove all non-digit characters
  const cleanZip = zipCode.replace(/\D/g, "");

  // Add dash after 5 digits if there are more
  if (cleanZip.length > 5) {
    return cleanZip.substring(0, 5) + "-" + cleanZip.substring(5, 9);
  }

  return cleanZip;
};

// Validate expiry date in MM/YY format
export const validateExpiryDate = (expiryDate: string): ValidationResult => {
  if (!expiryDate) {
    return { isValid: false, error: "Expiry date is required" };
  }

  const cleanDate = expiryDate.replace(/\D/g, "");

  if (cleanDate.length !== 4) {
    return { isValid: false, error: "Expiry date must be in MM/YY format" };
  }

  const month = cleanDate.substring(0, 2);
  const year = cleanDate.substring(2, 4);

  return validateExpirationDate(month, year);
};

// Form validation helper
export const validateForm = (
  validations: Record<string, () => ValidationResult>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(validations)) {
    const result = validator();
    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};
