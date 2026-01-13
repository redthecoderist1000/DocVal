"use client";

import { IconButton, Stack, Typography } from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Report_pdf from "@/helper/printables/Report_pdf";

export default function ReportTab({ data }) {
  const reportData = JSON.parse(data.report);
  const handleExportPDF = () => {
    const pdfData = {
      title: data.title,
      refno: data.reference_no,
      classification_name: data.doc_class,
      type_name: data.doc_type,
      sender_office: data.sender_office,
      generation_date: new Date(data.date_created).toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
      }),
      report_data: reportData,
    };

    Report_pdf(pdfData);
  };

  return (
    <div>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" fontWeight="bold">
            Report
          </Typography>
          <IconButton size="small" onClick={handleExportPDF}>
            <PrintRoundedIcon />
          </IconButton>
        </Stack>
        <Typography variant="caption" fontStyle="italic" color="text.disabled">
          powered by Gemini AI <AutoAwesomeRoundedIcon sx={{ fontSize: 10 }} />
        </Typography>
        <Typography variant="body1" gutterBottom fontWeight="bold">
          Summary
        </Typography>
        <Typography variant="body2" gutterBottom align="justify">
          {reportData.summary}
        </Typography>
        <Typography variant="body1" gutterBottom fontWeight="bold">
          Key Points
        </Typography>
        {reportData.key_points.map((point, index) => (
          <Typography key={index} variant="body2" align="justify">
            • {point}
          </Typography>
        ))}
        {reportData.potential_issues.compliance_issues && (
          <>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Compliance Issues
            </Typography>
            {reportData.potential_issues.compliance_issues.map(
              (data, index) => (
                <div key={index}>
                  <Typography
                    variant="body2"
                    align="center"
                    fontStyle={"italic"}
                  >
                    "{data.excerpt}"
                  </Typography>
                  <Typography
                    variant="caption"
                    align="center"
                    fontStyle="italic"
                    color="text.disabled"
                  >
                    - {data.location}
                  </Typography>
                  <Typography variant="body1" align="justify">
                    {data.explanation}
                  </Typography>
                </div>
              )
            )}
          </>
        )}
        {reportData.potential_issues.security_concerns && (
          <>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Security Concerns
            </Typography>
            {reportData.potential_issues.security_concerns.map(
              (data, index) => (
                <div key={index}>
                  <Typography
                    variant="body2"
                    align="center"
                    fontStyle={"italic"}
                  >
                    "{data.excerpt}"
                  </Typography>
                  <Typography
                    variant="caption"
                    align="center"
                    fontStyle="italic"
                    color="text.disabled"
                  >
                    - {data.location}
                  </Typography>
                  <Typography variant="body1" align="justify">
                    {data.explanation}
                  </Typography>
                </div>
              )
            )}
          </>
        )}
        <Typography variant="body1" gutterBottom fontWeight="bold">
          Recommendations
        </Typography>
        {reportData.recommendations.map((data, index) => (
          <Typography key={index} variant="body2" align="justify">
            • {data}
          </Typography>
        ))}
        <Typography variant="body1" gutterBottom fontWeight="bold">
          References
        </Typography>
        {reportData.references.map((data, index) => (
          <Typography key={index} variant="body2" align="justify">
            • {data}
          </Typography>
        ))}
      </Stack>
    </div>
  );
}
