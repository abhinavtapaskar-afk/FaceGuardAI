const validator = require('validator');

// Sanitize string input to prevent XSS
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return validator.escape(str.trim());
};

// Validate email
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }
  
  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  
  if (email.length > 255) {
    return { valid: false, message: 'Email too long' };
  }
  
  return { valid: true };
};

// Validate password
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Password too long' };
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: 'Password too weak. Please choose a stronger password' };
  }
  
  return { valid: true };
};

// Validate name
const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Name is required' };
  }
  
  const sanitized = sanitizeString(name);
  
  if (sanitized.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, message: 'Name too long' };
  }
  
  // Only allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(sanitized)) {
    return { valid: false, message: 'Name contains invalid characters' };
  }
  
  return { valid: true, sanitized };
};

// Validate file upload
const validateFileUpload = (file) => {
  if (!file) {
    return { valid: false, message: 'No file uploaded' };
  }
  
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, message: 'File size exceeds 5MB limit' };
  }
  
  // Check MIME type (only images)
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { valid: false, message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed' };
  }
  
  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return { valid: false, message: 'Invalid file extension' };
  }
  
  return { valid: true };
};

// Middleware: Validate signup input
const validateSignup = (req, res, next) => {
  const { email, password, name } = req.body;
  
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return res.status(400).json({
      error: true,
      message: emailValidation.message
    });
  }
  
  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: true,
      message: passwordValidation.message
    });
  }
  
  // Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return res.status(400).json({
      error: true,
      message: nameValidation.message
    });
  }
  
  // Sanitize inputs
  req.body.email = validator.normalizeEmail(email);
  req.body.name = nameValidation.sanitized;
  
  next();
};

// Middleware: Validate login input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return res.status(400).json({
      error: true,
      message: emailValidation.message
    });
  }
  
  // Validate password exists
  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      error: true,
      message: 'Password is required'
    });
  }
  
  // Sanitize email
  req.body.email = validator.normalizeEmail(email);
  
  next();
};

// Middleware: Validate file upload
const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: true,
      message: 'Please upload an image'
    });
  }
  
  const validation = validateFileUpload(req.file);
  if (!validation.valid) {
    return res.status(400).json({
      error: true,
      message: validation.message
    });
  }
  
  next();
};

// Sanitize object (recursive)
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

module.exports = {
  validateSignup,
  validateLogin,
  validateImageUpload,
  sanitizeString,
  sanitizeObject,
  validateEmail,
  validatePassword,
  validateName,
  validateFileUpload,
};
