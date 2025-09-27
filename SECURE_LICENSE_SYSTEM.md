# TawjeehExplorer License System

## Overview

The TawjeehExplorer platform now uses a secure server-side license validation system instead of client-side validation, making it much more difficult to bypass licensing restrictions.

## Architecture

### Server-Side Components

**API Endpoints:**
- `POST /api/validate-license` - Validates license keys and returns available features
- `POST /api/check-session` - Validates existing session tokens

**Security Features:**
- Server-side license database (not accessible from client)
- Session tokens for additional security
- Email-based restrictions for premium licenses
- Expiration date validation
- Feature-based access control

### Client-Side Components

**LicenseValidator.tsx:**
- Makes API calls to validate licenses
- Handles session management
- Stores session tokens securely
- Provides license prompt UI

**LicenseContext.tsx:**
- Manages license state across the application
- Provides utility functions for feature checking
- Handles license plan information

## Available License Types

### Demo License
```
License Key: DEMO-TAWJEEH-2025-FREE
Email: Any email address
Expiration: December 31, 2025
Features: student_matcher, school_database, map_view, export_reports
Max Users: 1
```

### Premium License
```
License Key: PREMIUM-TAWJEEH-2025-FULL
Email: admin@tawjeehexplorer.com (restricted)
Expiration: December 31, 2026
Features: All features including advanced_filters, api_access, unlimited_searches
Max Users: 10
```

## API Documentation

### POST /api/validate-license

**Request:**
```json
{
  "licenseKey": "DEMO-TAWJEEH-2025-FREE",
  "userEmail": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "license": {
    "isValid": true,
    "licenseKey": "DEMO-TAWJEEH-2025-FREE",
    "expirationDate": "2025-12-31T23:59:59.000Z",
    "userEmail": "user@example.com",
    "features": ["student_matcher", "school_database", "map_view", "export_reports"],
    "plan": "demo",
    "maxUsers": 1
  },
  "sessionToken": "c8afb66862d60054d99286b6d8343a75c7f6a6d97786ae0da51dcb5bcc2999e4"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid license key"
}
```

### POST /api/check-session

**Request:**
```json
{
  "sessionToken": "c8afb66862d60054d99286b6d8343a75c7f6a6d97786ae0da51dcb5bcc2999e4",
  "licenseKey": "DEMO-TAWJEEH-2025-FREE"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true
}
```

## Security Features

### 1. Server-Side Validation
- License keys are validated on the server, not in client JavaScript
- Impossible to bypass by modifying client code
- License database is not exposed to the client

### 2. Session Tokens
- Random 32-byte session tokens generated on successful validation
- Tokens are used for subsequent session validation
- Additional layer of security beyond license keys

### 3. Email Restrictions
- Premium licenses can be restricted to specific email addresses
- Demo licenses allow any email address
- Prevents unauthorized sharing of premium licenses

### 4. Expiration Handling
- Server-side expiration date validation
- Automatic session invalidation for expired licenses
- Clear error messages for expired licenses

### 5. Feature-Based Access Control
- Features are defined server-side and returned to client
- Client code checks features using `hasFeature()` function
- Different license types have different feature sets

## Usage in Client Code

### Checking if a feature is available:
```tsx
import { useLicense } from '../contexts/LicenseContext';

const MyComponent = () => {
  const { hasFeature } = useLicense();
  
  if (hasFeature('advanced_filters')) {
    // Show advanced filters
  }
  
  return <div>...</div>;
};
```

### Getting license information:
```tsx
const { licenseInfo, getLicensePlan, getMaxUsers } = useLicense();

console.log('Plan:', getLicensePlan()); // "demo" or "premium"
console.log('Max Users:', getMaxUsers()); // 1 or 10
console.log('Features:', licenseInfo?.features);
```

## Development Setup

### Start both client and server:
```bash
npm run dev:full
```

### Start server only:
```bash
npm run server
```

### Start client only:
```bash
npm run dev
```

### Test API endpoints:
```bash
node test-license-api.js
```

## Production Considerations

### 1. Database Integration
In production, replace the hardcoded LICENSE_DATABASE with a real database:
- PostgreSQL, MySQL, or MongoDB
- Encrypted license storage
- Audit logging for license usage

### 2. Rate Limiting
Add rate limiting to prevent brute-force license attacks:
```javascript
const rateLimit = require('express-rate-limit');

const licenseLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many license validation attempts'
});

app.use('/api/validate-license', licenseLimit);
```

### 3. HTTPS Only
Ensure all license validation happens over HTTPS in production.

### 4. Environment Variables
Move sensitive configuration to environment variables:
```javascript
const LICENSE_SECRET = process.env.LICENSE_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
```

### 5. Session Storage
Use Redis or database for session token storage instead of in-memory.

## Error Handling

The system provides clear error messages for different scenarios:
- Invalid license key
- Expired license
- Email not authorized
- Server connection errors
- Malformed requests

## Testing

Run the test script to verify API functionality:
```bash
node test-license-api.js
```

This tests:
- Valid demo license validation
- Valid premium license validation
- Invalid license rejection
- Email restriction enforcement

## Migration from Client-Side

The new system automatically handles migration from the old client-side validation:
- Existing localStorage data is validated against the server
- Invalid or expired licenses prompt for re-entry
- Session tokens are generated for valid licenses
