"use client";

import { Button } from "@mui/material";
import { useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useRouter } from "next/navigation";

export default function files() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const filteredDocuments = [
    {
      id: 1,
      doc_title: "document title",
      sender: "sender office",
      created_at: "2023-10-01T10:00:00Z",
    },
  ];

  const headerCells = ["Documents", "Date Received", "Status", "Actions"];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Files</h1>
        <Button
          variant="contained"
          size="small"
          disableElevation
          onClick={() => router.push("/files/new")}
        >
          Add Document
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          {/* <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          /> */}
          <input
            type="text"
            placeholder="Search documents by reference number, title, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {headerCells.map((cell, index) => (
                    <th
                      key={index}
                      className={`px-6 py-4 text-${
                        index === 0 ? "left" : "center"
                      } text-xs uppercase text-gray-500`}
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {doc.doc_title}
                        </span>
                        <span className="text-sm text-gray-600 mt-1">
                          {doc.sender}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {new Date(doc.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          startIcon={
                            <RemoveRedEyeOutlinedIcon fontSize="small" />
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          }
                          disableElevation
                          size="small"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? (
              <p>No documents found matching &quot;{searchQuery}&quot;</p>
            ) : (
              <p>No documents found. Add your first document to get started.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
