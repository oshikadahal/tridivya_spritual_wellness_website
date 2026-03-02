import { YogaService } from '../../src/services/yoga.service';
import { YogaRepository } from '../../src/repositories/yoga.repository';
import { HttpError } from '../../src/errors/http-error';

jest.mock('../../src/repositories/yoga.repository');

describe('YogaService', () => {
  let service: YogaService;
  let repository: jest.Mocked<YogaRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      getReviewSummary: jest.fn(),
      // add other methods if YogaRepository has more
    } as unknown as jest.Mocked<YogaRepository>;
    (YogaRepository as unknown as jest.Mock).mockImplementation(() => repository);
    service = new YogaService();
  });

  it('should create a yoga item', async () => {
    repository.create.mockResolvedValue({ id: '1', title: 'Yoga 1' } as any);
    const result = await service.create({ title: 'Yoga 1', image_url: 'img.jpg' } as any);
    expect(result).toHaveProperty('id', '1');
    expect(result).toHaveProperty('title', 'Yoga 1');
    expect(repository.create).toHaveBeenCalled();
  });

  it('should find all yoga items', async () => {
    repository.findAll.mockResolvedValue({ data: [{ id: '1', title: 'Yoga 1' } as any], total: 1, page: 1, limit: 10 } as any);
    const result = await service.findAll({} as any);
    expect(result).toHaveProperty('data');
    expect(result.data[0]).toHaveProperty('id', '1');
  });

  it('should find yoga by id and return review summary', async () => {
    repository.findById.mockResolvedValue({ id: '1', title: 'Yoga 1' } as any);
    repository.getReviewSummary.mockResolvedValue({ average_rating: 5, total_reviews: 2 });
    const result = await service.findById('1');
    expect(result.review_summary).toEqual({ average_rating: 5, total_reviews: 2 });
  });

  it('should throw 404 if yoga not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById('bad')).rejects.toThrow(HttpError);
  });
});