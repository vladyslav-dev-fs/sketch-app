import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Item {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'iPhone 11 Pro Max' })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Apple iPhone 11 Pro Max with triple cameras and 512GB storage',
  })
  @Column()
  itemDescription: string;

  @ApiProperty({
    example:
      'This is a high-end iPhone with a triple camera setup and an OLED display.',
  })
  @Column()
  aiDescription: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  bookmarked: boolean;

  @ApiProperty({ example: 'iPhone 11 Pro Max' })
  @Column()
  item: string;

  @ApiProperty({ example: 'Detailed description of the iPhone 11 Pro Max' })
  @Column()
  prompt: string;

  @ManyToOne(() => User, (user) => user.items, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: User;
}
