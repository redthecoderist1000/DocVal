"use client";

import { Chip, IconButton, Stack, Typography } from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import axiosInstance from "@/helper/Axios";

export default function InfoTab({ data }) {
  const openFile = () => {
    axiosInstance
      .post(
        "/document/downloadFile",
        { fileName: data?.url },
        { responseType: "blob" }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(res);
        window.open(url);
        // const link = document.createElement("a");
        // link.href = url;
        // link.download = data?.url || "document.pdf";
        // link.click();
        // URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <Typography variant="body1" fontWeight="bold" mb={2}>
        Document Details
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        control no.
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.id}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        reference no.
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.reference_no}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        title
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.title}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        type of document
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.doc_type}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        classification of document
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.doc_class}
      </Typography>
      <Typography variant="body1" fontWeight="bold" my={2}>
        Sender Details
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        office
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.sender_office}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        contact person
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.sender_person}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        email
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.sender_email}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        phone
      </Typography>
      <Typography variant="body2" gutterBottom>
        {data?.sender_phone}
      </Typography>
      <Typography variant="body1" fontWeight="bold" my={2}>
        File
      </Typography>
      <Typography variant="subtitle2" color="text.disabled">
        name
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          label={data?.url}
          variant="outlined"
          icon={<PictureAsPdfRoundedIcon color="error" />}
          sx={{ borderStyle: "dashed", bgcolor: "#f7f7f7ff", p: 1 }}
        />
        <IconButton size="small" onClick={openFile}>
          <LaunchRoundedIcon fontSize="10" />
        </IconButton>
      </Stack>
    </div>
  );
}
