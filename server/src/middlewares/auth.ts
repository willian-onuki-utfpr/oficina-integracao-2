import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET as string;

interface TokenPayload {
  id: number;
  tipo: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      secret
    ) as TokenPayload;

    (req as any).usuario = {
      id: decoded.id,
      tipo: decoded.tipo,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
}