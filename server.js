import express from 'express';
import axios from 'axios';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(express.json());
app.use(cors());

// License database (in production, this would be a real database)
const LICENSE_DATABASE = {
  'DEMO-TAWJEEH-2025-FREE': {
    isValid: true,
    userEmail: null, // Any email allowed for demo
    expirationDate: '2025-12-31T23:59:59.000Z',
    features: ['student_matcher', 'school_database', 'map_view', 'export_reports'],
    maxUsers: 1,
    plan: 'demo'
  },
  'PREMIUM-TAWJEEH-2025-FULL': {
    isValid: true,
    userEmail: 'admin@tawjeehexplorer.com',
    expirationDate: '2026-12-31T23:59:59.000Z',
    features: ['student_matcher', 'school_database', 'map_view', 'export_reports', 'advanced_filters', 'api_access', 'unlimited_searches'],
    maxUsers: 10,
    plan: 'premium'
  }
};

// License validation endpoint
app.post('/api/validate-license', async (req, res) => {
  try {
    const { licenseKey, userEmail } = req.body;

    if (!licenseKey || !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'License key and email are required'
      });
    }

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const licenseData = LICENSE_DATABASE[licenseKey];

    if (!licenseData) {
      return res.status(401).json({
        success: false,
        error: 'Invalid license key'
      });
    }

    if (!licenseData.isValid) {
      return res.status(401).json({
        success: false,
        error: 'License has been deactivated'
      });
    }

    const expirationDate = new Date(licenseData.expirationDate);
    const now = new Date();

    if (now > expirationDate) {
      return res.status(401).json({
        success: false,
        error: 'License has expired'
      });
    }

    // Check email restriction (for non-demo licenses)
    if (licenseData.userEmail && licenseData.userEmail !== userEmail) {
      return res.status(401).json({
        success: false,
        error: 'Email not authorized for this license'
      });
    }

    // Generate a session token for additional security
    const sessionToken = crypto.randomBytes(32).toString('hex');

    res.json({
      success: true,
      license: {
        isValid: true,
        licenseKey: licenseKey,
        expirationDate: licenseData.expirationDate,
        userEmail: userEmail,
        features: licenseData.features,
        plan: licenseData.plan,
        maxUsers: licenseData.maxUsers
      },
      sessionToken
    });

  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during license validation'
    });
  }
});

// Endpoint to check session validity
app.post('/api/check-session', async (req, res) => {
  try {
    const { sessionToken, licenseKey } = req.body;

    if (!sessionToken || !licenseKey) {
      return res.status(400).json({
        success: false,
        error: 'Session token and license key are required'
      });
    }

    // In production, you'd validate the session token against a database
    // For now, we'll just re-validate the license
    const licenseData = LICENSE_DATABASE[licenseKey];

    if (!licenseData || !licenseData.isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid session'
      });
    }

    const expirationDate = new Date(licenseData.expirationDate);
    const now = new Date();

    if (now > expirationDate) {
      return res.status(401).json({
        success: false,
        error: 'License has expired'
      });
    }

    res.json({
      success: true,
      valid: true
    });

  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during session check'
    });
  }
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "mistral",
      prompt: `You are EduBot, a Moroccan education advisor. ${message}`,
      stream: false
    });

    res.json({ reply: response.data.response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Tawjeeh Explorer API running on port 5000"));
