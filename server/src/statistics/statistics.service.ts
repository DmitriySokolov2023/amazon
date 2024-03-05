import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService, private userService: UserService) {
  }

  async getMain(userId: number) {
    const user = await this.userService.findById(userId, {
      orders: {
        select: {
          status:true,
          items: true,
        },
      },
      reviews: true,
    });

    // const totalAmount = await this.prisma.order.aggregate({
    //   where: { userId },
    // })


    return [
      {
        ...user
      },
      {
        name: 'Orders',
        value: user.orders.length,
      },
      {
        name: 'Review',
        value: user.reviews.length,
      },
      {
        name: 'Favorites',
        value: user.orders.length,
      },
      {
        name: 'Total amount',
        value: 1000,
      },
    ];
  }
}
