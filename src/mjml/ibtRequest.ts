import mjml2html from "mjml";

import { Email } from "../@types/mails";

export const ibtRequest = ({ orderNumber, orderId, firstName, lastName }: Email) =>
  mjml2html(`<mjml>
  <mj-head>
    <mj-title>Mellins Online Store IBT request - #${orderNumber}</mj-title>
    <mj-font name="Raleway" href="https://fonts.googleapis.com/css?family=Raleway" />
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto" />
  </mj-head>
  <mj-body background-color="#ffffff" width="800px">
    <mj-section>
      <mj-column>
        <mj-image padding-bottom="15px" width="400px" src="https://cdn.shopify.com/s/files/1/0045/5632/4936/files/Mellins_top_logo.png?10964"></mj-image>
        <mj-divider border-color="#445a6a"></mj-divider>
        <mj-text padding-top="30px" padding-bottom="30px" font-size="18px" font-family="Roboto">This is a notification that there is a IBT requested on a Shopify contact lens order.</mj-text>
        <mj-text font-size="18px" padding-bottom="5px" font-family="Raleway">Customer: ${firstName} ${lastName}</mj-text>
        <mj-text font-size="18px" padding-bottom="5px" font-family="Raleway">Order: ${orderNumber}</mj-text>
        <mj-button padding-top="40px" href="https://shopify2.mellins-backend.co.za/contact-lens/${orderId}" align="left" font-family="Raleway" font-size="18px" background-color="#445a6a" color="white">
          Link to order
         </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`);
