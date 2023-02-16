import { Router } from "express";

// import controllers
import UsersController from "./controllers/users/";
import AuthController from "./controllers/auth";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const routes = Router();

// public routes

// Auth
routes.post("/login", AuthController.login);

// private routes
routes.use(ensureAuthenticated);

// Users
routes.get("/users/find-all", UsersController.findAll);
routes.get("/users/find-by-id/:id", UsersController.findById);
routes.post("/users/create", UsersController.create);
routes.put("/users/update/:id", UsersController.update);
routes.delete("/user/delete/:id", UsersController.delete);

export default routes;
