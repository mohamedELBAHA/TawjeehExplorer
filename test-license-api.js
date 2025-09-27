#!/usr/bin/env node

// Test script for license validation API
const API_BASE_URL = 'http://localhost:5000';

async function testLicenseValidation() {
  console.log('🧪 Testing License Validation API\n');

  // Test 1: Valid demo license
  console.log('Test 1: Valid demo license');
  try {
    const response = await fetch(`${API_BASE_URL}/api/validate-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        licenseKey: 'DEMO-TAWJEEH-2025-FREE',
        userEmail: 'test@example.com'
      }),
    });

    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Valid premium license
  console.log('Test 2: Valid premium license');
  try {
    const response = await fetch(`${API_BASE_URL}/api/validate-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        licenseKey: 'PREMIUM-TAWJEEH-2025-FULL',
        userEmail: 'admin@tawjeehexplorer.com'
      }),
    });

    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Invalid license
  console.log('Test 3: Invalid license');
  try {
    const response = await fetch(`${API_BASE_URL}/api/validate-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        licenseKey: 'INVALID-KEY',
        userEmail: 'test@example.com'
      }),
    });

    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Premium license with wrong email
  console.log('Test 4: Premium license with wrong email');
  try {
    const response = await fetch(`${API_BASE_URL}/api/validate-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        licenseKey: 'PREMIUM-TAWJEEH-2025-FULL',
        userEmail: 'wrong@example.com'
      }),
    });

    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testLicenseValidation().catch(console.error);
