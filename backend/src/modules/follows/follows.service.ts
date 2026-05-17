import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}
}
