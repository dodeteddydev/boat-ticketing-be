import { Transaction, TransactionType } from "@prisma/client";

export type TransactionGlobalResponse = {
  id: number;
  amountTransaction: number;
  proofImage: string;
  transactionType: TransactionType;
};

export type TransactionResponse = {
  id: number;
  amountTransaction: number;
  proofImage: string;
  transactionType: TransactionType;
  createdAt: string;
};

export type TransactionRequest = {
  amountTransaction: number;
  proofImage: string;
  transactionType: TransactionType;
};

export type FilterTransactionRequest = {
  search?: string;
  page: number;
  size: number;
  all?: boolean;
};

export const convertTransactionResponse = (
  transaction: Transaction
): TransactionResponse => {
  return {
    id: transaction.id,
    amountTransaction: transaction.amount_transaction,
    proofImage: transaction.proof_image!,
    transactionType: transaction.transaction_type,
    createdAt: transaction.created_at.toISOString(),
  };
};

export const convertTransactionGlobalResponse = (
  transaction: Transaction
): TransactionGlobalResponse => {
  return {
    id: transaction.id,
    amountTransaction: transaction.amount_transaction,
    proofImage: transaction.proof_image!,
    transactionType: transaction.transaction_type,
  };
};
