const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Booking System API',
    version: '1.0.0',
    description: 'API para o sistema de agendamentos, documentada com Swagger.',
    contact: {
      name: 'Erick A. dos Santos',
      email: 'eng.erickalessandro@gmail.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3001}/api`,
      description: 'Servidor de Desenvolvimento',
    },
  ],
  tags: [
    { name: 'Autenticação Cliente', description: 'Fluxo de login/registro sem senha para clientes' },
    { name: 'Autenticação', description: 'Operações de Autenticação para Admin/Profissional' },
    { name: 'Agendamentos', description: 'API para criação e gerenciamento de agendamentos' },
    { name: 'Profissionais', description: 'API para gerenciamento de profissionais' },
    { name: 'Serviços', description: 'API para gerenciamento de serviços' },
    { name: 'Horários', description: 'Gerenciamento dos horários de trabalho' },
    { name: 'HealthCheck', description: 'Verificação de saúde da aplicação' },
  ],
  components: {
    schemas: {
      Usuario: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, email: { type: 'string', format: 'email' }, role: { type: 'string', enum: ['ADMIN', 'PROFISSIONAL', 'CLIENTE'] } } },
      Cliente: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, nome: { type: 'string' }, telefone: { type: 'string' }, usuario: { $ref: '#/components/schemas/Usuario' } } },
      Profissional: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, nome: { type: 'string' }, usuario: { $ref: '#/components/schemas/Usuario' } } },
      Servico: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, nome: { type: 'string' }, descricao: { type: 'string' }, preco: { type: 'number' }, duracao: { type: 'integer' } } },
      HorarioDisponivel: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, diaDaSemana: { type: 'integer' }, horaInicio: { type: 'string', format: 'time' }, horaFim: { type: 'string', format: 'time' } } },
      Agendamento: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, data: { type: 'string', format: 'date-time' }, status: { type: 'string', enum: ['Confirmado', 'Cancelado', 'Realizado'] }, cliente: { $ref: '#/components/schemas/Cliente' }, servico: { $ref: '#/components/schemas/Servico' }, profissional: { $ref: '#/components/schemas/Profissional' } } },
      ErrorResponse: { type: 'object', properties: { message: { type: 'string' } } },
    },
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    }
  },
  paths: {
    // ========= HealthCheck =========
    '/health': {
      get: { tags: ['HealthCheck'], summary: 'Verifica a saúde da API e do banco', responses: { '200': { description: 'Aplicação está saudável.' }, '503': { description: 'Aplicação com problemas.' } } },
    },
    // ========= Autenticação Cliente =========
    '/public/auth/generate-otp': {
      post: { tags: ['Autenticação Cliente'], summary: 'Gera e envia um código OTP para o e-mail do cliente', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', format: 'email', example: 'cliente@example.com' } } } } } }, responses: { '204': { description: 'Código OTP enviado.' } } },
    },
    '/public/auth/verify-otp': {
      post: { tags: ['Autenticação Cliente'], summary: 'Verifica o OTP, registra/loga o cliente e retorna um token JWT', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', format: 'email' }, code: { type: 'string' }, nome: { type: 'string' }, telefone: { type: 'string' } } } } } }, responses: { '200': { description: 'Autenticação bem-sucedida.', content: { 'application/json': { schema: { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' }, token: { type: 'string' } } } } } }, '401': { description: 'Código OTP inválido ou expirado.' } } },
    },
    // ========= Autenticação Admin/Profissional =========
    '/login': {
      post: { tags: ['Autenticação'], summary: 'Realiza o login de um usuário Admin/Profissional com senha', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', format: 'email' }, senha: { type: 'string', format: 'password' } } } } } }, responses: { '200': { description: 'Login bem-sucedido', content: { 'application/json': { schema: { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' }, token: { type: 'string' } } } } } }, '401': { description: 'Não autorizado' } } },
    },
    // ========= Serviços =========
    '/servicos': {
      get: { tags: ['Serviços'], summary: 'Lista todos os serviços', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Lista de serviços', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Servico' } } } } } } },
      post: { tags: ['Serviços'], summary: 'Cria um novo serviço', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } }, responses: { '201': { description: 'Serviço criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } }, '400': { description: 'Dados inválidos' } } },
    },
    '/servicos/{id}': {
      get: { tags: ['Serviços'], summary: 'Busca um serviço por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '200': { description: 'Dados do serviço', content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } }, '404': { description: 'Serviço não encontrado' } } },
      put: { tags: ['Serviços'], summary: 'Atualiza um serviço', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } }, responses: { '200': { description: 'Serviço atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Servico' } } } }, '404': { description: 'Serviço não encontrado' } } },
      delete: { tags: ['Serviços'], summary: 'Deleta um serviço', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '204': { description: 'Serviço deletado' }, '404': { description: 'Serviço não encontrado' } } },
    },
    // ========= Profissionais =========
    '/profissionais': {
      post: { tags: ['Profissionais'], summary: 'Cria um novo profissional (Requer Admin)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { properties: { nome: { type: 'string' }, email: { type: 'string', format: 'email' }, senha: { type: 'string', format: 'password' } } } } } }, responses: { '201': { description: 'Profissional criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } }, '403': { description: 'Acesso negado' } } },
      get: { tags: ['Profissionais'], summary: 'Lista todos os profissionais (Requer Admin)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Lista de profissionais', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Profissional' } } } } } } },
    },
    '/profissionais/{id}': {
      get: { tags: ['Profissionais'], summary: 'Busca um profissional por ID (Requer Dono ou Admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '200': { description: 'Dados do profissional', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } }, '404': { description: 'Profissional não encontrado' }, '403': { description: 'Acesso negado' } } },
      put: { tags: ['Profissionais'], summary: 'Atualiza um profissional (Requer Dono ou Admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], requestBody: { required: true, content: { 'application/json': { schema: { properties: { nome: { type: 'string' }, email: { type: 'string', format: 'email' }, senha: { type: 'string', format: 'password' } } } } } }, responses: { '200': { description: 'Profissional atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profissional' } } } }, '404': { description: 'Profissional não encontrado' } } },
      delete: { tags: ['Profissionais'], summary: 'Deleta um profissional (Requer Dono ou Admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '204': { description: 'Profissional deletado' }, '404': { description: 'Profissional não encontrado' } } },
    },
    // ========= Horários =========
    '/profissionais/{profissionalId}/horarios': {
      post: { tags: ['Horários'], summary: 'Cria um novo horário para um profissional (Requer Dono ou Admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'profissionalId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HorarioDisponivel' } } } }, responses: { '201': { description: 'Horário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/HorarioDisponivel' } } } }, '409': { description: 'Conflito de horário' } } },
      get: { tags: ['Horários'], summary: 'Lista os horários de um profissional (Requer Dono ou Admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'profissionalId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '200': { description: 'Lista de horários', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/HorarioDisponivel' } } } } } } },
    },
    '/profissionais/{profissionalId}/horarios/{id}': {
      delete: { tags: ['Horários'], summary: 'Deleta um horário (Requer Dono ou Admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'profissionalId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }, { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '204': { description: 'Horário deletado' }, '404': { description: 'Horário não encontrado' } } },
    },
    // ========= Agendamentos =========
    '/agendamentos': {
      post: { tags: ['Agendamentos'], summary: 'Cria um novo agendamento (Requer Cliente ou Admin)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { servicoId: { type: 'string', format: 'uuid' }, profissionalId: { type: 'string', format: 'uuid' }, data: { type: 'string', format: 'date-time' } } } } } }, responses: { '201': { description: 'Agendamento criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Agendamento' } } } }, '409': { description: 'Conflito de horário' } } },
      get: { tags: ['Agendamentos'], summary: 'Lista todos os agendamentos (Requer Autenticação)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Lista de agendamentos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Agendamento' } } } } } } },
    },
    '/agendamentos/{id}/status': {
      patch: { tags: ['Agendamentos'], summary: 'Atualiza o status de um agendamento (Requer Autenticação)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Confirmado', 'Cancelado', 'Realizado'] } } } } } }, responses: { '200': { description: 'Status atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Agendamento' } } } }, '404': { description: 'Agendamento não encontrado' } } },
    },
  },
};

export default swaggerSpec;