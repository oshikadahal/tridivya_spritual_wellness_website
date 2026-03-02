import axios from 'axios';

export interface EsewaPaymentRequest {
  amt: number;
  psc: number;
  pdc: number;
  txAmt: number;
  tAmt: number;
  pid: string;
  scd: string;
  su: string;
  fu: string;
}

export interface EsewaVerifyRequest {
  amt: number;
  rid: string;
  pid: string;
  scd: string;
}

export class EsewaService {
  static paymentUrl = 'https://uat.esewa.com.np/epay/main';
  static verifyUrl = 'https://uat.esewa.com.np/epay/transrec';

  static getPaymentForm(params: EsewaPaymentRequest): string {
    // Returns an HTML form string for redirect
    return `
      <form id="esewaPayForm" action="${EsewaService.paymentUrl}" method="POST">
        <input value="${params.amt}" name="amt" type="hidden">
        <input value="${params.psc}" name="psc" type="hidden">
        <input value="${params.pdc}" name="pdc" type="hidden">
        <input value="${params.txAmt}" name="txAmt" type="hidden">
        <input value="${params.tAmt}" name="tAmt" type="hidden">
        <input value="${params.pid}" name="pid" type="hidden">
        <input value="${params.scd}" name="scd" type="hidden">
        <input value="${params.su}" name="su" type="hidden">
        <input value="${params.fu}" name="fu" type="hidden">
      </form>
      <script>document.getElementById('esewaPayForm').submit();</script>
    `;
  }

  static async verifyPayment(params: EsewaVerifyRequest): Promise<boolean> {
    const form = new URLSearchParams();
    form.append('amt', params.amt.toString());
    form.append('rid', params.rid);
    form.append('pid', params.pid);
    form.append('scd', params.scd);
    const { data } = await axios.post(EsewaService.verifyUrl, form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data.includes('<response_code>Success</response_code>');
  }
}
