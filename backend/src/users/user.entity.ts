// src/users/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/items/item.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  @Column()
  email: string;

  @ApiProperty({ example: 'hashed-password' })
  @Column()
  password: string;

  @ApiProperty({ example: 'Vladyslav', required: false })
  @Column({ nullable: true })
  name?: string;

  @ApiProperty({ example: 5, description: 'Daily requests remaining' })
  @Column({ default: 5 })
  requests: number;

  @ApiProperty({ example: false, description: 'Pro plan status' })
  @Column({ default: false })
  proPlan: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Last request reset time',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastRequestReset: Date;

  @ApiProperty({ example: 'stripe_customer_id', required: false })
  @Column({ nullable: true })
  stripeCustomerId?: string;

  @OneToMany(() => Item, (item) => item.user, {
    cascade: true,
    eager: true,
  })
  items: Item[];
}
