import { constants } from '@monorepo/web-api-client';
import { Injectable } from '@nestjs/common';
import * as hogan from 'hogan.js';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { createTransport, TransportOptions, Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { config } from './../../../config';

@Injectable()
export class MailerService {
  private cachedViews = {};
  private transport: Transporter;

  constructor() {}

  private createTransport() {
    const smtpConfig = config.smtp;
    this.transport = createTransport(
      {
        host: smtpConfig.host,
        port: smtpConfig.port,
        auth: {
          user: smtpConfig.username,
          pass: smtpConfig.password,
        },
        debug: smtpConfig.debug,
      } as TransportOptions,
      {
        from: constants.appName + ' <' + config.email.noReply + '>',
      }
    );
  }
  private async loadViews(view: string) {
    const dir = path.join(__dirname, '/assets/email_views/');
    const views = ['master', view];
    for (const view of views) {
      if (!this.cachedViews[view]) {
        this.cachedViews[view] = fs.readFileSync(`${dir}${view}.hogan.html`, {
          encoding: 'utf8',
          flag: 'r',
        });
      }
    }
  }

  async send(nodeMailerOptions: SendMailOptions, view: string, viewData: any = {}): Promise<SentMessageInfo> {
    if (!this.transport) {
      this.createTransport();
    }
    this.loadViews(view);
    const html = this.cachedViews['master'].replace('[content]', this.cachedViews[view]);
    const renderedHtml = hogan.compile(html).render({
      ...viewData,
      appName: constants.appName,
      supportEmail: config.email.support,
      websiteUri: config.website.uri,
    });
    const sendMail = promisify(this.transport.sendMail).bind(this.transport);
    const result: SentMessageInfo = await sendMail({
      ...nodeMailerOptions,
      html: renderedHtml,
    });
    if (result.rejected.length) {
      // TODO log silently to Sentry
    }
    return result;
  }
}
