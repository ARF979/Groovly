const request = require('supertest');
const createApp = require('../../app');

const app = createApp();

describe('Room API Tests', () => {
  let authToken;
  let roomId;

  // Setup: Register and login
  beforeAll(async () => {
    // Register
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.data.token;
  });

  test('should create a new room', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Room',
        mode: 'democratic'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('code');
    
    roomId = res.body.data._id;
  });

  test('should get room by ID', async () => {
    const res = await request(app)
      .get(`/api/rooms/${roomId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(roomId);
  });

  test('should fail to create room without auth', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({
        name: 'Test Room'
      });

    expect(res.status).toBe(401);
  });

  test('should get room queue', async () => {
    const res = await request(app)
      .get(`/api/rooms/${roomId}/queue`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
