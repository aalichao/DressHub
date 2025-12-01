import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
export declare const validate: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map