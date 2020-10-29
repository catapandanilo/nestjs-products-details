/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('product')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Column()
  deleted: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_At' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_At' })
  updatedAt: Date;
}
