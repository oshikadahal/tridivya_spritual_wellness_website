import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new HttpError(401, "Unauthorized, User not found");
        }
        if ((user as any).role !== "admin") {
            throw new HttpError(403, "Forbidden, Admin access required");
        }
        next();
    } catch (error: Error | any) {
        return res.status(error.statusCode || 403).json(
            { success: false, message: error.message || "Forbidden" }
        );
    }
};
