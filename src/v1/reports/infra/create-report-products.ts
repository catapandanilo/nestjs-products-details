import { createWriteStream, WriteStream } from 'fs';
import CurrenciesFormat from '../../utils/currencies-format';
import { ProductsDetails } from '../types';
import * as PDFDocument from 'pdfkit';
import * as moment from 'moment';

export class ReportCreateProducts {
  private fileName = '';
  private readonly POSITION_X: number = 50;
  private readonly POSITION_Y: number = 20;
  private readonly PAGE_SIZE_LINES: number = 40;

  private readonly DESCRIPTION_POSITION_X: number = 120;
  private readonly CREATED_POSITION_X: number = 350;
  private readonly UPDATED_POSITION_X: number = 420;

  private readonly LINE_TITLE: number = 5;
  private readonly LINE_FIRST: number = 6;

  constructor(private readonly paramsProducts: ProductsDetails[]) {}

  create(): WriteStream {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    const writeStream = this.createFile(doc);

    this.printLogo(doc);

    this.printTitle(doc, this.LINE_TITLE);

    this.setFontSize(doc);

    let nextLine: number = this.LINE_FIRST;

    this.printHeaderProductsDetails(doc, nextLine);

    nextLine = this.printCutLine(doc, nextLine);

    for (const productDetails of this.paramsProducts) {
      nextLine = this.isFinalPage(nextLine, doc);
      nextLine = this.printReleasesDetails(doc, nextLine, productDetails);
    }

    doc.end();

    return writeStream;
  }

  private setFontSize(doc: PDFKit.PDFDocument): void {
    doc.fontSize(10);
  }

  private isFinalPage(nextLine: number, doc: PDFKit.PDFDocument): number {
    if (nextLine >= this.PAGE_SIZE_LINES) {
      doc.addPage();
      nextLine = 1;
    }
    return nextLine;
  }

  private createFile(doc: PDFKit.PDFDocument): WriteStream {
    const formattedDate = moment(new Date().toJSON()).format('DDMMYYYHHmmsssss');
    if (process.env.NODE_ENV === 'development') {
      this.fileName = 'report';
      const writeStream = createWriteStream(`public/reports/report.pdf`);
      doc.pipe(writeStream);
      return writeStream;
    } else {
      this.fileName = formattedDate;
      const writeStream = createWriteStream(`public/reports/product${this.fileName}.pdf`);
      doc.pipe(writeStream);
      return writeStream;
    }
  }

  private printLogo(doc: PDFKit.PDFDocument): void {
    doc.image(`public/img/logo.png`, this.POSITION_X, this.POSITION_Y, {
      fit: [400, 70],
      align: `right`,
    });
  }

  private printTitle(doc: PDFKit.PDFDocument, line: number): void {
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(`RELATÓRIO DE PRODUTO(S)`, this.POSITION_X, this.POSITION_Y * line, { align: 'left' });

    doc.font('Helvetica');
  }

  private printHeaderProductsDetails(doc: PDFKit.PDFDocument, line: number): void {
    doc.text(`Código`, this.POSITION_X, this.POSITION_Y * line);
    doc.text(`Descrição`, this.DESCRIPTION_POSITION_X, this.POSITION_Y * line);
    doc.text(`Dt. Cadastro`, this.CREATED_POSITION_X, this.POSITION_Y * line);
    doc.text(`Dt. Atualização`, this.UPDATED_POSITION_X, this.POSITION_Y * line);
    doc.text(`Preço`, this.POSITION_X, this.POSITION_Y * line, {
      align: 'right',
    });
  }

  private printCutLine(doc: PDFKit.PDFDocument, line: number): number {
    doc.underline(this.POSITION_X, this.POSITION_Y * line - 15, 495, 27, {
      color: `#000000`,
    });
    return ++line;
  }

  private printReleasesDetails(
    doc: PDFKit.PDFDocument,
    line: number,
    products: ProductsDetails,
  ): number {
    const DESC_MAX_SIZE = 32;

    doc.text(`${products.id}`, this.POSITION_X, this.POSITION_Y * line);
    doc.text(
      `${products.description.toString().substr(0, DESC_MAX_SIZE)}`,
      this.DESCRIPTION_POSITION_X,
      this.POSITION_Y * line,
    );

    let formattedDate = moment(products.createdAt).format(`DD/MM/YYYY`);
    doc.text(`${formattedDate}`, this.CREATED_POSITION_X, this.POSITION_Y * line);
    formattedDate = moment(products.updatedAt).format(`DD/MM/YYYY`);
    doc.text(`${formattedDate}`, this.UPDATED_POSITION_X, this.POSITION_Y * line);

    doc.text(
      `${CurrenciesFormat.currencyBRL(products.price)}`,
      this.POSITION_X,
      this.POSITION_Y * line,
      { align: 'right' },
    );

    line++;

    line = this.isFinalPage(line, doc);

    return line;
  }
}
