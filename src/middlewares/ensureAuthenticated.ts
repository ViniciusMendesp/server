import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { prismaClient } from "../@prismaClient";

interface IPayload {
  sub: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: id } = verify(
      token,
      process.env.JWT_TOKEN || "secret"
    ) as IPayload;

    const userId = Number(id);

    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        updated_at: true,
        email: true,
        created_at: true,
      },
    });

    if (!user) throw new Error("User does not exists!");

    req.user = user;
    req.token = token;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token!" });
  }
}
