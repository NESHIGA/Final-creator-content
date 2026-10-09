const { HttpError } = require('./error');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function requireFields(...fields) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = [];
    for (const field of fields) {
      const value = body[field];
      if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
        errors.push({ field, message: `${field} is required` });
      }
    }
    if (errors.length) return next(new HttpError(400, 'Validation failed', errors));
    next();
  };
}

function requireEmail(req, res, next) {
  const email = ((req.body || {}).email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return next(
      new HttpError(400, 'Validation failed', [
        { field: 'email', message: 'Please provide a valid email address' },
      ])
    );
  }
  next();
}

function pick(source, allowed) {
  const out = {};
  for (const key of allowed) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

module.exports = { requireFields, requireEmail, pick };
