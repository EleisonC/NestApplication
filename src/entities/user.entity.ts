import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DriverProfile } from './drivers.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: 'consumer' })
  role: string;

  @OneToOne(() => DriverProfile, (driverProfile) => driverProfile.user)
  @JoinColumn()
  driverProfile: DriverProfile;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  async harshPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
