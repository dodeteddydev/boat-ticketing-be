import { prisma } from "../../config/database";

export class WalletService {
  static async create(userId: number): Promise<void> {
    await prisma.wallet.create({
      data: {
        user: { connect: { id: Number(userId) } },
      },
    });
  }
}
