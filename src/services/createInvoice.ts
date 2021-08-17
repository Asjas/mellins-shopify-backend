import PDFDocument from "pdfkit";
import { format } from "date-fns";

function generateTableRow(doc, y, description, ICD, code, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(description, 50, y)
    .text(ICD, 270, y, { width: 30, align: "right" })
    .text(code, 300, y, { width: 50, align: "right" })
    .text(unitCost, 350, y, { width: 50, align: "right" })
    .text(quantity, 400, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(price) {
  return `R ${Number(price).toFixed(2)}`;
}

function generateHeader(doc, invoice) {
  doc.image("logo.png", 50, 45, { width: 200 }).moveDown();

  doc
    .fontSize(12)
    .text(invoice.mellins.medical, 400, 40, { align: "right" })
    .fontSize(12)
    .text(invoice.mellins.name, 400, 60, { align: "right" })
    .fontSize(12)
    .text(invoice.mellins.address, 399, 73, { align: "right" })
    .fontSize(12)
    .text(invoice.mellins.suburb, 400, 86, { align: "right" })
    .fontSize(12)
    .text(invoice.mellins.city, 400, 98, { align: "right" })
    .fontSize(12)
    .text(invoice.mellins.state, 400, 112, { align: "right" })
    .fontSize(12)
    .text(invoice.mellins.postal_code, 400, 126, { align: "right" });
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(format(new Date(), "dd/MM/yyyy"), 150, customerInformationTop + 15)
    .text("VAT:", 50, customerInformationTop + 30)
    .text("4140189129", 150, customerInformationTop + 30)
    .text("Practice Number:", 50, customerInformationTop + 45)
    .text("0824151", 150, customerInformationTop + 45)

    .font("Helvetica-Bold")
    .text(`Medical Aid: ${invoice.shipping.medical ?? "None"}`, 300, customerInformationTop, { align: "right" })
    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop + 15, { align: "right" })
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 30, { align: "right" })
    .text(
      `${invoice.shipping.suburb || ""}, ${invoice.shipping.city}, ${invoice.shipping.state}, ${
        invoice.shipping.postal_code
      }`,
      300,
      customerInformationTop + 30,
      { align: "right" },
    )
    .moveDown();

  generateHr(doc, 262);
}

let productSku;

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 280;

  doc.font("Helvetica-Bold");
  generateTableRow(doc, invoiceTableTop, "Description", "ICD10", "Code", "Unit Cost", "Quantity", "Line Total");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 32;
    let ICD;

    if (item.sku) {
      productSku = item.sku;
    }

    if (item.title.includes("Selections")) {
      item.title = item.title.replace(") \r\n OS (", ")\nOS (");
    }

    if (item.title.includes("Biofinity") || item.title.includes("Proclear") || item.title.includes("Acuvue")) {
      ICD = "Z97.3";
    }

    generateTableRow(
      doc,
      position,
      item.title,
      ICD,
      productSku,
      formatCurrency(Number(item.price)),
      item.quantity,
      formatCurrency(Number(item.price)),
    );

    if (item.properties && item.properties.length !== 0) {
      generateHr(doc, position + 35);
    } else {
      generateHr(doc, position + 25);
    }
  }
}

function generateInvoiceFooter(doc, invoice) {
  const pageFooter = 660;
  generateHr(doc, pageFooter);

  const discountPosition = pageFooter + 20;
  generateTableRow(doc, discountPosition, "", "", "", "Discount", "", formatCurrency(invoice.discount));

  const subtotalPosition = discountPosition + 20;
  generateTableRow(doc, subtotalPosition, "", "", "", "Subtotal", "", formatCurrency(invoice.subtotal));

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(doc, paidToDatePosition, "", "", "", "Paid To Date", "", formatCurrency(invoice.paid));

  generateHr(doc, paidToDatePosition + 25);
}

export function createInvoice(invoice) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);

  generateInvoiceFooter(doc, invoice);

  doc.end();

  return doc;
}
