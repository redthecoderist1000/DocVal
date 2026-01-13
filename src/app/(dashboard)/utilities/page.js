"use client";

import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import DivisionTab from "@/app/(dashboard)/utilities/components/tabs/DivisionTab";
import DocumentTypeTab from "@/app/(dashboard)/utilities/components/tabs/DocumentTypeTab";
import DocumentClassificationTab from "@/app/(dashboard)/utilities/components/tabs/DocumentClassificationTab";
import AccountsTab from "@/app/(dashboard)/utilities/components/tabs/AccountsTab";

export default function utilities() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const tabs = [
    { label: "Division", id: 0 },
    { label: "Document Type", id: 1 },
    { label: "Document Classification", id: 2 },
    { label: "Accounts", id: 3 },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Utilities</h1>
      </div>

      {/* Tabs as Buttons */}
      <Stack direction="row" spacing={2} mb={3}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? "contained" : "outlined"}
            size="small"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              ...(activeTab !== tab.id && {
                color: "#9CA3AF",
                borderColor: "#9CA3AF",
                "&:hover": {
                  borderColor: "#6B7280",
                  backgroundColor: "#f3f4f6",
                },
              }),
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Stack>

      {/* Tab Content */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <CircularProgress />
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <DivisionTab data={data} isActive={activeTab === 0} />
            )}
            {activeTab === 1 && (
              <DocumentTypeTab data={data} isActive={activeTab === 1} />
            )}
            {activeTab === 2 && (
              <DocumentClassificationTab
                data={data}
                isActive={activeTab === 2}
              />
            )}
            {activeTab === 3 && (
              <AccountsTab data={data} isActive={activeTab === 3} />
            )}
          </>
        )}
      </div>
    </>
  );
}
