"use client";

import { Stack, Typography, Divider } from "@mui/material";

const SECTION_CONFIGS = {
  summary: {
    title: "Summary",
    render: (data) => (
      <Typography variant="body2" gutterBottom align="justify">
        {data}
      </Typography>
    ),
  },
  key_points: {
    title: "Key Points",
    render: (data) => (
      <>
        {data?.map((point, index) => (
          <Typography key={index} variant="body2" align="justify">
            • {point}
          </Typography>
        ))}
      </>
    ),
  },
  scope_of_work: {
    title: "Scope of Work",
    render: (data) => (
      <Typography variant="body2" gutterBottom align="justify">
        {data}
      </Typography>
    ),
  },
  deliverables: {
    title: "Deliverables",
    render: (data) => (
      <>
        {data?.map((item, index) => (
          <Typography key={index} variant="body2" align="justify">
            • {item}
          </Typography>
        ))}
      </>
    ),
  },
  timeline: {
    title: "Timeline",
    render: (data) => (
      <Typography variant="body2" gutterBottom align="justify">
        {data}
      </Typography>
    ),
  },
  budget_summary: {
    title: "Budget Summary",
    render: (data) => (
      <Typography variant="body2" gutterBottom align="justify">
        {data}
      </Typography>
    ),
  },
  potential_issues: {
    title: "Potential Issues",
    render: (data) => (
      <>
        {data?.compliance_issues && (
          <>
            <Typography variant="body2" fontWeight="bold" mb={1}>
              Compliance Issues
            </Typography>
            {data.compliance_issues.map((issue, index) => (
              <div key={index} style={{ marginBottom: "16px" }}>
                <Typography
                  variant="body2"
                  align="center"
                  fontStyle="italic"
                  sx={{ mb: 0.5 }}
                >
                  "{issue.excerpt}"
                </Typography>
                <Typography
                  variant="caption"
                  align="center"
                  fontStyle="italic"
                  color="text.disabled"
                  sx={{ display: "block", mb: 1 }}
                >
                  - {issue.location}
                </Typography>
                <Typography variant="body2" align="justify">
                  {issue.explanation}
                </Typography>
              </div>
            ))}
          </>
        )}
        {data?.security_concerns && (
          <>
            <Typography variant="body2" fontWeight="bold" mb={1} mt={2}>
              Security Concerns
            </Typography>
            {data.security_concerns.map((concern, index) => (
              <div key={index} style={{ marginBottom: "16px" }}>
                <Typography
                  variant="body2"
                  align="center"
                  fontStyle="italic"
                  sx={{ mb: 0.5 }}
                >
                  "{concern.excerpt}"
                </Typography>
                <Typography
                  variant="caption"
                  align="center"
                  fontStyle="italic"
                  color="text.disabled"
                  sx={{ display: "block", mb: 1 }}
                >
                  - {concern.location}
                </Typography>
                <Typography variant="body2" align="justify">
                  {concern.explanation}
                </Typography>
              </div>
            ))}
          </>
        )}
      </>
    ),
  },
  recommendations: {
    title: "Recommendations",
    render: (data) => (
      <>
        {data?.map((rec, index) => (
          <Typography key={index} variant="body2" align="justify">
            • {rec}
          </Typography>
        ))}
      </>
    ),
  },
  references: {
    title: "References",
    render: (data) => (
      <>
        {data?.map((ref, index) => (
          <Typography key={index} variant="body2" align="justify">
            • {ref}
          </Typography>
        ))}
      </>
    ),
  },
};

const DOCUMENT_TYPE_SECTION_ORDER = {
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

const DEFAULT_SECTION_ORDER = Object.keys(SECTION_CONFIGS);

export default function ReportRenderer({ reportData, documentType }) {
  if (!reportData) {
    return (
      <Typography color="text.secondary">No report data available</Typography>
    );
  }

  const normalizedType = documentType?.trim().toLowerCase();
  const sectionOrder =
    DOCUMENT_TYPE_SECTION_ORDER[normalizedType] || DEFAULT_SECTION_ORDER;

  return (
    <Stack spacing={3}>
      {sectionOrder.map((sectionKey) => {
        const data = reportData[sectionKey];
        const config = SECTION_CONFIGS[sectionKey];

        // Skip sections that don't have data
        if (!data || !config) return null;

        // Skip empty arrays or strings
        if (
          (Array.isArray(data) && data.length === 0) ||
          (typeof data === "string" && !data.trim())
        ) {
          return null;
        }

        return (
          <div key={sectionKey}>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight="bold"
              textTransform="capitalize"
            >
              {config.title}
            </Typography>
            {config.render(data)}
            <Divider sx={{ mt: 2 }} />
          </div>
        );
      })}
    </Stack>
  );
}
