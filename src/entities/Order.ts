import {Entity,PrimaryGeneratedColumn,Column,ManyToMany,JoinTable,CreateDateColumn,UpdateDateColumn} from "typeorm";
import { Product } from "./Product";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  customerName: string;

  @Column({ length: 100 })
  customerEmail: string;

  @ManyToMany(() => Product)
  @JoinTable({
    name: "order_products",
    joinColumn: { name: "order_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" },
  })
  products: Product[];

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: "pending" })
  status: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
