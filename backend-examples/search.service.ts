// Example Search Service with Redis Caching
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Calculator } from './calculator.entity';

@Injectable()
export class SearchService {
  private readonly SEARCH_INDEX_KEY = 'search:index';
  private readonly SEARCH_CACHE_TTL = 86400; // 24 hours

  constructor(
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async search(query: string, filters?: { category?: string; limit?: number }) {
    const { category, limit = 10 } = filters || {};

    // Try cache first
    const cacheKey = `search:${query}:${category || 'all'}:${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Build search query
    const queryBuilder = this.calculatorRepository
      .createQueryBuilder('calculator')
      .leftJoinAndSelect('calculator.category', 'category')
      .where('calculator.isActive = :isActive', { isActive: true })
      .andWhere(
        '(calculator.name LIKE :query OR calculator.description LIKE :query)',
        { query: `%${query}%` },
      );

    if (category) {
      queryBuilder.andWhere('category.slug = :category', { category });
    }

    const results = await queryBuilder
      .take(limit)
      .orderBy('calculator.displayOrder', 'ASC')
      .getMany();

    // Calculate relevance scores
    const scoredResults = results.map((calc) => ({
      calculator: {
        id: calc.id,
        slug: calc.slug,
        name: calc.name,
        description: calc.description,
        icon: calc.icon,
        category: {
          slug: calc.category.slug,
          name: calc.category.name,
        },
      },
      relevance: this.calculateRelevance(calc, query),
      matchedFields: this.getMatchedFields(calc, query),
    }));

    // Sort by relevance
    scoredResults.sort((a, b) => b.relevance - a.relevance);

    const response = {
      data: scoredResults,
      meta: {
        query,
        total: scoredResults.length,
        limit,
      },
    };

    // Cache result
    await this.cacheManager.set(cacheKey, response, this.SEARCH_CACHE_TTL);

    return response;
  }

  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (query.length < 2) {
      return [];
    }

    const cacheKey = `suggestions:${query}:${limit}`;
    const cached = await this.cacheManager.get<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const calculators = await this.calculatorRepository
      .createQueryBuilder('calculator')
      .select(['calculator.name', 'calculator.slug'])
      .where('calculator.isActive = :isActive', { isActive: true })
      .andWhere('calculator.name LIKE :query', { query: `%${query}%` })
      .take(limit * 2) // Get more for filtering
      .getMany();

    const suggestions = calculators
      .map((calc) => calc.name)
      .filter((name, index, self) => self.indexOf(name) === index)
      .slice(0, limit);

    await this.cacheManager.set(cacheKey, suggestions, 3600); // 1 hour

    return suggestions;
  }

  async rebuildSearchIndex() {
    // Get all active calculators
    const calculators = await this.calculatorRepository.find({
      where: { isActive: true },
      relations: ['category'],
    });

    // Build search index
    const index = calculators.map((calc) => ({
      id: calc.id,
      slug: calc.slug,
      name: calc.name,
      description: calc.description,
      category: calc.category.slug,
      keywords: this.extractKeywords(calc),
    }));

    // Store in Redis
    await this.cacheManager.set(this.SEARCH_INDEX_KEY, index, 0); // No expiry

    return { message: 'Search index rebuilt successfully', count: index.length };
  }

  private calculateRelevance(calculator: Calculator, query: string): number {
    const queryLower = query.toLowerCase();
    const nameLower = calculator.name.toLowerCase();
    const descLower = calculator.description?.toLowerCase() || '';

    let score = 0;

    // Exact match in name
    if (nameLower === queryLower) {
      score += 100;
    }
    // Name starts with query
    else if (nameLower.startsWith(queryLower)) {
      score += 80;
    }
    // Name contains query
    else if (nameLower.includes(queryLower)) {
      score += 50;
    }

    // Description contains query
    if (descLower.includes(queryLower)) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  private getMatchedFields(calculator: Calculator, query: string): string[] {
    const queryLower = query.toLowerCase();
    const matched: string[] = [];

    if (calculator.name.toLowerCase().includes(queryLower)) {
      matched.push('name');
    }
    if (calculator.description?.toLowerCase().includes(queryLower)) {
      matched.push('description');
    }

    return matched;
  }

  private extractKeywords(calculator: Calculator): string[] {
    const text = `${calculator.name} ${calculator.description || ''}`.toLowerCase();
    const words = text.split(/\s+/).filter((word) => word.length > 2);
    return [...new Set(words)]; // Remove duplicates
  }
}
