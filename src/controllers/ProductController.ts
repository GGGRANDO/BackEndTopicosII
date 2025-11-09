import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Product } from "../entities/Product";

const productRepository = AppDataSource.getRepository(Product);

export class ProductController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const products = await productRepository.find();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching products", error });
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const product = await productRepository.findOneBy({ id: Number(id) });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching product", error });
    }
  }

  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, price, category, isAvailable } = req.body;

      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
      }

      const newProduct = productRepository.create({
        name,
        description,
        price
      });

      await productRepository.save(newProduct);
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: "Error creating product", error });
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;

      const product = await productRepository.findOneBy({ id: Number(id) });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      productRepository.merge(product, data);
      const updated = await productRepository.save(product);

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Error updating product", error });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const product = await productRepository.findOneBy({ id: Number(id) });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await productRepository.remove(product);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting product", error });
    }
  }
}
