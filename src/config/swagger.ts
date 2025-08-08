const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Booking System API',
        version: '1.0.0',
        description: 'API para o sistema de agendamentos, documentada com Swagger.',
        contact: {
            name: 'Erick',
            email: 'seu-email@exemplo.com',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3001}/api`,
            description: 'Servidor de Desenvolvimento',
        },
    ],
    tags: [
        { name: 'Serviços', description: 'API para gerenciamento de serviços' },
        { name: 'Profissionais', description: 'API para gerenciamento de profissionais' },
        { name: 'Horários', description: 'Gerenciamento dos horários de trabalho' },
        { name: 'Agendamentos', description: 'API para criação e gerenciamento de agendamentos' },
    ],
    components: {
        schemas: {
            Profissional: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, nome: { type: 'string' }, email: { type: 'string', format: 'email' } } },
            Servico: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, nome: { type: 'string' }, descricao: { type: 'string' }, preco: { type: 'number' }, duracao: { type: 'integer' } } },
            HorarioDisponivel: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, diaDaSemana: { type: 'integer' }, horaInicio: { type: 'string', format: 'time' }, horaFim: { type: 'string', format: 'time' }, profissionalId: { type: 'string', format: 'uuid' } } },
            Agendamento: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, data: { type: 'string', format: 'date-time' }, status: { type: 'string', enum: ['Confirmado', 'Cancelado', 'Realizado'] }, nomeCliente: { type: 'string' }, telefoneCliente: { type: 'string' } } },
            ErrorResponse: { type: 'object', properties: { message: { type: 'string' } } },
        },
    },
    paths: {
        // ========= Serviços =========
        '/servicos': {
            post: {
                tags: ['Serviços'],
                summary: 'Cria um novo serviço',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } },
                responses: {
                    '201': { description: 'Serviço criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } },
                    '400': { description: 'Dados inválidos' },
                },
            },
            get: {
                tags: ['Serviços'],
                summary: 'Lista todos os serviços',
                responses: {
                    '200': { description: 'Lista de serviços', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Servico' } } } } }
                },
            },
        },
        '/servicos/{id}': {
            get: {
                tags: ['Serviços'],
                summary: 'Busca um serviço por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    '200': { description: 'Dados do serviço', content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } },
                    '404': { description: 'Serviço não encontrado' },
                },
            },
            put: {
                tags: ['Serviços'],
                summary: 'Atualiza um serviço',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } },
                responses: {
                    '200': { description: 'Serviço atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } },
                    '404': { description: 'Serviço não encontrado' },
                },
            },
            delete: {
                tags: ['Serviços'],
                summary: 'Deleta um serviço',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    '204': { description: 'Serviço deletado' },
                    '404': { description: 'Serviço não encontrado' },
                },
            },
        },
        // ========= Profissionais =========
        '/profissionais': {
            post: {
                tags: ['Profissionais'],
                summary: 'Cria um novo profissional',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } },
                responses: {
                    '201': { description: 'Profissional criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } },
                    '400': { description: 'Dados inválidos' },
                },
            },
            get: {
                tags: ['Profissionais'],
                summary: 'Lista todos os profissionais',
                responses: {
                    '200': { description: 'Lista de profissionais', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Profissional' } } } } }
                },
            },
        },
        '/profissionais/{id}': {
            get: {
                tags: ['Profissionais'],
                summary: 'Busca um profissional por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    '200': { description: 'Dados do profissional', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } },
                    '404': { description: 'Profissional não encontrado' }
                },
            },
            put: {
                tags: ['Profissionais'],
                summary: 'Atualiza um profissional',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } },
                responses: {
                    '200': { description: 'Profissional atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } },
                    '404': { description: 'Profissional não encontrado' }
                },
            },
            delete: {
                tags: ['Profissionais'],
                summary: 'Deleta um profissional',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    '204': { description: 'Profissional deletado' },
                    '404': { description: 'Profissional não encontrado' }
                },
            },
        },
        // ========= Horários =========
        '/profissionais/{profissionalId}/horarios': {
            post: {
                tags: ['Horários'],
                summary: 'Cria um novo horário para um profissional',
                parameters: [{ name: 'profissionalId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HorarioDisponivel' } } } },
                responses: {
                    '201': { description: 'Horário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/HorarioDisponivel' } } } },
                    '409': { description: 'Conflito de horário' },
                },
            },
            get: {
                tags: ['Horários'],
                summary: 'Lista os horários de um profissional',
                parameters: [{ name: 'profissionalId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    '200': { description: 'Lista de horários', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/HorarioDisponivel' } } } } }
                },
            },
        },
        '/profissionais/{profissionalId}/horarios/{id}': {
            delete: {
                tags: ['Horários'],
                summary: 'Deleta um horário de um profissional',
                parameters: [
                    { name: 'profissionalId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                ],
                responses: {
                    '204': { description: 'Horário deletado' },
                    '404': { description: 'Horário não encontrado' }
                },
            },
        },
        // ========= Agendamentos =========
        '/agendamentos': {
            post: {
                tags: ['Agendamentos'],
                summary: 'Cria um novo agendamento',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Agendamento' } } } },
                responses: {
                    '201': { description: 'Agendamento criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Agendamento' } } } },
                    '409': { description: 'Conflito de horário' },
                },
            },
            get: {
                tags: ['Agendamentos'],
                summary: 'Lista todos os agendamentos',
                responses: {
                    '200': { description: 'Lista de agendamentos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Agendamento' } } } } }
                },
            },
        },
        '/agendamentos/{id}/status': {
            patch: {
                tags: ['Agendamentos'],
                summary: 'Atualiza o status de um agendamento',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Confirmado', 'Cancelado', 'Realizado'] } } } } } },
                responses: {
                    '200': { description: 'Status atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Agendamento' } } } },
                    '404': { description: 'Agendamento não encontrado' }
                },
            },
        },
    },
};

export default swaggerSpec;