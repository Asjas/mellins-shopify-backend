import mjml2html from "mjml";

import { Email } from "../@types/mails";

export const customerInvoice = ({ orderNumber, firstName, lastName }: Email) =>
  mjml2html(`<mjml>
  <mj-head>
    <mj-title>Mellins iStyle - Invoice for order #${orderNumber}</mj-title>
    <mj-font name="Raleway" href="https://fonts.googleapis.com/css?family=Raleway" />
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto" />
  </mj-head>
  <mj-body background-color="#ffffff" width="800px">
    <mj-section>
      <mj-column>
        <mj-image padding-bottom="15px" width="400px" src="https://cdn.shopify.com/s/files/1/0045/5632/4936/files/Mellins_top_logo.png?10964"></mj-image>
        <mj-divider border-color="#445a6a"></mj-divider>
        <mj-text padding-top="30px" padding-bottom="30px" font-size="22px" font-family="Roboto">Hi, ${firstName} ${lastName}</mj-text>
        <mj-text padding-bottom="180px" font-size="18px" padding-bottom="25px" font-family="Raleway">Thank you for shopping with us. Please find your invoice for order #${orderNumber} attached to this email.</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#e7e7e7">
      <mj-column padding-left="50px" padding-bottom="15px">
        <mj-text font-size="18px" align="left" padding-bottom="5px" font-family="Roboto">Mellins iStyle</mj-text>
        <mj-text align="left" padding-bottom="0" font-family="Raleway">Phone: (087) 350 4508</mj-text>
        <mj-text align="left" padding-bottom="0" font-family="Raleway">Email: online@mellins.co.za</mj-text>
      </mj-column>
      <mj-column padding-left="50px">
        <mj-text font-size="18px" align="left" padding-bottom="5px" font-family="Roboto">Follow us</mj-text>
        <mj-social align="left">
          <mj-social-element name="facebook" href="https://www.facebook.com/mellinsistyle/" alt="facebook" />
          <mj-social-element name="instagram" href="https://www.instagram.com/mellinsistyle/?hl=en" alt="instagram" />
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`);
