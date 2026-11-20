import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import connectDatabase from './config/db.js';
import User from './models/User.js';
import Provider from './models/Provider.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}/api/auth`;

let server;

async function runTests() {
  console.log('--- STARTING DAY 6 TEST SUITE ---');

  // 1. Connect to MongoDB Atlas
  await connectDatabase();
  console.log('✓ Connected to MongoDB Atlas');

  // Start HTTP server for tests
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`✓ Test server running on ${BASE_URL}`);
      resolve();
    });
  });

  const testEmailCustomer = `test.customer.${Date.now()}@example.com`;
  const testEmailProvider = `test.provider.${Date.now()}@example.com`;
  const testPassword = 'Password@123';

  let customerToken = '';
  let providerToken = '';
  let createdCustomerId = '';
  let createdProviderId = '';

  try {
    // ---------------------------------------------------------
    // TEST 1: Register Customer
    // ---------------------------------------------------------
    console.log('\n[Test 1] Register new customer...');
    const res1 = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Deepti Customer',
        email: testEmailCustomer,
        phone: '9876543210',
        password: testPassword,
        role: 'CUSTOMER',
      }),
    });
    const data1 = await res1.json();
    if (res1.status !== 201 || !data1.success || data1.user.role !== 'CUSTOMER') {
      throw new Error(`Test 1 Failed: Status ${res1.status}, Data: ${JSON.stringify(data1)}`);
    }
    if (data1.user.password || data1.token === undefined && !data1.user.id) {
      throw new Error('Test 1 Failed: Password exposed or invalid response format');
    }
    createdCustomerId = data1.user.id;
    console.log('✓ Customer registered successfully:', data1.user);

    // ---------------------------------------------------------
    // TEST 2: Register Provider (Creates both User and Provider)
    // ---------------------------------------------------------
    console.log('\n[Test 2] Register new service provider...');
    const res2 = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Provider',
        email: testEmailProvider,
        phone: '9876543211',
        password: testPassword,
        role: 'PROVIDER',
        skills: ['Electrical repair', 'AC servicing'],
        experience: 5,
        serviceAreas: ['Jaipur', 'Mansarovar'],
        description: 'Certified electrical expert with 5 years experience.',
        hourlyRate: 500,
      }),
    });
    const data2 = await res2.json();
    if (res2.status !== 201 || !data2.success || data2.user.role !== 'PROVIDER' || !data2.provider) {
      throw new Error(`Test 2 Failed: Status ${res2.status}, Data: ${JSON.stringify(data2)}`);
    }
    createdProviderId = data2.user.id;
    console.log('✓ Provider registered successfully with linked profile:', data2.provider.verificationStatus);

    // ---------------------------------------------------------
    // TEST 3: Verify MongoDB documents and bcrypt hash
    // ---------------------------------------------------------
    console.log('\n[Test 3] Verifying MongoDB Atlas documents & password hashing...');
    const userInDb = await User.findById(createdCustomerId).select('+password');
    if (!userInDb) throw new Error('User not found in DB');
    if (!userInDb.password.startsWith('$2') && !userInDb.password.startsWith('$2a$') && !userInDb.password.startsWith('$2b$')) {
      throw new Error('User password is NOT hashed with bcrypt!');
    }
    const isBcryptMatching = await bcrypt.compare(testPassword, userInDb.password);
    if (!isBcryptMatching) throw new Error('bcrypt.compare failed on stored password');

    const providerInDb = await Provider.findOne({ userId: createdProviderId });
    if (!providerInDb) throw new Error('Provider document was NOT created for PROVIDER user!');
    if (providerInDb.verificationStatus !== 'PENDING') throw new Error('Provider verificationStatus is not PENDING');
    console.log('✓ Password is verified bcrypt hash. Provider document verified with PENDING status.');

    // ---------------------------------------------------------
    // TEST 4: Reject Duplicate Email Registration
    // ---------------------------------------------------------
    console.log('\n[Test 4] Reject duplicate email registration...');
    const res4 = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: testEmailCustomer,
        phone: '9876543299',
        password: testPassword,
        role: 'CUSTOMER',
      }),
    });
    const data4 = await res4.json();
    if (res4.status !== 409 && res4.status !== 400 || data4.success) {
      throw new Error(`Test 4 Failed: Expected 409/400 but got ${res4.status}`);
    }
    console.log('✓ Duplicate email correctly rejected with error:', data4.message);

    // ---------------------------------------------------------
    // TEST 5: Reject Registration Missing Required Fields
    // ---------------------------------------------------------
    console.log('\n[Test 5] Reject registration with missing required fields...');
    const res5 = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: 'test@example.com',
      }),
    });
    if (res5.status !== 400) throw new Error(`Test 5 Failed: Expected 400, got ${res5.status}`);
    console.log('✓ Missing fields rejected with 400.');

    // ---------------------------------------------------------
    // TEST 6: Reject Registration with Invalid Email
    // ---------------------------------------------------------
    console.log('\n[Test 6] Reject registration with invalid email...');
    const res6 = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid Email User',
        email: 'not-an-email',
        phone: '9876543210',
        password: testPassword,
      }),
    });
    if (res6.status !== 400) throw new Error(`Test 6 Failed: Expected 400, got ${res6.status}`);
    console.log('✓ Invalid email rejected with 400.');

    // ---------------------------------------------------------
    // TEST 7: Reject Registration as ADMIN
    // ---------------------------------------------------------
    console.log('\n[Test 7] Reject unauthorized registration as ADMIN...');
    const res7 = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Fake Admin',
        email: `admin.${Date.now()}@example.com`,
        phone: '9876543210',
        password: testPassword,
        role: 'ADMIN',
      }),
    });
    const data7 = await res7.json();
    if (res7.status !== 403 && res7.status !== 400 || data7.success) {
      throw new Error(`Test 7 Failed: Expected 403/400, got ${res7.status}`);
    }
    console.log('✓ ADMIN registration rejected with message:', data7.message);

    // ---------------------------------------------------------
    // TEST 8: Login with correct credentials (Customer)
    // ---------------------------------------------------------
    console.log('\n[Test 8] Login with correct customer credentials...');
    const res8 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmailCustomer,
        password: testPassword,
      }),
    });
    const data8 = await res8.json();
    if (res8.status !== 200 || !data8.token || !data8.user) {
      throw new Error(`Test 8 Failed: Status ${res8.status}, Data: ${JSON.stringify(data8)}`);
    }
    customerToken = data8.token;
    console.log('✓ Customer logged in successfully. Token generated.');

    // ---------------------------------------------------------
    // TEST 9: Login with correct credentials (Provider)
    // ---------------------------------------------------------
    console.log('\n[Test 9] Login with correct provider credentials...');
    const res9 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmailProvider,
        password: testPassword,
      }),
    });
    const data9 = await res9.json();
    if (res9.status !== 200 || !data9.token || data9.user.role !== 'PROVIDER') {
      throw new Error(`Test 9 Failed: Status ${res9.status}`);
    }
    providerToken = data9.token;
    console.log('✓ Provider logged in successfully with role and provider details.');

    // ---------------------------------------------------------
    // TEST 10: Login with Incorrect Password
    // ---------------------------------------------------------
    console.log('\n[Test 10] Reject login with incorrect password...');
    const res10 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmailCustomer,
        password: 'WrongPassword456!',
      }),
    });
    if (res10.status !== 401) throw new Error(`Test 10 Failed: Expected 401, got ${res10.status}`);
    console.log('✓ Incorrect password rejected with 401.');

    // ---------------------------------------------------------
    // TEST 11: Login with Unregistered Email
    // ---------------------------------------------------------
    console.log('\n[Test 11] Reject login with unregistered email...');
    const res11 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody-exists-here@example.com',
        password: testPassword,
      }),
    });
    if (res11.status !== 401) throw new Error(`Test 11 Failed: Expected 401, got ${res11.status}`);
    console.log('✓ Unregistered email rejected with 401.');

    // ---------------------------------------------------------
    // TEST 12: Login with Missing Fields
    // ---------------------------------------------------------
    console.log('\n[Test 12] Reject login with missing fields...');
    const res12 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmailCustomer }),
    });
    if (res12.status !== 400) throw new Error(`Test 12 Failed: Expected 400, got ${res12.status}`);
    console.log('✓ Missing login fields rejected with 400.');

    // ---------------------------------------------------------
    // TEST 13: Login with Inactive Account
    // ---------------------------------------------------------
    console.log('\n[Test 13] Reject login with inactive account...');
    const inactiveEmail = `inactive.${Date.now()}@example.com`;
    const inactiveUser = await User.create({
      name: 'Inactive User',
      email: inactiveEmail,
      phone: '9876543200',
      password: testPassword,
      role: 'CUSTOMER',
      isActive: false,
    });
    const res13 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inactiveEmail,
        password: testPassword,
      }),
    });
    if (res13.status !== 403) throw new Error(`Test 13 Failed: Expected 403, got ${res13.status}`);
    console.log('✓ Inactive account login rejected with 403.');
    await User.findByIdAndDelete(inactiveUser._id);

    // ---------------------------------------------------------
    // TEST 14: JWT Authentication - Valid Token
    // ---------------------------------------------------------
    console.log('\n[Test 14] Test protected route with valid token (GET /me)...');
    const res14 = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const data14 = await res14.json();
    if (res14.status !== 200 || data14.user.email !== testEmailCustomer) {
      throw new Error(`Test 14 Failed: Expected 200, got ${res14.status}`);
    }
    console.log('✓ Profile retrieved using valid JWT.');

    // ---------------------------------------------------------
    // TEST 15: JWT Authentication - Missing Token
    // ---------------------------------------------------------
    console.log('\n[Test 15] Test protected route with missing token...');
    const res15 = await fetch(`${BASE_URL}/me`);
    if (res15.status !== 401) throw new Error(`Test 15 Failed: Expected 401, got ${res15.status}`);
    console.log('✓ Missing token rejected with 401.');

    // ---------------------------------------------------------
    // TEST 16: JWT Authentication - Invalid Token
    // ---------------------------------------------------------
    console.log('\n[Test 16] Test protected route with invalid token...');
    const res16 = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: 'Bearer this.is.invalid' },
    });
    if (res16.status !== 401) throw new Error(`Test 16 Failed: Expected 401, got ${res16.status}`);
    console.log('✓ Invalid token rejected with 401.');

    // ---------------------------------------------------------
    // TEST 17: Role-Based Authorization
    // ---------------------------------------------------------
    console.log('\n[Test 17] Test role-based authorization...');
    // Customer accessing customer-only route -> 200
    const resCustOnly = await fetch(`${BASE_URL}/customer-only`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (resCustOnly.status !== 200) throw new Error(`Customer access failed: ${resCustOnly.status}`);

    // Customer accessing provider-only route -> 403
    const resCustOnProv = await fetch(`${BASE_URL}/provider-only`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (resCustOnProv.status !== 403) throw new Error(`Customer on provider route didn't return 403: got ${resCustOnProv.status}`);

    // Provider accessing provider-only route -> 200
    const resProvOnly = await fetch(`${BASE_URL}/provider-only`, {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    if (resProvOnly.status !== 200) throw new Error(`Provider access failed: ${resProvOnly.status}`);
    console.log('✓ Role-based authorization verified (Customer & Provider permissions enforced).');

    // ---------------------------------------------------------
    // TEST 18: Update Profile & Logout
    // ---------------------------------------------------------
    console.log('\n[Test 18] Test profile update and logout...');
    const resUpdate = await fetch(`${BASE_URL}/update-profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${customerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Deepti Updated Name',
        address: 'Civil Lines, Jaipur',
      }),
    });
    const dataUpdate = await resUpdate.json();
    if (resUpdate.status !== 200 || dataUpdate.user.name !== 'Deepti Updated Name') {
      throw new Error(`Profile update failed: Status ${resUpdate.status}`);
    }

    const resLogout = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (resLogout.status !== 200) throw new Error(`Logout failed: ${resLogout.status}`);
    console.log('✓ Profile update and logout completed successfully.');

    console.log('\n=========================================');
    console.log('ALL 18 DAY 6 TEST SCENARIOS PASSED 100%!');
    console.log('=========================================');
  } finally {
    // Clean up created test accounts so the DB stays tidy
    if (createdCustomerId) await User.findByIdAndDelete(createdCustomerId);
    if (createdProviderId) {
      await User.findByIdAndDelete(createdProviderId);
      await Provider.findOneAndDelete({ userId: createdProviderId });
    }
    if (server) server.close();
    await mongoose.connection.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err.message);
  if (server) server.close();
  process.exit(1);
});
