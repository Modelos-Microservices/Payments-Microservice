import { Injectable } from "@nestjs/common"
import * as SendGrid from "@sendgrid/mail"
import { envs } from "src/config"

@Injectable()
export class EmailService {
  constructor() {
    SendGrid.setApiKey(envs.mail_secret_key)
  }

  async sendEmail(to: string, subject: string, url: string) {
    const htmlTemplate = this.createEmailTemplate(subject, url)

    const msg = {
      to: to,
      subject: subject,
      from: "modelosudenar@gmail.com",
      html: htmlTemplate,
    }

    try {
      await SendGrid.send(msg)
      console.log("Correo enviado exitosamente")
    } catch (error) {
      console.error("Error al enviar el correo:", error)
    }
  }

  private createEmailTemplate(subject: string, url: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            @media only screen and (max-width: 600px) {
                .container {
                    width: 100% !important;
                    padding: 10px !important;
                }
                .content {
                    padding: 20px !important;
                }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    ${subject}
                                </h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td class="content" style="padding: 40px 30px;">
                                <div style="text-align: center;">
                                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 500;">
                                        ¡Hola!
                                    </h2>
                                    
                                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                        ¡Gracias por tu compra!
                                    </p>
                                    
                                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0;">
                                        Haz clic en el botón a continuación para visualizar tu recibo:
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                        <tr>
                                            <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                                <a href="${url}" 
                                                   style="display: inline-block; padding: 16px 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px; transition: all 0.3s ease;"
                                                   target="_blank">
                                                    Continuar
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 40px 0 0 0;">
                                        Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:
                                    </p>
                                    
                                    <p style="color: #667eea; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
                                        <a href="${url}" style="color: #667eea; text-decoration: none;" target="_blank">${url}</a>
                                    </p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                                <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                                    Este correo fue enviado desde <strong>modelosudenar@gmail.com</strong>
                                </p>
                                
                                <p style="color: #adb5bd; font-size: 12px; margin: 0;">
                                    © ${new Date().getFullYear()} Todos los derechos reservados.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
  }
}
