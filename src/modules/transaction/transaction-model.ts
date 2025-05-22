import { TopupStatus, Transaction, TransactionType } from "@prisma/client";

export type TransactionGlobalResponse = {
  id: number;
  amountTransaction: number;
  proofImage: string;
  transactionType: TransactionType;
  topupStatus: TopupStatus;
};

export type TransactionResponse = {
  id: number;
  amountTransaction: number;
  proofImage: string;
  transactionType: TransactionType;
  topupStatus: TopupStatus;
  createdAt: string;
};

export type TransactionRequest = {
  amountTransaction: number;
  proofImage: string;
};

export type FilterTransactionRequest = {
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
    topupStatus: transaction.topup_status,
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
    topupStatus: transaction.topup_status,
  };
};
