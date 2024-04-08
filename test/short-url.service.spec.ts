import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortener } from 'src/models';
import { ShotnerService } from 'src/services/shortner';
describe('ShotnerService', () => {
  let service: ShotnerService;
  const mockShortURLModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShotnerService,
        {
          provide: getModelToken(UrlShortener.name),
          useValue: mockShortURLModel,
        },
      ],
    }).compile();

    service = module.get<ShotnerService>(ShotnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenURL', () => {
    it('should generate a short URL and save it to the database', async () => {
      const longURL = 'https://youtube.com';
      mockShortURLModel.create.mockResolvedValueOnce({});
      const shortURL = await service.shortenUrl({ longURL: longURL });
      expect(shortURL).toEqual(expect.any(String));
      expect(mockShortURLModel.create).toHaveBeenCalledWith({
        longURL,
        shortURL,
      });
    });
  });

  describe('getLongURL', () => {
    it('should return the long URL for a given short URL', async () => {
      const shortURL = 'abc123';
      const longURL = 'https://youtube.com';
      mockShortURLModel.findOne.mockResolvedValueOnce({ longURL });
      const result = await service.getLongUrl({ shortURL: shortURL });
      expect(result).toBe(longURL);
      expect(mockShortURLModel.findOne).toHaveBeenCalledWith({ shortURL });
    });

    it('should return null if the short URL is not found', async () => {
      const shortURL = 'invalidShortURL';
      mockShortURLModel.findOne.mockResolvedValueOnce(null);
      const result = await service.getLongUrl({ shortURL: shortURL });
      expect(result).toBeNull();
      expect(mockShortURLModel.findOne).toHaveBeenCalledWith({ shortURL });
    });
  });

  describe('getClicks', () => {
    it('should return the number of clicks for a given short URL', async () => {
      const shortURL = 'abc123';
      const clicks = 5;
      mockShortURLModel.findOne.mockResolvedValueOnce({ clicks });
      const result = await service.getClicks(shortURL);
      expect(result).toBe(clicks);
      expect(mockShortURLModel.findOne).toHaveBeenCalledWith({ shortURL });
    });

    it('should return 0 if the short URL is not found', async () => {
      const shortURL = 'invalidShortURL';
      mockShortURLModel.findOne.mockResolvedValueOnce(null);
      const result = await service.getClicks(shortURL);
      expect(result).toBe(0);
      expect(mockShortURLModel.findOne).toHaveBeenCalledWith({ shortURL });
    });
  });
});
