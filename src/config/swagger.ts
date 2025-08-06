import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

// Carrega o arquivo de componentes reutilizáveis
const componentsFile = fs.readFileSync(path.join(__dirname, './swagger-components.yaml'), 'utf8');
const swaggerComponents = yaml.load(componentsFile) as object;

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Booking System API',
            version: '1.0.0',
            description: 'API para o sistema de agendamentos, documentada com Swagger.',
            contact: {
                name: 'Erick Alessandro dos Santos', // Seu nome
                email: 'eng.erickalessandro@gmail.com', // Seu email
            },
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3001}`,
                description: 'Servidor de Desenvolvimento',
            },
            // Você pode adicionar outros servidores (ex: produção) aqui
        ],
        // Define o esquema de segurança (JWT Bearer Token)
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Insira o token JWT no formato: Bearer {token}',
            },
        },
        // Aplica a segurança a todos os endpoints globalmente
        security: [
            {
                bearerAuth: [],
            },
        ],
        // Mescla os componentes do arquivo YAML na definição principal
        ...swaggerComponents,
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;