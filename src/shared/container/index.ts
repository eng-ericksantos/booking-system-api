import { container } from 'tsyringe';

// "catálogo de produtos" do aplicativo. É ele que ensina ao tsyringe o que cada item realmente é.

// Repositories
import AgendamentoRepository from '../../repositories/AgendamentoRepository';
import HorarioDisponivelRepository from '../../repositories/HorarioDisponivelRepository';
import ProfissionalRepository from '../../repositories/ProfissionalRepository';
import ServicoRepository from '../../repositories/ServicoRepository';
import UsuarioRepository from '../../repositories/UsuarioRepository';

// Services
import AgendamentoService from '../../services/AgendamentoService';
import AuthService from '../../services/AuthService';
import HorarioDisponivelService from '../../services/HorarioDisponivelService';
import ProfissionalService from '../../services/ProfissionalService';
import ServicoService from '../../services/ServicoService';
import EtherealMailProvider from '../providers/mailprovider/EtherealMailProvider';
import OneTimePasswordRepository from '../../repositories/OneTimePasswordRepository';
import ClienteRepository from '../../repositories/ClienteRepository';
import ClienteAuthService from '../../services/ClienteAuthService';

// Registrando os Repositórios
container.registerSingleton('AgendamentoRepository', AgendamentoRepository);
container.registerSingleton('HorarioDisponivelRepository', HorarioDisponivelRepository);
container.registerSingleton('ProfissionalRepository', ProfissionalRepository);
container.registerSingleton('ServicoRepository', ServicoRepository);
container.registerSingleton('UsuarioRepository', UsuarioRepository);
container.registerSingleton('ClienteRepository', ClienteRepository);
container.registerSingleton('OneTimePasswordRepository', OneTimePasswordRepository);

// Registrando os Serviços
container.registerSingleton('AgendamentoService', AgendamentoService);
container.registerSingleton('AuthService', AuthService);
container.registerSingleton('HorarioDisponivelService', HorarioDisponivelService);
container.registerSingleton('ProfissionalService', ProfissionalService);
container.registerSingleton('ServicoService', ServicoService);
container.registerSingleton('ClienteAuthService', ClienteAuthService);

// Registrando os Provedores
container.registerSingleton('MailProvider', EtherealMailProvider);