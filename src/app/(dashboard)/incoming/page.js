import { Container } from "@mui/material";
import React from "react";

export default function IncomingPage() {
  return (
    <Container maxWidth="lg" className="py-8 min-h-[80vh]">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Incoming</h1>
        <h2 className="text-sm text-gray-600">
          Manage external documents for evaluation
        </h2>
      </div>
    </Container>
  );
}
