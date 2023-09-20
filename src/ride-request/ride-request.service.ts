import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RideRequest } from 'src/entities/rideRequest.entity';
import { In, Repository, EntityManager } from 'typeorm';
import { RideRequestDto } from './dto/riderRequestDto';
import { DriversService } from 'src/drivers/drivers.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RideRequestService {
  constructor(
    @InjectRepository(RideRequest)
    private readonly rideRequestRepository: Repository<RideRequest>,
    private readonly driverService: DriversService,
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(rideRequest: RideRequestDto, userId: number) {
    await this.entityManager.transaction(async (entityManager) => {
      const userRequest = await this.rideRequestRepository.find({
        where: { user: { id: userId }, status: In(['pending', 'accepted']) },
      });

      if (userRequest.length > 0) {
        throw new ConflictException(
          'Please cancel pending or accepted requests first',
        );
      }

      const newRideRequest = new RideRequest();
      const availableDrivers =
        await this.driverService.findAllAvailableDrivers();
      if (availableDrivers.length === 0) {
        throw new ConflictException('No available drivers');
      }
      const driver = availableDrivers[0];
      if (!driver.user) {
        throw new ConflictException('No available drivers');
      }
      const notAvailableDriver =
        await this.driverService.updateProfileAvailability(driver.user.id);

      if (!notAvailableDriver) {
        throw new ConflictException('Driver not available');
      }

      const user = await this.userService.findOneById(userId);

      newRideRequest.user = user;
      newRideRequest.pickup_location = rideRequest.pickup_location;
      newRideRequest.destination = rideRequest.destination;
      newRideRequest.status = 'pending';
      newRideRequest.driverProfile = notAvailableDriver;

      await entityManager.save(newRideRequest);
    });
  }

  async findAll(page: number = 1, perPage: number = 10) {
    const skip = (page - 1) * perPage;
    const take = perPage;
    const totalCount = await this.rideRequestRepository.count();
    const totalPages = Math.ceil(totalCount / perPage);
    if (page > totalPages) {
      return {
        page: page,
        data: [],
      };
    }

    const rideRequests = await this.rideRequestRepository.find({
      relations: ['user', 'driverProfile'],
      skip,
      take,
    });

    return {
      page: page,
      data: rideRequests,
    };
  }

  async findDriverRideRequests(driverId: number) {
    const driverProfile = await this.driverService.findOneByUserId(driverId);
    if (!driverProfile) {
      throw new ConflictException('Driver not found');
    }
    const rideRequests = await this.rideRequestRepository.find({
      where: { driverProfile: { id: driverProfile.id } },
      relations: ['user', 'driverProfile'],
    });
    return rideRequests;
  }

  async findUserRideRequests(userId: number) {
    const rideRequests = await this.rideRequestRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'driverProfile'],
    });
    return rideRequests;
  }

  async findPendingActiveUserRideReqs(userId: number) {
    const rideRequests = await this.rideRequestRepository.find({
      where: { user: { id: userId }, status: In(['pending', 'accepted']) },
      relations: ['user', 'driverProfile'],
    });
    return rideRequests;
  }

  async findPendingActiveDriverRideReqs(driverId: number) {
    const driver = await this.driverService.findOneByUserId(driverId);
    if (!driver) {
      throw new ConflictException('Driver not found');
    }
    const rideRequests = await this.rideRequestRepository.find({
      where: {
        driverProfile: { id: driver.id },
        status: In(['pending', 'accepted']),
      },
      relations: ['user', 'driverProfile'],
    });
    return rideRequests;
  }

  async findOneAndAccept(id: number, driverId: number) {
    await this.entityManager.transaction(async (entityManager) => {
      const doubleRequest = await this.rideRequestRepository.findOne({
        where: {
          status: 'accepted',
          driverProfile: { user: { id: driverId } },
        },
        relations: ['user', 'driverProfile'],
      });
      if (doubleRequest) {
        throw new ConflictException('Driver already has an active request');
      }
      const rideRequest = await this.rideRequestRepository.findOne({
        where: {
          id: id,
          status: 'pending',
          driverProfile: { user: { id: driverId } },
        },
        relations: ['user', 'driverProfile'],
      });

      if (!rideRequest) {
        throw new ConflictException('Ride request not found');
      }

      const driverProfile = await this.driverService.findOneByUserId(driverId);

      if (!driverProfile) {
        throw new ConflictException('Driver not found');
      }

      const updatedRideRequest = new RideRequest();
      updatedRideRequest.id = rideRequest.id;
      updatedRideRequest.status = 'accepted';

      await entityManager.save(updatedRideRequest);
    });
  }

  async findOneAndComplete(id: number, driverId: number) {
    const rideRequest = await this.rideRequestRepository.findOne({
      where: {
        id: id,
        status: 'accepted',
        driverProfile: { user: { id: driverId } },
      },
      relations: ['user', 'driverProfile'],
    });

    if (!rideRequest) {
      throw new ConflictException('Ride request not found');
    }

    const driverProfile = await this.driverService.findOneByUserId(
      rideRequest.driverProfile.user.id,
    );

    if (!driverProfile) {
      throw new ConflictException('Driver not found');
    }

    const completedRideRequest = await this.rideRequestRepository.save({
      ...rideRequest,
      status: 'completed',
    });

    await this.driverService.updateProfileAvailability(driverProfile.user.id);

    return completedRideRequest;
  }

  async findOneAndCancelByUser(reqId: number, userId: number) {
    const rideRequest = await this.rideRequestRepository.findOne({
      where: {
        id: reqId,
        user: { id: userId },
        status: In(['pending', 'accepted']),
      },
      relations: ['user', 'driverProfile'],
    });

    if (!rideRequest) {
      throw new ConflictException('Ride request not found');
    }

    const driverProfile = await this.driverService.findOneByUserId(
      rideRequest.driverProfile.user.id,
    );

    if (!driverProfile) {
      throw new ConflictException('Driver not found');
    }

    const canceledRideRequest = await this.rideRequestRepository.save({
      ...rideRequest,
      status: 'canceled',
    });

    await this.driverService.updateProfileAvailability(driverProfile.user.id);

    return canceledRideRequest;
  }

  async findOneAndCancelByDriver(reqId: number, driverId: number) {
    const driverProfile = await this.driverService.findOneByUserId(driverId);
    if (!driverProfile) {
      throw new ConflictException('Driver not found');
    }

    const rideRequest = await this.rideRequestRepository.findOne({
      where: {
        id: reqId,
        driverProfile: { id: driverProfile.id },
        status: In(['accepted', 'pending']),
      },
      relations: ['user', 'driverProfile'],
    });

    if (!rideRequest) {
      throw new ConflictException('Ride request not found');
    }

    const canceledRideRequest = await this.rideRequestRepository.save({
      ...rideRequest,
      status: 'canceled',
    });

    await this.driverService.updateProfileAvailability(driverProfile.user.id);

    return canceledRideRequest;
  }
}
