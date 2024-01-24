// Importar express async errors
require("express-async-errors")

const migrationsRun = require("./database/sqlite/migrations")

// Importar o express
const express = require("express");

// Importar o AppError da pasta utils
const AppError = require("./utils/AppError")

const uploadConfig = require("./configs/upload");

const cors = require("cors")

//Importar as rotas no index.js
const routes = require("./routes")

migrationsRun();

// Inicializou o express
const app = express();

app.use(cors())

//Convertendo informação para JSON
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);


app.use((error, request, response, next) => {
    // Verifica se o erro é uma instância de AppError
    if (error instanceof AppError) {
        // Se for, retorna uma resposta com o status e mensagem específicos do erro
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    // Se não for um AppError, loga o erro no console
    console.error(error);

    // Retorna uma resposta de erro genérico caso o erro não seja um AppError
    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
});


// Criar uma const para definir o numero da Porta do servidor
const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`)); // Iniciar nesse endereço e executar a mensagem