// Example Service for Calculator Module
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calculator } from './calculator.entity';
import { CalculatorGrade } from './calculator-grade.entity';
import { CalculatorConfig } from './calculator-config.entity';
import { CreateCalculatorDto } from './dto/create-calculator.dto';
import { UpdateCalculatorDto } from './dto/update-calculator.dto';

@Injectable()
export class CalculatorService {
  constructor(
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
    @InjectRepository(CalculatorGrade)
    private gradeRepository: Repository<CalculatorGrade>,
    @InjectRepository(CalculatorConfig)
    private configRepository: Repository<CalculatorConfig>,
  ) {}

  async findAll(filters: {
    category?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, type, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.calculatorRepository
      .createQueryBuilder('calculator')
      .leftJoinAndSelect('calculator.category', 'category')
      .leftJoinAndSelect('calculator.grades', 'grades')
      .where('calculator.isActive = :isActive', { isActive: true });

    if (category) {
      queryBuilder.andWhere('category.slug = :category', { category });
    }

    if (type) {
      queryBuilder.andWhere('calculator.calculatorType = :type', { type });
    }

    queryBuilder
      .orderBy('calculator.displayOrder', 'ASC')
      .addOrderBy('calculator.name', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const calculator = await this.calculatorRepository.findOne({
      where: { slug, isActive: true },
      relations: ['category', 'grades', 'configs'],
    });

    if (!calculator) {
      throw new NotFoundException(`Calculator with slug "${slug}" not found`);
    }

    return calculator;
  }

  async getGrades(calculatorSlug: string) {
    const calculator = await this.findBySlug(calculatorSlug);
    return calculator.grades.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getConfig(
    calculatorSlug: string,
    gradeSlug?: string,
  ): Promise<CalculatorConfig> {
    const calculator = await this.findBySlug(calculatorSlug);

    let gradeId: number | null = null;
    if (gradeSlug) {
      const grade = await this.gradeRepository.findOne({
        where: { calculatorId: calculator.id, gradeSlug },
      });
      if (grade) {
        gradeId = grade.id;
      }
    }

    const config = await this.configRepository.findOne({
      where: {
        calculatorId: calculator.id,
        gradeId: gradeId || null,
      },
      order: { id: 'DESC' }, // Get most recent
    });

    if (!config) {
      throw new NotFoundException(
        `Config not found for calculator "${calculatorSlug}"`,
      );
    }

    return config;
  }

  async create(createDto: CreateCalculatorDto) {
    const calculator = this.calculatorRepository.create(createDto);
    return await this.calculatorRepository.save(calculator);
  }

  async update(slug: string, updateDto: UpdateCalculatorDto) {
    const calculator = await this.findBySlug(slug);
    Object.assign(calculator, updateDto);
    calculator.version += 1;
    return await this.calculatorRepository.save(calculator);
  }

  async delete(slug: string) {
    const calculator = await this.findBySlug(slug);
    await this.calculatorRepository.remove(calculator);
    return { message: 'Calculator deleted successfully' };
  }
}
