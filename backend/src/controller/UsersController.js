const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")

class UsersController {

// Cadastrar Usuário
async create(request, response) {

    // Extrair dados do corpo da requisição
    const { name, email, password } = request.body;

    // Conectar ao banco de dados SQLite
    const database = await sqliteConnection();

    // Verificar se o email já está em uso no banco de dados
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    // Verificar se o email já está em uso
    if(checkUserExists){
        throw new AppError("Este e-mail já está em uso.");
    }

    // Utiliza uma função chamada 'hash' para gerar uma versão criptograficamente segura da senha.
    // O 'await' indica que a operação é assíncrona e deve aguardar a conclusão antes de prosseguir.
    const hashedPassword = await hash(password, 8);

    // Inserir um novo usuário no banco de dados
    await database.run(
        "INSERT INTO users (name, email, password) VALUES ( ?, ?, ? )",
        [ name, email, hashedPassword ]
    );

    // Responder com status 201 (Created) após a inserção bem-sucedida
    return response.status(201).json();
}

// Método assíncrono para atualizar informações de um usuário
async update(request, response){

    // Extrai os dados do corpo da requisição (name e email)
    const { name, email, password, old_password } = request.body;

    // Extrai o ID do parâmetro da URL
    // const { id } = request.params;

    // Com middleware fica assim
    const user_id = request.user.id;

    // Conecta ao banco de dados SQLite
    const database = await sqliteConnection();

    // Busca o usuário no banco de dados com base no ID fornecido
    // const user = await database.get("SELECT * FROM users  WHERE id = (?)", [id]);

    // COM MIDDLEWARE DE AUTENTICAÇÃO FICA
    const user = await database.get("SELECT * FROM users  WHERE id = (?)", [user_id]);
    // Se o usuário não for encontrado, lança um erro
    if(!user) {
        throw new AppError("Usuário não encontrado");
    }

    // Verifica se já existe um usuário com o novo email fornecido
    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    // Se já existir um usuário com o novo email e não for o mesmo usuário que está sendo atualizado, lança um erro
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
        throw new AppError("Este e-mail já está em uso");
    }

    // Atualiza os dados do usuário com as novas informações
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password){
        throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
    }

    if(password && old_password){
        const checkOldPassword = await compare(old_password, user.password);

        if(!checkOldPassword){
            throw new AppError("A senha antiga não confere.")
        }

        user.password = await hash(password, 8);
    }

    // Executa a consulta SQL para atualizar as informações do usuário no banco de dados
    await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
        [user.name, user.email, user.password, user_id]
    );

    // Retorna uma resposta JSON indicando sucesso
    return response.json();
}
}

module.exports = UsersController;