import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/userdto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userBody: CreateUserDto) {
    const userEmailExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userBody.email })
      .orWhere('user.name = :name', { name: userBody.name })
      .orWhere('user.phoneNumber = :phoneNumber', {
        phoneNumber: userBody.phoneNumber,
      })
      .getOne();
    if (userEmailExists) {
      throw new ConflictException('User already exists');
    }

    const user = this.userRepository.create(userBody);
    user.role = 'consumer';
    return await this.userRepository.save(user);
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async updateRole(id: number, role: string) {
    const user = await this.findOneById(id);
    user.role = role;
    return await this.userRepository.save(user);
  }
}
