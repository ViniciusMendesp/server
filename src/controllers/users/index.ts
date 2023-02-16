import { Request, Response } from "express";
import { prismaClient } from "../../@prismaClient";
import { ICreateUser, IUpdateUser } from "./users.interface";
import { hash } from "bcryptjs";

class UsersController {
  async findAll(_req: Request, res: Response) {
    const users = await prismaClient.user.findMany();

    console.log(_req.user);
    res.status(200).json(users);
  }

  async findById(req: Request, res: Response) {
    const { params } = req;

    const userId = Number(params?.id);

    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ message: "envie um parametro com numero valido" });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "usuario não encontrado" });
    }

    res.status(200).json(user);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    const userData: ICreateUser = body;

    const user = await prismaClient.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: await hash(userData.password, 10),
      },
    });

    res.status(200).json(user);
  }

  async update(req: Request, res: Response) {
    const { params, body } = req;

    const userData: IUpdateUser = body;

    const userId = Number(params?.id);

    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ message: "envie um parametro com numero valido" });
    }

    const hasUser = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!hasUser) {
      return res.status(400).json({ message: "usuario não encontrado" });
    }

    const user = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        email: userData.email,
        name: userData.name,
        password: await hash(userData.password, 10),
      },
    });

    res.status(200).json(user);
  }

  async delete(req: Request, res: Response) {
    const { params } = req;

    const userId = Number(params?.id);

    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ message: "envie um parametro com numero valido" });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "usuario não encontrado" });
    }

    await prismaClient.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "usuario deletado" });
  }
}

export default new UsersController();
