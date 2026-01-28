app.get("/office/getAllDivision", authenticate_token, async (req, res) => {
  try {
    // fetch divisions from database
    const selectReq = new sql.Request();
    const selectRes = await selectReq.query("SELECT * FROM vw_getAllDivision");
    return res.status(200).json({
      message: "Divisions retrieved successfully",
      body: selectRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/office/createDivision", authenticate_token, async (req, res) => {
  try {
    const { name, abrv } = req.body;
    // basic validation
    if (!name || !abrv) {
      return res.status(400).json({ message: "name and abrv are required" });
    }

    // fetch divisions from database
    const sqlReq = new sql.Request();
    const sqlRes = await sqlReq
      .input("name", sql.VarChar(255), name)
      .input("abrv", sql.VarChar(50), abrv)
      .execute("dbo.createDivision");
    return res.status(200).json({
      message: "Division created successfully",
      body: sqlRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/office/editDivision", authenticate_token, async (req, res) => {
  try {
    const { divId, newName, newAbrv } = req.body;
    // basic validation
    if (!divId) {
      return res.status(400).json({ message: "Please supply missing fields" });
    }
    if (!newName?.trim() && !newAbrv?.trim()) {
      return res.status(400).json({
        message: "At least a new name or new abbreviation is required",
      });
    }
    // insert doc type into database
    const updateReq = new sql.Request();
    updateReq.input("divisionId", sql.UniqueIdentifier, divId);
    if (newName?.trim()) {
      updateReq.input("newName", sql.VarChar(255), newName.trim());
    }
    if (newAbrv?.trim()) {
      updateReq.input("newAbrv", sql.VarChar(255), newAbrv.trim());
    }
    const updateRes = await updateReq.execute("dbo.editDivision");
    const updatedDivision = updateRes.recordset?.[0] || null;
    return res.status(201).json({
      message: "Division updated successfully",
      body: updatedDivision,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/office/deleteDivision", authenticate_token, async (req, res) => {
  try {
    const { divisionId } = req.body;
    // basic validation
    if (!divisionId) {
      return res.status(400).json({ message: "division ID is required" });
    }
    // delete division from database
    const deleteReq = new sql.Request();
    const deleteRes = await deleteReq
      .input("divisionId", sql.UniqueIdentifier, divisionId)
      .execute("dbo.deleteDivision");
    return res.status(200).json({
      message: "Division deleted successfully",
      body: deleteRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.get("/document/getAllDocType", authenticate_token, async (req, res) => {
  try {
    // fetch document types from database
    const selectReq = new sql.Request();
    const selectRes = await selectReq.query("SELECT * FROM vw_getAllDocType");
    return res.status(200).json({
      message: "Document types retrieved successfully",
      body: selectRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.get("/document/getAllDocClass", authenticate_token, async (req, res) => {
  try {
    // fetch document classes from database
    const selectReq = new sql.Request();
    const selectRes = await selectReq.query("SELECT * FROM vw_getAllDocClass");
    return res.status(200).json({
      message: "Document classes retrieved successfully",
      body: selectRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/getFileByUser", authenticate_token, async (req, res) => {
  try {
    // user id from bearer token
    const userId = req.user.uid;
    const selectReq = new sql.Request();
    const selectRes = await selectReq
      .input("user_id", sql.UniqueIdentifier, userId)
      .execute("dbo.getFileByUser");
    return res.status(200).json({
      message: "Files retrieved successfully",
      body: selectRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/getFileDetail", authenticate_token, async (req, res) => {
  try {
    const { fileId } = req.body;

    // basic validation
    if (!fileId) {
      return res.status(400).json({ message: "fileId is required" });
    }

    // fetch file details from database
    const selectReq = new sql.Request();
    const selectRes = await selectReq
      .input("file_id", sql.VarChar(255), fileId)
      .execute("dbo.getFileDetail");
    return res.status(200).json({
      message: "File details retrieved successfully",
      body: selectRes.recordset[0],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/createFile", authenticate_token, async (req, res) => {
  try {
    const {
      reference_no,
      title,
      doc_type,
      doc_class,
      sender_office,
      sender_person,
      sender_email,
      sender_phone,
      base64_data,
      report,
    } = req.body;
    const userId = req.user.uid;

    // basic validation
    if (
      !reference_no ||
      !title ||
      !doc_type ||
      !doc_class ||
      !sender_office ||
      !sender_person ||
      !sender_email ||
      !sender_phone ||
      !base64_data ||
      !report
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // uplaod file to storage service here and get the URL
    // for development, we will skip this step and use a placeholder URL
    const fileName = `${Date.now()}_${reference_no}.pdf`;
    // Remove "data:*/*;base64," prefix if present
    const base64String = base64_data.split(";base64,").pop();

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64String, "base64");

    // Define folder path (make sure it exists)
    const folderPath = path.join(__dirname, "uploaded_files");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Save file
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, fileBuffer);
    // /opt/render/project/src/uploaded_files/1767859561480_ref-003-221.pdf

    // inserting to database
    const insertReq = new sql.Request();
    const insertRes = await insertReq
      .input("reference_no", sql.VarChar(100), reference_no)
      .input("title", sql.VarChar(255), title)
      .input("doc_type", sql.UniqueIdentifier, doc_type)
      .input("doc_class", sql.UniqueIdentifier, doc_class)
      .input("sender_office", sql.VarChar(255), sender_office)
      .input("sender_person", sql.VarChar(255), sender_person)
      .input("sender_email", sql.VarChar(255), sender_email)
      .input("sender_phone", sql.VarChar(50), sender_phone)
      .input("created_by", sql.UniqueIdentifier, userId)
      .input("url", sql.VarChar(255), fileName)
      .input("report", sql.NVarChar(sql.MAX), JSON.stringify(report))
      .execute("dbo.createFile");
    return res.status(201).json({
      message: "File created successfully",
      body: insertRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/generateReport", authenticate_token, async (req, res) => {
  try {
    const { base64_data } = req.body;
    // basic validation
    if (!base64_data) {
      return res.status(400).json({ message: "base64_data is required" });
    }

    const report = await generateAIReport(base64_data);
    return res.status(200).json({
      message: "AI report generated successfully",
      body: report,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

app.post("/document/deleteFile", authenticate_token, async (req, res) => {
  try {
    const { fileId } = req.body;
    // basic validation
    if (!fileId) {
      return res.status(400).json({ message: "fileId is required" });
    }
    // delete file from database
    const deleteReq = new sql.Request();
    const deleteRes = await deleteReq
      .input("file_id", sql.VarChar(255), fileId)
      .query(
        "DELETE FROM tbl_file WHERE id = @file_id; SELECT @@ROWCOUNT AS affectedRows;"
      );
    return res.status(200).json({
      message: "File deleted successfully",
      body: deleteRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/createDocType", authenticate_token, async (req, res) => {
  try {
    const { name } = req.body;
    // basic validation
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    // insert doc type into database
    const insertReq = new sql.Request();
    const insertRes = await insertReq
      .input("name", sql.VarChar(255), name)
      .execute("dbo.createDocType");
    return res.status(201).json({
      message: "Document type created successfully",
      body: insertRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/editDocType", authenticate_token, async (req, res) => {
  try {
    const { docTypeId, newName } = req.body;
    // basic validation
    if (!docTypeId || !newName) {
      return res
        .status(400)
        .json({ message: "Document type ID and new name are required" });
    }
    // insert doc type into database
    const updateReq = new sql.Request();
    const updateRes = await updateReq
      .input("docTypeId", sql.UniqueIdentifier, docTypeId)
      .input("newName", sql.VarChar(255), newName.trim())
      .execute("dbo.editDocType");

    const updatedDocType = updateRes.recordset?.[0] || null;

    return res.status(201).json({
      message: "Document type updated successfully",
      body: updatedDocType,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/deleteDocType", authenticate_token, async (req, res) => {
  try {
    const { docTypeId } = req.body;
    // basic validation
    if (!docTypeId) {
      return res.status(400).json({ message: "Document type ID is required" });
    }
    // delete doc type from database
    const deleteReq = new sql.Request();
    const deleteRes = await deleteReq
      .input("docTypeId", sql.UniqueIdentifier, docTypeId)
      .execute("dbo.deleteDocType");
    return res.status(200).json({
      message: "Document type deleted successfully",
      body: deleteRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/createDocClass", authenticate_token, async (req, res) => {
  try {
    const { name } = req.body;
    // basic validation
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    // insert doc type into database
    const insertReq = new sql.Request();
    const insertRes = await insertReq
      .input("name", sql.VarChar(255), name)
      .execute("dbo.createDocClass");
    return res.status(201).json({
      message: "Document classification created successfully",
      body: insertRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/editDocClass", authenticate_token, async (req, res) => {
  try {
    const { docClassId, newName } = req.body;
    // basic validation
    if (!docClassId || !newName) {
      return res
        .status(400)
        .json({ message: "Document class ID and new name are required" });
    }
    // insert doc type into database
    const updateReq = new sql.Request();
    const updateRes = await updateReq
      .input("docClassId", sql.UniqueIdentifier, docClassId)
      .input("newName", sql.VarChar(255), newName.trim())
      .execute("dbo.editDocClass");
    const updatedDocClass = updateRes.recordset?.[0] || null;
    return res.status(201).json({
      message: "Document classification updated successfully",
      body: updatedDocClass,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/deleteDocClass", authenticate_token, async (req, res) => {
  try {
    const { docClassId } = req.body;
    // basic validation
    if (!docClassId) {
      return res.status(400).json({ message: "Document class ID is required" });
    }
    // delete doc type from database
    const deleteReq = new sql.Request();
    const deleteRes = await deleteReq
      .input("docClassId", sql.UniqueIdentifier, docClassId)
      .execute("dbo.deleteDocClass");
    return res.status(200).json({
      message: "Document classification deleted successfully",
      body: deleteRes.recordset,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/document/downloadFile", authenticate_token, (req, res) => {
  try {
    const { fileName } = req.body;

    // Basic validation - prevent directory traversal attacks
    if (
      fileName.includes("..") ||
      fileName.includes("/") ||
      fileName.includes("\\")
    ) {
      return res.status(400).json({ message: "Invalid file name" });
    }

    // Construct file path
    const filePath = path.join(__dirname, "uploaded_files", fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Send the file
    res.download(filePath);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});
