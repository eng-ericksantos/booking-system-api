import { injectable, singleton } from 'tsyringe';
import nodemailer, { Transporter, TestAccount } from 'nodemailer'; // Importar TestAccount
import { IMailProvider, ISendMailDTO } from '../../../models/interfaces/IMailProvider.interface';

@singleton()
@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client!: Transporter;

    constructor() {
        // A criação da conta é assíncrona, então tratamos isso com um método auto-invocado
        this.createClient();
    }

    private async createClient() {
        try {
            const account: TestAccount = await nodemailer.createTestAccount();

            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });

            this.client = transporter;

        } catch (err) {
            console.error('Falha ao criar a conta de teste do Ethereal', err)
        }
    }

    public async sendMail({ to, subject, body }: ISendMailDTO): Promise<void> {
        // Espera o cliente ser criado caso a primeira chamada seja muito rápida
        if (!this.client) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s
        }

        if (!this.client) {
            console.error("MailProvider: Cliente Nodemailer não foi inicializado.");
            throw new Error("Serviço de e-mail indisponível.");
        }

        const message = await this.client.sendMail({
            from: 'Equipe Booking System <noreply@bookingsystem.com>',
            to,
            subject,
            html: body,
        });

        console.log('E-mail enviado! URL de visualização: %s', nodemailer.getTestMessageUrl(message));
    }
}