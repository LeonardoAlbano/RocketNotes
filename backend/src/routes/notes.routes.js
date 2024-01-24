// Importar o express
const { Router } = require("express");

const NotesController = require("../controller/NotesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const notesRoutes = Router();

// por ser class tem que extanciar 
const notesController = new NotesController();

notesRoutes.use(ensureAuthenticated);

// Metodo POST
// Rota de Usuário
notesRoutes.get("/", notesController.index );
notesRoutes.post("/", notesController.create );
notesRoutes.get("/:id", notesController.show );
notesRoutes.delete("/:id", notesController.delete );

// Exportando para quem quiser utilizar
module.exports = notesRoutes;
