import { AnySchema, ValidationError } from "yup";
import { Request, Response, NextFunction } from "express";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      }
    }
  };

export default validate;
