import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { In } from "typeorm";

export class OrderController {
  static async getAll(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const orders = await orderRepository.find({ relations: ["products"] });
    const normalized = orders.map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      products: o.products.map((p) => ({ ...p, price: Number(p.price) })),
    }));
    return res.json(normalized);
  }

  static async getById(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const { id } = req.params;
    const order = await orderRepository.findOne({
      where: { id: Number(id) },
      relations: ["products"],
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    const normalized = {
      ...order,
      totalAmount: Number(order.totalAmount),
      products: order.products.map((p) => ({ ...p, price: Number(p.price) })),
    };
    return res.json(normalized);
  }

  static async create(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);

    const { customerName, customerEmail, productIds, status } = req.body;

    const products = await productRepository.findBy({
      id: In(productIds as number[]),
    });

    if (products.length === 0)
      return res.status(400).json({ message: "No valid products found" });

    const totalAmount = products.reduce(
      (sum, product) => sum + Number(product.price),
      0
    );

    const order = orderRepository.create({
      customerName,
      customerEmail,
      products,
      totalAmount,
      status,
    });

    await orderRepository.save(order);
    const normalized = {
      ...order,
      totalAmount: Number(order.totalAmount),
      products: order.products.map((p) => ({ ...p, price: Number(p.price) })),
    };
    return res.status(201).json(normalized);
  }

  static async update(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);

    const { id } = req.params;
    const { customerName, customerEmail, productIds, status } = req.body;

    const order = await orderRepository.findOne({
      where: { id: Number(id) },
      relations: ["products"],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const products = productIds
      ? await productRepository.findBy({ id: In(productIds as number[]) })
      : order.products;

    const totalAmount = products.reduce(
      (sum, product) => sum + Number(product.price),
      0
    );

    order.customerName = customerName ?? order.customerName;
    order.customerEmail = customerEmail ?? order.customerEmail;
    order.products = products;
    order.status = status ?? order.status;
    order.totalAmount = totalAmount;

    await orderRepository.save(order);
    const normalized = {
      ...order,
      totalAmount: Number(order.totalAmount),
      products: order.products.map((p) => ({ ...p, price: Number(p.price) })),
    };
    return res.json(normalized);
  }

  static async delete(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);

    const { id } = req.params;
    const order = await orderRepository.findOneBy({ id: Number(id) });
    if (!order) return res.status(404).json({ message: "Order not found" });

    await orderRepository.remove(order);
    return res.status(204).send();
  }
  static async getProductsByOrder(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const { id } = req.params;

    const order = await orderRepository.findOne({
      where: { id: Number(id) },
      relations: ["products"],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order.products);
  }
  static async addProductsToOrder(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);
    const { id } = req.params;
    const { productIds } = req.body;

    const order = await orderRepository.findOne({
      where: { id: Number(id) },
      relations: ["products"],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const productsToAdd = await productRepository.findBy({ id: In(productIds) });

    if (productsToAdd.length === 0)
      return res.status(400).json({ message: "No valid products found" });

    // evita duplicados
    const existingIds = order.products.map((p) => p.id);
    const newProducts = productsToAdd.filter((p) => !existingIds.includes(p.id));

    order.products = [...order.products, ...newProducts];
    order.totalAmount = order.products.reduce(
      (sum, p) => sum + Number(p.price),
      0
    );

    await orderRepository.save(order);
    const normalized = {
      ...order,
      totalAmount: Number(order.totalAmount),
      products: order.products.map((p) => ({ ...p, price: Number(p.price) })),
    };
    return res.status(200).json(normalized);
  }

  static async removeProductsFromOrder(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const { id } = req.params;
    const { productIds } = req.body;

    const order = await orderRepository.findOne({
      where: { id: Number(id) },
      relations: ["products"],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.products = order.products.filter(
      (p) => !productIds.includes(p.id)
    );

    order.totalAmount = order.products.reduce(
      (sum, p) => sum + Number(p.price),
      0
    );

    await orderRepository.save(order);
    const normalized = {
      ...order,
      totalAmount: Number(order.totalAmount),
      products: order.products.map((p) => ({ ...p, price: Number(p.price) })),
    };
    return res.status(200).json(normalized);
  }
}
