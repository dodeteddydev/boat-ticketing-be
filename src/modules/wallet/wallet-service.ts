import { prisma } from "../../config/database";

export class WalletService {
  static async create(userId: number): Promise<void> {
    await prisma.wallet.create({
      data: {
        amount: 0,
        user: { connect: { id: Number(userId) } },
      },
    });
  }
}
