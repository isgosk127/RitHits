import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PrismaService } from '../../prisma.service';

@Controller('follows')
export class FollowsController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async follow(@Param('id') id: string, @Request() req: any) {
    const followerId = req.user.userId;
    if (followerId === id) throw new Error('No puedes seguirte a ti mismo');

    return (this.prisma as any).follow.create({
      data: {
        followerId,
        followingId: id,
      }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async unfollow(@Param('id') id: string, @Request() req: any) {
    const followerId = req.user.userId;
    return (this.prisma as any).follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: id,
        }
      }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:id')
  async check(@Param('id') id: string, @Request() req: any) {
    const followerId = req.user.userId;
    const follow = await (this.prisma as any).follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: id,
        }
      }
    });
    return { following: !!follow };
  }
}
