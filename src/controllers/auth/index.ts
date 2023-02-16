import { Request, Response } from "express";
import { ILogin } from "./auth.interface";
import { prismaClient } from "../../@prismaClient";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

class AuthController {
  async login(req: Request, res: Response) {
    const { body } = req;

    const loginData: ILogin = body;

    const user = await prismaClient.user.findUnique({
      where: {
        email: loginData.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "email ou senha invalido" });
    }

    const passwordMatch = await compare(loginData.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "email ou senha invalido" });
    }

    // @ts-expect-error
    delete user.password;

    console.log(process.env.JWT_TOKEN);
    const token = sign({}, process.env.JWT_TOKEN || "secret", {
      subject: `${user.id}`,
      expiresIn: "1d",
    });

    const tokenReturn = {
      token,
      user,
    };

    return res.status(200).json(tokenReturn);
  }
}

export default new AuthController();
