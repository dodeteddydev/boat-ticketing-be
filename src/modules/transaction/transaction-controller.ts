import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import {
  FilterTransactionRequest,
  TransactionRequest,
} from "./transaction-model";
import { TransactionService } from "./transaction-service";

export class TransactionController {
  static async topup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as TransactionRequest;
      const proofImage = req.file?.filename;
      const response = await TransactionService.topup(
        request,
        req.userId!,
        proofImage!
      );

      res
        .status(201)
        .json(ResponseHelpers.success("Topup created successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async updateTopup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as TransactionRequest;
      const proofImage = req.file?.filename;
      const transactionId = Number(id);
      if (isNaN(transactionId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Transaction ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await TransactionService.updateTopup(
        request,
        transactionId,
        proofImage!
      );

      res
        .status(200)
        .json(ResponseHelpers.success("Topup updated successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transactionId = Number(id);
      if (isNaN(transactionId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Transaction ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await TransactionService.approve(transactionId);

      res
        .status(200)
        .json(ResponseHelpers.success("Topup approved successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transactionId = Number(id);
      if (isNaN(transactionId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Transaction ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await TransactionService.reject(transactionId);

      res.status(200).json(ResponseHelpers.success("Topup rejected", response));
    } catch (error) {
      next(error);
    }
  }

  static async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = {
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterTransactionRequest;

      const response = await TransactionService.get(request, req.userId!);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "Topup get successfully",
            response
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
