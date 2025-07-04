// src/users/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
