// Example TypeORM Entity for Calculator
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { CalculatorGrade } from './calculator-grade.entity';
import { CalculatorConfig } from './calculator-config.entity';

export enum CalculatorType {
  SIEVE_ANALYSIS = 'sieve_analysis',
  QUANTITY_ESTIMATOR = 'quantity_estimator',
  TEST_CALCULATOR = 'test_calculator',
  OTHER = 'other',
}

@Entity('calculators')
@Index(['slug'], { unique: true })
@Index(['categoryId'])
@Index(['calculatorType'])
@Index(['isActive', 'displayOrder'])
export class Calculator {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string;

  @Column({ type: 'int', unsigned: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.calculators, {
    onDelete: 'RESTRICT',
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: CalculatorType,
    default: CalculatorType.OTHER,
  })
  calculatorType: CalculatorType;

  @Column({ type: 'boolean', default: false })
  isBlendingEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'int', default: 1 })
  version: number;

  @OneToMany(() => CalculatorGrade, (grade) => grade.calculator, {
    cascade: true,
  })
  grades: CalculatorGrade[];

  @OneToMany(() => CalculatorConfig, (config) => config.calculator, {
    cascade: true,
  })
  configs: CalculatorConfig[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
