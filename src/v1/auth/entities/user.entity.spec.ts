import { UserEntity } from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as faker from 'faker';

describe('User entity', () => {
  let user: UserEntity;

  beforeEach(() => {
    user = new UserEntity();
    user.password = faker.internet.password(8);
    user.salt = faker.lorem.word();
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    test('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue(user.password);
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword(user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
      expect(result).toEqual(true);
    });

    test('returns false as password is invalid', async () => {
      bcrypt.hash.mockReturnValue('invalidPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('invalidPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('invalidPassword', user.salt);
      expect(result).toEqual(false);
    });
  });
});
