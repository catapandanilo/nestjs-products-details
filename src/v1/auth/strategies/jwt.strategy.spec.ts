import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from '../repositories';
import * as faker from 'faker';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

const mockUser = {
  username: faker.internet.userName(),
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: UserRepository, useFactory: mockUserRepository }],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    test('validates and returns the user based on JWT payload', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await jwtStrategy.validate({
        username: mockUser.username,
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: mockUser.username,
      });
      expect(result).toEqual(mockUser);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: mockUser.username })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
