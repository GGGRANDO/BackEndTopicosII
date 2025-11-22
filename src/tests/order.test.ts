import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/datasource';

const random = () => Math.random().toString(36).substring(2, 8);

describe('Orders', () => {
  let token: string;
  beforeAll(async () => {
    await AppDataSource.initialize();
    const login = 'o_user_' + random();
    const password = 'o_pass_' + random();
    await request(app).post('/api/users').send({ login, password });
    const res = await request(app).post('/api/login').send({ login, password });
    token = res.body.token;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should create order with products and return products and totalAmount', async () => {
    const p1 = await request(app).post('/api/products').set('Authorization', `Bearer ${token}`).send({ name: 'p1_' + random(), price: 5.5 });
    const p2 = await request(app).post('/api/products').set('Authorization', `Bearer ${token}`).send({ name: 'p2_' + random(), price: 4.25 });

    expect(p1.status).toBe(201);
    expect(p2.status).toBe(201);

    const productIds = [p1.body.id, p2.body.id];

    const orderResp = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send({ customerName: 'Test', customerEmail: 't@example.com', productIds });
    expect(orderResp.status).toBe(201);
    const order = orderResp.body;
    expect(order.products).toBeDefined();
    expect(Array.isArray(order.products)).toBe(true);
    expect(order.products.length).toBeGreaterThanOrEqual(2);
    expect(typeof order.totalAmount === 'number').toBe(true);
    const sum = order.products.reduce((s: number, p: any) => s + Number(p.price), 0);
    expect(Number(order.totalAmount)).toBeCloseTo(sum, 2);
  });
});

