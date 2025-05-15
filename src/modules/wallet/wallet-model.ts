import { Wallet } from "@prisma/client";
import { TransactionGlobalResponse } from "../transaction/transaction-model";

export type WalletResponse = {
  id: number;
  amount: number;
  transaction: TransactionGlobalResponse;
  updatedAt: string;
};

export const convertWalletResponse = (
  wallet: Wallet,
  transaction: TransactionGlobalResponse
): WalletResponse => {
  return {
    id: wallet.id,
    amount: wallet.amount,
    transaction: transaction,
    updatedAt: wallet.updated_at.toISOString(),
  };
};
