// Importar o express
const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload")

const UsersController = require("../controller/UsersController");
const UserAvatarController = require("../controller/UserAvatarcontroller");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)

// por ser class tem que extanciar 
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

// Metodo POST
// Rota de Usuário
usersRoutes.post("/", usersController.create );
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

// Exportando para quem quiser utilizar
module.exports = usersRoutes;
