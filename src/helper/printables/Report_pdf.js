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
    { align: "center" },
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
    180,
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
    yOffset,
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

  const ensurePageSpace = (extra = lineHeight) => {
    if (yOffset + extra > pageHeight - margin - 5) {
      doc.addPage();
      set_dict_header(doc);
      yOffset = 50;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
  };

  const sanitizeText = (text) => {
    if (!text) return "";
    const replacements = {
      "≤": "<=",
      "≥": ">=",
      "–": "-",
      "—": "-",
      "“": '"',
      "”": '"',
      "‘": "'",
      "’": "'",
      "•": "-",
      "…": "...",
      "×": "x",
      " ": " ",
    };

    return text.replace(
      /[≤≥–—“”‘’•…× ]/g,
      (char) => replacements[char] || char,
    );
  };

  const addSectionTitle = (title) => {
    yOffset += lineHeight;
    ensurePageSpace();
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, yOffset);
    yOffset += lineHeight;
    doc.setFont("helvetica", "normal");
  };

  const addParagraph = (text) => {
    const content = sanitizeText(text);
    if (!content) return;
    const lines = doc.splitTextToSize(content, 180);
    const align = lines.length > 1 ? "justify" : "left";
    const lineHeightFactor = 1.2; // keep internal line spacing comfortable
    const renderHeight = lines.length * lineHeight;
    ensurePageSpace(renderHeight);
    doc.text(lines, margin, yOffset, {
      align,
      maxWidth: 180,
      lineHeightFactor,
    });
    yOffset += renderHeight;
  };

  const addBullets = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    items.forEach((item, index) => {
      const bulletText = sanitizeText(`${index + 1}. ${item}`);
      const lines = doc.splitTextToSize(bulletText, 180);
      lines.forEach((line) => {
        ensurePageSpace();
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
    });
  };

  const addPotentialIssues = (potentialIssues) => {
    if (!potentialIssues) return;

    const { compliance_issues, security_concerns } = potentialIssues;

    if (Array.isArray(compliance_issues) && compliance_issues.length > 0) {
      addSectionTitle("Compliance Issues");
      compliance_issues.forEach((issue, index) => {
        doc.setFont("helvetica", "italic");
        const issueText = sanitizeText(
          `${index + 1}. \"${issue.excerpt}\" [${issue.location}]`,
        );
        const issueLines = doc.splitTextToSize(issueText, 180);
        issueLines.forEach((line) => {
          ensurePageSpace();
          doc.text(line, margin, yOffset);
          yOffset += lineHeight;
        });
        doc.setFont("helvetica", "normal");
        addParagraph(`Explanation: ${sanitizeText(issue.explanation)}`);
      });
    }

    if (Array.isArray(security_concerns) && security_concerns.length > 0) {
      addSectionTitle("Security Concerns");
      security_concerns.forEach((issue, index) => {
        doc.setFont("helvetica", "italic");
        const issueText = sanitizeText(
          `${index + 1}. \"${issue.excerpt}\" [${issue.location}]`,
        );
        const issueLines = doc.splitTextToSize(issueText, 180);
        issueLines.forEach((line) => {
          ensurePageSpace();
          doc.text(line, margin, yOffset);
          yOffset += lineHeight;
        });
        doc.setFont("helvetica", "normal");
        addParagraph(`Explanation: ${sanitizeText(issue.explanation)}`);
      });
    }
  };

  const sectionRenderer = {
    summary: { title: "Summary", render: addParagraph },
    key_points: { title: "Key Points", render: addBullets },
    scope_of_work: { title: "Scope of Work", render: addParagraph },
    deliverables: { title: "Deliverables", render: addBullets },
    timeline: { title: "Timeline", render: addParagraph },
    budget_summary: { title: "Budget Summary", render: addParagraph },
    potential_issues: { title: "Potential Issues", render: addPotentialIssues },
    recommendations: { title: "Recommendations", render: addBullets },
    references: { title: "References", render: addBullets },
  };

  const docTypeSectionOrder = {
    "terms of reference": [
      "summary",
      "key_points",
      "scope_of_work",
      "deliverables",
      "timeline",
      "budget_summary",
      "potential_issues",
      "recommendations",
      "references",
    ],
  };

  const normalizedType = data.type_name?.trim().toLowerCase();
  const defaultOrder = Object.keys(sectionRenderer);
  const sectionOrder = docTypeSectionOrder[normalizedType] || defaultOrder;

  const reportData = data.report_data || {};

  sectionOrder.forEach((sectionKey) => {
    const section = sectionRenderer[sectionKey];
    const sectionData = reportData[sectionKey];

    if (!section || sectionData == null) return;

    if (Array.isArray(sectionData) && sectionData.length === 0) return;
    if (typeof sectionData === "string" && sectionData.trim() === "") return;

    addSectionTitle(section.title);
    section.render(sectionData);
  });

  set_dict_footer(doc);
  doc.save(`${filename}.pdf`);
};

export default Report_pdf;
