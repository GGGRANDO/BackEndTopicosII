import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/datasource';

const random = () => Math.random().toString(36).substring(2, 8);

describe('Auth', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should register, login and access protected route', async () => {
    const login = 'u_' + random();
    const password = 'p_' + random();

    const signup = await request(app).post('/api/users').send({ login, password });
    expect([201, 200]).toContain(signup.status);

    const res = await request(app).post('/api/login').send({ login, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    const token = res.body.token;

    const users = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);
    expect(Array.isArray(users.body)).toBe(true);
  });
});
