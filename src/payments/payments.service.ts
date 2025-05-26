import { Inject, Injectable, Logger, NotFoundException, Req, Res } from '@nestjs/common';
import { envs, NATS_SERVICE } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { url } from 'inspector';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { EmailService } from 'src/email/email.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecretKey);
  private readonly logger = new Logger('PaymentsService')

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly emailService: EmailService
  ) { }


  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const currency = paymentSessionDto.currency
    const orderId = paymentSessionDto.orderId
    const line_items: any[] = paymentSessionDto.items.map(item => { return ({ price_data: { currency: currency, product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) }, quantity: item.quantity }) })
    const session = await this.stripe.checkout.sessions.create({
      //TODO colocar el id de la orden
      payment_intent_data: {
        //en esta se pone toda la info adicional para la identificación del usuario
        metadata: {
          orderId: orderId
        }
      },
      //arreglo donde se colocan los items que se van a comprar 
      line_items: line_items,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });
    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    }
  }


  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    //Testing
    //const endpointSecret = 'whsec_b79bf6e382bbed832ae65e83ebda5b1aff7ce5dcdd93d0a896324e5c956c952d';
    const endpointSecret = envs.stripeEndPointSecret;

    if (!sig) {
      throw new NotFoundException("No existe el stripe-signature");
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.body, //req['rawBody']
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    switch (event.type) {
      case 'charge.succeeded':
        // TODO: llamar a nuestro microservicio 
        const chargeSucceded = event.data.object;

        const payload = {
          stripePaymentId: chargeSucceded.id,
          orderId: chargeSucceded.metadata.orderId,
          recipeUrl: chargeSucceded.receipt_url,
        }

        const email = chargeSucceded.billing_details.email

        if(!email){
          throw new RpcException({status: 404, message: 'The email is required to finish the process'})
        }
       
        await this.emailService.sendEmail(
          email,
          `Gracias por su compra`,
          chargeSucceded.receipt_url!,
        );

        this.client.emit('payment.succeeded', payload)
        break;
      default:
        console.log(`event ${event.type} not handled`)
    }




    return res.status(200).json({ received: true });
  }

}
