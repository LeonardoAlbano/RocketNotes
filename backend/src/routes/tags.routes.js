// Importar o express
const { Router } = require("express");

const TagsController = require("../controller/TagsController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const tagsRoutes = Router();

// por ser class tem que extanciar 
const tagsController = new TagsController();

// Metodo POST
// Rota de Usuário
tagsRoutes.get("/", ensureAuthenticated, tagsController.index );


// Exportando para quem quiser utilizar
module.exports = tagsRoutes;
