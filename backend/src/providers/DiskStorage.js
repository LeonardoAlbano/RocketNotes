// Importa o módulo 'fs' (File System) do Node.js, que fornece métodos para interagir com o sistema de arquivos.
const fs = require("fs");

// Importa o módulo 'path' do Node.js, que fornece métodos para lidar com caminhos de arquivos e diretórios.
const path = require("path");

// Importa as configurações de upload do arquivo definidas no arquivo '../configs/upload.js'.
const uploadConfig = require("../configs/upload");

// Cria uma classe chamada DiskStorage para lidar com operações de armazenamento no disco.
class DiskStorage {
    // Método assíncrono para salvar um arquivo no sistema de arquivos.
    async saveFile(file) {
        // Utiliza o método 'rename' do módulo 'fs.promises' para mover o arquivo do diretório temporário (TMP_FOLDER)
        // para o diretório de uploads definitivo (UPLOADS_FOLDER).
        await fs.promises.rename(
            path.resolve(uploadConfig.TMP_FOLDER, file),  // Caminho do arquivo no diretório temporário.
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)  // Caminho do arquivo no diretório de uploads definitivo.
        );

        // Retorna o nome do arquivo após a operação de salvamento.
        return file;
    }

    // Método assíncrono para excluir um arquivo do sistema de arquivos.
    async deleteFile(file) {
        // Cria o caminho completo do arquivo no diretório de uploads.
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        try {
            // Utiliza o método 'stat' do módulo 'fs.promises' para verificar se o arquivo existe.
            await fs.promises.stat(filePath);
        } catch {
            // Se ocorrer um erro (por exemplo, se o arquivo não existir), retorna imediatamente.
            return;
        }

        // Se o arquivo existir, utiliza o método 'unlink' do módulo 'fs.promises' para excluí-lo.
        await fs.promises.unlink(filePath);
    }
}

// Exporta a classe DiskStorage para que ela possa ser utilizada em outros módulos.
module.exports = DiskStorage;
