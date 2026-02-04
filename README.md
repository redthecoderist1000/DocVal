# DocVal

## Introduction

**DocVal** is an AI-based tool designed for evaluating and validating official documents. This system leverages artificial intelligence to analyze, verify, and assess the authenticity and completeness of official documents with high accuracy. Whether you need to validate certificates, identification documents, official records, or other critical paperwork, DocVal provides a reliable and efficient solution for document verification.

The application features a secure, user-friendly interface that allows users to upload and evaluate documents, with detailed reports and insights generated through advanced AI algorithms.

## Getting Started

### Prerequisites

Before running the system, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn/pnpm/bun

### Installation Steps

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd docval_final
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add the required configuration:

   ```
   NEXT_PUBLIC_BASE_URL=<base-url-for-backend-service>
   NEXTAUTH_SECRET=<your-secret-key>

   ```

### Running the System

#### Development Mode

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

#### Production Mode

To build and run in production:

```bash
npm run build
npm start
```

## Features

- AI-powered document validation and verification
- Secure user authentication
- Dashboard for managing and tracking documents
- Document upload and analysis
- Detailed validation reports
- User profile management
- Dynamic report schemas for different document types

## Dynamic Report Schemas

The system supports generating AI reports with different structures based on document type. Each document type has a custom schema and instructions that guide the AI model to generate tailored reports.

### How It Works

1. **Base Schema**: All reports include common fields (document_name, summary, key_points, recommendations, references)
2. **Type-Specific Schema**: Each document type can extend the base schema with custom fields
3. **Type-Specific Instructions**: AI receives additional guidance for analyzing specific document types
4. **Dynamic Rendering**: Report sections are displayed based on the selected schema, automatically adapting to any new document types

### Adding a New Document Type

To add support for a new document type:

#### 1. Define the Schema

In `src/app/api/helper/gemini.js` (or your separated schemas file):

```javascript
const newDocumentTypeSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    // Add custom fields specific to your document type
    custom_field: {
      type: "string",
      description: "Description of the custom field",
    },
  },
};
```

#### 2. Register in docTypeSchema

```javascript
const docTypeSchema = {
  "terms of reference": TERMS_OF_REFERENCE_SCHEMA,
  "new document type": NEW_DOCUMENT_TYPE_SCHEMA, // Add this line
};
```

#### 3. Add AI Instructions (Optional)

```javascript
const docTypeInstruction = {
  "terms of reference": "Focus on TOR-specific sections...",
  "new document type": "Focus on your document-specific analysis aspects...", // Add this line
};
```

#### 4. Define Section Order (Optional)

In `src/app/(dashboard)/files/report/components/ReportRenderer.js`:

```javascript
const docTypeSectionOrder = {
  "terms of reference": ["summary", "key_points", "scope_of_work", "deliverables", ...],
  "new document type": ["summary", "key_points", "your_custom_field", ...],  // Add this line
};
```

#### 5. Add Custom Renderer (If Needed)

```javascript
const sectionConfig = {
  your_custom_field: {
    title: "Custom Field Title",
    render: (data) => <Typography variant="body2">{data}</Typography>,
  },
  // ... rest of configs
};
```

### Files Involved

- `src/app/api/helper/gemini.js` - AI configuration
- `src/app/api/helper/schema.js` - Schema definitions
- `src/app/api/document/generateReport/route.js` - API endpoint for report generation
- `src/app/(dashboard)/files/report/components/ReportRenderer.js` - Dynamic report rendering logic
- `src/app/(dashboard)/files/new/page.js` - Document upload with type selection

### Report Display Locations

The dynamic renderer automatically works across:

- `/files/report` - New document report review page
- `/incoming/report` - Incoming document report review page
- File Details Modal's Report Tab

## Project Structure

- `src/app/` - Next.js pages, API routes, and authentication
- `src/components/` - Reusable React components
- `src/helper/` - Utility functions, context providers, and helpers
- `public/` - Static assets and uploaded files

| Name    | Role                  | Email                    |
| ------- | --------------------- | ------------------------ |
| Arvie   | Documentation         | john.doe@example.com     |
| Edward  | Documentation         | jane.smith@example.com   |
| Kenjiro | AI & Documentation    | mike.johnson@example.com |
| Red     | Fullstack Development | redochavillo@gmail.com   |
| Ron     | UI/UX                 | arboisron2@gmail.com     |

## Support

For issues, questions, or contributions, please refer to the project documentation or contact the development team.
