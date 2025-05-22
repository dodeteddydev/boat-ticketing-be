import { prisma } from "../../config/database";
import { ErrorResponse } from "../../utilities/errorResponse";
import {
  BalanceResponse,
  convertWalletResponse,
  WalletResponse,
} from "./wallet-model";

export class WalletService {
  static async checkWalletExist(
    userId: number
  ): Promise<{ id: number; amount: number; updated_at: Date }> {
    const wallet = await prisma.wallet.findUnique({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new ErrorResponse(404, "Wallet not found", "Wallet doesn't exist!");
    }

    return {
      id: wallet.id,
      amount: wallet.amount,
      updated_at: wallet.updated_at,
    };
  }

  static async checkWalletExistById(
    walletId: number
  ): Promise<{ id: number; amount: number }> {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new ErrorResponse(404, "Wallet not found", "Wallet doesn't exist!");
    }

    return { id: wallet.id, amount: wallet.amount };
  }

  static async create(userId: number): Promise<void> {
    await prisma.wallet.create({
      data: {
        user: { connect: { id: Number(userId) } },
      },
    });
  }

  static async update(walletId: number, amount: number): Promise<void> {
    const wallet = await this.checkWalletExistById(walletId);

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        amount: wallet.amount + amount,
      },
    });
  }

  static async balance(userId: number): Promise<BalanceResponse> {
    const wallet = await WalletService.checkWalletExist(userId);

    return {
      amount: wallet?.amount,
      updatedAt: wallet?.updated_at.toISOString(),
    };
  }
}
