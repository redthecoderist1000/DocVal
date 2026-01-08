"use client";

import { Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useRouter } from "next/navigation";
import axiosInstance from "@/helper/Axios";

export default function files() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDocuments = [
    {
      id: 1,
      doc_title: "document title",
      sender: "sender office",
      created_at: "2023-10-01T10:00:00Z",
    },
  ];

  const headerCells = ["Documents", "Date Received", "Status", "Actions"];

  useEffect(() => {
    axiosInstance
      .post("/document/getFileByUser")
      .then((res) => {
        console.log(res);
        setFiles(res.body);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className={`${isModalOpen ? "blur-sm" : ""}`}>
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
          {files.length > 0 ? (
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
                  {files.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {doc.title}
                          </span>
                          <span className="text-sm text-gray-600 mt-1">
                            {doc.sender_office}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(doc.date_created).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
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
                            onClick={() => setIsModalOpen(true)}
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
                <p>
                  No documents found. Add your first document to get started.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40"
          onClick={() => setIsModalOpen(false)}
        />
      )}

      {/* Side Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
          <Typography variant="h6" fontWeight="bold">
            File Details
          </Typography>

          <IconButton size="small" onClick={() => setIsModalOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          <p className="text-gray-600">Modal content goes here...</p>
        </div>
      </div>
    </>
  );
}
