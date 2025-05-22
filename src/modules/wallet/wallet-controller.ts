import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { WalletService } from "./wallet-service";

export class WalletController {
  static async balance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.userId!);
      if (isNaN(userId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid User ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await WalletService.balance(userId);

      res
        .status(200)
        .json(ResponseHelpers.success("Balance get successfully", response));
    } catch (error) {
      next(error);
    }
  }
}
