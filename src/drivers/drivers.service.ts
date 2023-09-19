import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverProfile } from 'src/entities/drivers.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverProfile)
    private driverRepository: Repository<DriverProfile>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    if (user.role === 'driver') {
      throw new UnprocessableEntityException('Driver already exists');
    }

    const driver = new DriverProfile();
    driver.user = user;
    driver.user.role = 'driver';
    driver.isAvailable = true;

    const savedDriver = await this.driverRepository.save(driver);
    await this.userService.updateRole(userId, 'driver');

    return savedDriver;
  }

  async findOneByUserId(userId: number) {
    const driver = await this.driverRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!driver) {
      throw new UnprocessableEntityException('Driver not found');
    }
    return driver;
  }

  async deleteProfile(userId: number) {
    const driver = await this.findOneByUserId(userId);
    if (!driver) {
      throw new UnprocessableEntityException('Driver not found');
    }
    await this.driverRepository.delete(driver.id);
    await this.userService.updateRole(userId, 'consumer');
    return { deleted: true };
  }

  async updateProfileAvailability(userId: number) {
    const driver = await this.findOneByUserId(userId);
    if (!driver) {
      throw new UnprocessableEntityException('Driver not found');
    }
    driver.isAvailable = !driver.isAvailable;
    return await this.driverRepository.save(driver);
  }
}
