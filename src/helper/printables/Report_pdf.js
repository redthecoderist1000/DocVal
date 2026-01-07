import jsPDF from "jspdf";
import set_dict_header from "./header";

const Report_pdf = (data) => {
  let filename = `${data.title}_report`.replaceAll(" ", "_");
  const doc = new jsPDF();

  doc.setProperties({
    title: `${data.title} Report`,
    subject: "Document Evaluation Report",
    author: "DocVal",
    keywords: "document, evaluation, report, Gemini AI",
    creator: "DICT MISS-DWAD",
    creationDate: new Date(),
  });

  set_dict_header(doc);

  doc.save(`${filename}.pdf`);
};

export default Report_pdf;
