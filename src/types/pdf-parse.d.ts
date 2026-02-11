declare module "pdf-parse" {
  import { Buffer } from "node:buffer";

  export interface PDFInfo {
    Title?: string;
    Author?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
  }

  export interface PDFData {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata?: unknown;
    text: string;
    version?: string;
  }

  export interface PDFOptions {
    pagerender?: (pageData: unknown) => string | Promise<string>;
    max?: number;
    version?: string;
    normalizeWhitespace?: boolean;
    disableCombineTextItems?: boolean;
  }

  function pdf(data: Buffer | Uint8Array, options?: PDFOptions): Promise<PDFData>;
  export = pdf;
}

