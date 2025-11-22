import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/datasource';

const random = () => Math.random().toString(36).substring(2, 8);

describe('Products', () => {
  let token: string;
  beforeAll(async () => {
    await AppDataSource.initialize();
    const login = 'puser_' + random();
    const password = 'ppass_' + random();
    await request(app).post('/api/users').send({ login, password });
    const res = await request(app).post('/api/login').send({ login, password });
    token = res.body.token;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should create, list, update and delete a product', async () => {
    const payload = { name: 'prod-' + random(), description: 'desc', price: 9.99 };
    const create = await request(app).post('/api/products').set('Authorization', `Bearer ${token}`).send(payload);
    expect(create.status).toBe(201);
    const product = create.body;
    expect(product).toHaveProperty('id');

    const list = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);

    const updated = await request(app).put(`/api/products/${product.id}`).set('Authorization', `Bearer ${token}`).send({ name: 'updated' });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('updated');

    const del = await request(app).delete(`/api/products/${product.id}`).set('Authorization', `Bearer ${token}`);
    expect([200,204]).toContain(del.status);
  });
});

