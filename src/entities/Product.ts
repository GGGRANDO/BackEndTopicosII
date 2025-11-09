import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
