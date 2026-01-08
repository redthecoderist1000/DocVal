"use client";

import {
  Button,
  Card,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Report_pdf from "@/helper/printables/Report_pdf";
import { useSession } from "next-auth/react";
import { useProtectedRoute } from "@/helper/ProtectedRoutes";
import axiosInstance from "@/helper/Axios";

export default function Report() {
  const { session, status } = useProtectedRoute();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // get data frm session storage
  const [newReportData, setNewReportData] = useState(
    JSON.parse(sessionStorage.getItem("newReportData")) || {}
  );

  const handleCancel = () => {
    router.push("/files", { replace: true });
    sessionStorage.removeItem("newReportData");
  };

  const handleSave = () => {
    // save logic here
    setLoading(true);
    axiosInstance
      .post("/document/createFile", {
        reference_no: newReportData.refno,
        title: newReportData.title,
        doc_type: newReportData.type,
        doc_class: newReportData.classification,
        sender_office: newReportData.sender_office,
        sender_person: newReportData.sender_person,
        sender_email: newReportData.sender_email,
        sender_phone: newReportData.sender_phone,
        base64_data: newReportData.file_base64,
        report: newReportData.report_data,
      })
      .then((res) => {
        console.log(res);
        router.push("/files", { replace: true });
        sessionStorage.removeItem("newReportData");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleExportPDF = () => {
    Report_pdf(newReportData);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container direction="row" spacing={4}>
        <Grid flex={1}>
          <Stack spacing={1} alignItems="flex-start">
            <IconButton onClick={() => router.back()}>
              <ArrowBackRoundedIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="h6"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Information Summary
            </Typography>
            <Typography variant="body2" color="text.disabled">
              reference no.
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.refno}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              title
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.title}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              type of document
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.type_name}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              classification
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.classification_name}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              sender office
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.sender_office_name}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              sender email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.sender_email}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              sender phone
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.sender_phone}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              sender name
            </Typography>
            <Typography variant="body1" gutterBottom>
              {newReportData.sender_person}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              file
            </Typography>
            <Chip
              label={newReportData.file_name || "No file selected"}
              variant="outlined"
              icon={<PictureAsPdfRoundedIcon color="error" />}
              sx={{
                borderStyle: "dashed",
                bgcolor: "#f7f7f7ff",
              }}
            />
          </Stack>
        </Grid>
        <Grid flex={3}>
          <Card elevation={0} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Report
                </Typography>
                <IconButton size="small" onClick={handleExportPDF}>
                  <PrintRoundedIcon />
                </IconButton>
              </Stack>
              <Typography
                variant="caption"
                fontStyle="italic"
                color="text.disabled"
              >
                powered by Gemini AI{" "}
                <AutoAwesomeRoundedIcon sx={{ fontSize: 10 }} />
              </Typography>
              <Typography variant="body1" gutterBottom fontWeight="bold">
                Summary
              </Typography>
              <Typography variant="body2" gutterBottom align="justify">
                {newReportData.report_data.summary}
              </Typography>
              <Typography variant="body1" gutterBottom fontWeight="bold">
                Key Points
              </Typography>
              {newReportData.report_data.key_points.map((point, index) => (
                <Typography key={index} variant="body2" align="justify">
                  • {point}
                </Typography>
              ))}
              {newReportData.report_data.potential_issues.compliance_issues && (
                <>
                  <Typography variant="body1" gutterBottom fontWeight="bold">
                    Compliance Issues
                  </Typography>
                  {newReportData.report_data.potential_issues.compliance_issues.map(
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
              {newReportData.report_data.potential_issues.security_concerns && (
                <>
                  <Typography variant="body1" gutterBottom fontWeight="bold">
                    Security Concerns
                  </Typography>
                  {newReportData.report_data.potential_issues.security_concerns.map(
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
              {newReportData.report_data.recommendations.map((data, index) => (
                <Typography key={index} variant="body2" align="justify">
                  • {data}
                </Typography>
              ))}
              <Typography variant="body1" gutterBottom fontWeight="bold">
                References
              </Typography>
              {newReportData.report_data.references.map((data, index) => (
                <Typography key={index} variant="body2" align="justify">
                  • {data}
                </Typography>
              ))}
            </Stack>
          </Card>
          <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CloseRoundedIcon />}
              onClick={handleCancel}
              loading={loading}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              disableElevation
              color="success"
              startIcon={<CheckRoundedIcon />}
              onClick={handleSave}
              loading={loading}
            >
              save
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
