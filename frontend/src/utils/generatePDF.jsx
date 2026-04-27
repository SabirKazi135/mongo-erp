// src/utils/generatePDF.js

import { pdf } from "@react-pdf/renderer";

export const generatePDF = async (
  Component,
  props,
  fileName = "invoice.pdf",
) => {
  const blob = await pdf(<Component {...props} />).toBlob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
