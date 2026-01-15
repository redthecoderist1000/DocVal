import jsPDF from "jspdf";
import set_dict_header from "./header";
import set_dict_footer from "./footer";

const Report_pdf = (data) => {
  let filename = `${data.title}_report`
    .replaceAll(" ", "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  const doc = new jsPDF();

  doc.setProperties({
    title: `${data.title} Report`,
    subject: "Document Evaluation Report",
    author: "DocVal",
    keywords: "document, evaluation, report, Gemini AI",
    creator: "DICT MISS-DWAD",
  });

  set_dict_header(doc);

  let yOffset = 50;
  const lineHeight = 5;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); //black
  doc.text(
    "Document Evaluation Report",
    doc.internal.pageSize.getWidth() / 2,
    yOffset,
    { align: "center" }
  );
  yOffset += lineHeight * 2;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // ref no
  doc.text(`Reference No.: ${data.refno}`, margin, yOffset);
  yOffset += lineHeight;
  // title
  const titleLines = doc.splitTextToSize(
    `Document name: ${data.report_data.document_name}`,
    180
  );
  titleLines.forEach((line) => {
    if (yOffset + lineHeight > pageHeight - margin - 5) {
      doc.addPage();
      set_dict_header(doc);
      yOffset = 50;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    doc.text(line, margin, yOffset);
    yOffset += lineHeight;
  });
  // date created
  doc.text(
    `Document classification: ${data.classification_name}`,
    margin,
    yOffset
  );
  yOffset += lineHeight;
  // type
  doc.text(`Document type: ${data.type_name}`, margin, yOffset);
  yOffset += lineHeight;
  // sender office
  doc.text(`Sender Office: ${data.sender_office}`, margin, yOffset);
  yOffset += lineHeight;
  // generation date
  doc.text(`Generation date: ${data.generation_date}`, margin, yOffset);
  yOffset += lineHeight * 2;

  // actual report
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin, yOffset);
  yOffset += lineHeight;
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(data.report_data.summary, 180);
  summaryLines.forEach((line) => {
    if (yOffset + lineHeight > pageHeight - margin - 5) {
      doc.addPage();
      set_dict_header(doc);
      yOffset = 50;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    doc.text(line, margin, yOffset);
    yOffset += lineHeight;
  });
  yOffset += lineHeight;

  // keyppoints
  doc.setFont("helvetica", "bold");
  doc.text("Key Points", margin, yOffset);
  yOffset += lineHeight;
  doc.setFont("helvetica", "normal");
  data.report_data.key_points.forEach((point, index) => {
    const pointLines = doc.splitTextToSize(`${index + 1}. ${point}`, 180);
    pointLines.forEach((line) => {
      if (yOffset + lineHeight > pageHeight - margin - 5) {
        doc.addPage();
        set_dict_header(doc);
        yOffset = 50;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      }
      doc.text(line, margin, yOffset);
      yOffset += lineHeight;
    });
  });

  const potential_issues = data.report_data.potential_issues;
  // compliance issues
  if (potential_issues.compliance_issues.length > 0) {
    yOffset += lineHeight;
    doc.setFont("helvetica", "bold");
    // check for page break
    if (yOffset + lineHeight > pageHeight - margin - 5) {
      doc.addPage();
      set_dict_header(doc);
      yOffset = 50;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    doc.text("Compliance Issues", margin, yOffset);
    yOffset += lineHeight;
    potential_issues.compliance_issues.forEach((issue, index) => {
      doc.setFont("helvetica", "italic");
      const issueText = `${index + 1}. \"${issue.excerpt}\" [${
        issue.location
      }]`;
      const issueLines = doc.splitTextToSize(issueText, 180);
      issueLines.forEach((line) => {
        if (yOffset + lineHeight > pageHeight - margin) {
          doc.addPage();
          set_dict_header(doc);
          yOffset = 50;
          doc.setFont("helvetica", "italic");
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
        }
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
      // Add explanation
      const explanationLines = doc.splitTextToSize(
        `Explanation: ${issue.explanation}`,
        180
      );
      explanationLines.forEach((line) => {
        if (yOffset + lineHeight > pageHeight - margin - 5) {
          doc.addPage();
          set_dict_header(doc);
          yOffset = 50;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0); //blac
          doc.setFontSize(10);
        }
        doc.setFont("helvetica", "normal");
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
    });
  }

  // security concerns
  if (potential_issues.security_concerns.length > 0) {
    yOffset += lineHeight;
    doc.setFont("helvetica", "bold");
    // check for page break
    if (yOffset + lineHeight > pageHeight - margin - 5) {
      doc.addPage();
      set_dict_header(doc);
      yOffset = 50;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    doc.text("Security Concerns", margin, yOffset);
    yOffset += lineHeight;
    potential_issues.security_concerns.forEach((issue, index) => {
      doc.setFont("helvetica", "italic");
      const issueText = `${index + 1}. \"${issue.excerpt}\" [${
        issue.location
      }]`;
      const issueLines = doc.splitTextToSize(issueText, 180);
      issueLines.forEach((line) => {
        if (yOffset + lineHeight > pageHeight - margin) {
          doc.addPage();
          set_dict_header(doc);
          yOffset = 50;
          doc.setFont("helvetica", "italic");
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
        }
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
      // Add explanation
      const explanationLines = doc.splitTextToSize(
        `Explanation: ${issue.explanation}`,
        180
      );
      explanationLines.forEach((line) => {
        if (yOffset + lineHeight > pageHeight - margin - 5) {
          doc.addPage();
          set_dict_header(doc);
          yOffset = 50;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0); //black
          doc.setFontSize(10);
        }
        doc.setFont("helvetica", "normal");
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
    });
  }

  // recommendations
  yOffset += lineHeight;
  doc.setFont("helvetica", "bold");
  // check for page break
  if (yOffset + lineHeight > pageHeight - margin - 5) {
    doc.addPage();
    set_dict_header(doc);
    yOffset = 50;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
  }
  doc.text("Recommendations", margin, yOffset);
  yOffset += lineHeight;
  doc.setFont("helvetica", "normal");
  data.report_data.recommendations.forEach((recommendation, index) => {
    const recommendationLines = doc.splitTextToSize(
      `${index + 1}. ${recommendation}`,
      180
    );
    recommendationLines.forEach((line) => {
      if (yOffset + lineHeight > pageHeight - margin - 5) {
        doc.addPage();
        set_dict_header(doc);
        yOffset = 50;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      }
      doc.text(line, margin, yOffset);
      yOffset += lineHeight;
    });
  });

  // references
  yOffset += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text("References", margin, yOffset);
  yOffset += lineHeight;
  doc.setFont("helvetica", "normal");
  const referenceLines = doc.splitTextToSize(data.report_data.references, 180);
  referenceLines.forEach((line) => {
    if (yOffset + lineHeight > pageHeight - margin - 5) {
      doc.addPage();
      set_dict_header(doc);
      yOffset = 50;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    doc.text(`${line}`, margin, yOffset);
    yOffset += lineHeight;
  });

  set_dict_footer(doc);
  doc.save(`${filename}.pdf`);
};

export default Report_pdf;
