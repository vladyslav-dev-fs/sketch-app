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

  @OneToMany(() => Item, (item) => item.user, {
    cascade: true,
    eager: true,
  })
  items: Item[];
}
