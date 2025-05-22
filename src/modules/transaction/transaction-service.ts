import { TopupStatus } from "@prisma/client";
import fs from "fs";
import path from "path";
import { prisma } from "../../config/database";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { WalletService } from "../wallet/wallet-service";
import {
  convertTransactionResponse,
  FilterTransactionRequest,
  TransactionRequest,
  TransactionResponse,
} from "./transaction-model";
import { TransactionValidation } from "./transaction-validation";

export class TransactionService {
  static async checkTransactionExist(id: number): Promise<{
    amountTransaction: number;
    proofImage: string;
    topupStatus: TopupStatus;
    walletId: number;
  }> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new ErrorResponse(
        404,
        "Transaction not found",
        "Transaction with this ID doesn't exist!"
      );
    }

    return {
      amountTransaction: transaction.amount_transaction,
      proofImage: transaction.proof_image!,
      topupStatus: transaction.topup_status,
      walletId: transaction.wallet_id,
    };
  }
  static async topup(
    request: TransactionRequest,
    userId: number,
    imagePath: string
  ): Promise<TransactionResponse> {
    const createRequest = validation(TransactionValidation.create, {
      amountTransaction: Number(request.amountTransaction),
      proofImage: imagePath,
    });

    const wallet = await WalletService.checkWalletExist(Number(userId));

    const createdTransaction = await prisma.transaction.create({
      data: {
        amount_transaction: createRequest.amountTransaction,
        proof_image: imagePath,
        transaction_type: "incoming",
        topup_status: "pending",
        wallet: { connect: { id: Number(wallet.id) } },
      },
    });

    return convertTransactionResponse(createdTransaction);
  }

  static async updateTopup(
    request: TransactionRequest,
    id: number,
    imagePath: string
  ): Promise<TransactionResponse> {
    const updateRequest = validation(TransactionValidation.update, {
      amountTransaction: Number(request.amountTransaction),
      proofImage: imagePath,
    });

    const existingTransaction = await this.checkTransactionExist(id);

    if (existingTransaction.topupStatus !== "pending") {
      throw new ErrorResponse(
        400,
        "Transaction cannot be updated",
        "Transaction has already been processed!"
      );
    }

    if (imagePath && existingTransaction.proofImage) {
      const oldImagePath = path.join("uploads", existingTransaction.proofImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount_transaction: updateRequest.amountTransaction,
        proof_image: imagePath,
        transaction_type: "incoming",
        topup_status: "pending",
        wallet: { connect: { id: Number(existingTransaction.walletId) } },
      },
    });

    return convertTransactionResponse(updatedTransaction);
  }

  static async approve(id: number): Promise<TransactionResponse> {
    const transaction = await this.checkTransactionExist(id);

    if (transaction.topupStatus !== "pending") {
      throw new ErrorResponse(
        400,
        "Transaction cannot be approved",
        "Transaction has already been processed!"
      );
    }

    const approvedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        topup_status: "success",
      },
    });

    await WalletService.update(
      transaction.walletId,
      transaction.amountTransaction
    );

    return convertTransactionResponse(approvedTransaction);
  }

  static async reject(id: number): Promise<TransactionResponse> {
    const transaction = await this.checkTransactionExist(id);

    if (transaction.topupStatus !== "pending") {
      throw new ErrorResponse(
        400,
        "Transaction cannot be rejected",
        "Transaction has already been processed!"
      );
    }

    const rejectedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        topup_status: "failed",
      },
    });

    return convertTransactionResponse(rejectedTransaction);
  }

  static async get(
    request: FilterTransactionRequest,
    userId: number
  ): Promise<Pageable<TransactionResponse>> {
    const getRequest = validation(TransactionValidation.get, request);
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    let walletId: number | undefined;

    if (user?.role !== "superadmin") {
      walletId = (await WalletService.checkWalletExist(Number(userId))).id;
    }

    const skip = (getRequest.page - 1) * getRequest.size;

    const getTransaction = await prisma.transaction.findMany({
      where: {
        wallet_id: walletId ? Number(walletId) : undefined,
      },
      orderBy: {
        created_at: "desc",
      },
      take: getRequest.all ? undefined : getRequest.size,
      skip: getRequest.all ? undefined : skip,
    });

    const total = await prisma.transaction.count({
      where: {
        wallet_id: walletId ? Number(walletId) : undefined,
      },
    });

    return {
      data: getTransaction.map((val) => convertTransactionResponse(val)),
      paging: getRequest.all
        ? undefined
        : {
            currentPage: getRequest.page,
            totalPage: Math.ceil(total / getRequest.size),
            size: getRequest.size,
          },
    };
  }
}
