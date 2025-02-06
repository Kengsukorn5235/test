"use client";

import React, { useState } from "react";
import Image from "next/image";

import {
  Button,
  CircularProgress,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";

interface PropsUploadFile {
  img?: string[]; // รับค่า URL ของไฟล์ที่อัปโหลดไว้ก่อนหน้า
  onUploadComplete?: (urls: string[]) => void;
}

const UploadMultipleImagesWithPreview = ({
  img = [],
  onUploadComplete,
}: PropsUploadFile) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(img); // เริ่มต้นด้วย `img` ที่รับมา

  // ฟังก์ชันเลือกไฟล์ใหม่
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles([...files, ...selectedFiles]); // เพิ่มไฟล์ใหม่เข้าไป
    }
  };

  // ฟังก์ชันลบไฟล์ที่เลือก (ก่อนอัปโหลด)
  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // ฟังก์ชันลบไฟล์ที่อัปโหลดสำเร็จ
  const handleRemoveUploadedFile = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    if (onUploadComplete) onUploadComplete(updatedUrls);
  };

  // ฟังก์ชันอัปโหลดไฟล์ไปยัง API
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file!");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [...imageUrls];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "https://api.escuelajs.co/api/v1/files/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        uploadedUrls.push(response.data.location);
      }

      setImageUrls(uploadedUrls);
      if (onUploadComplete) onUploadComplete(uploadedUrls); // ส่ง URL กลับไปให้ Formik
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
      setFiles([]); // ล้างไฟล์ที่เลือกหลังจากอัปโหลดสำเร็จ
    }
  };

  return (
    <>
      <Grid2 container>
        <Grid2 size={12}>
          <Grid2 container>
            <Grid2 size={12} display={"flex"} justifyContent={"center"}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="upload-files"
              />
              <label htmlFor="upload-files">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<AddIcon />}
                >
                  Add Image
                </Button>
              </label>
            </Grid2>
          </Grid2>

          <Grid2 container>
            <Grid2 size={12} display={"flex"} justifyContent={"center"}>
              {/* แสดงชื่อไฟล์ที่เลือก */}
              {files.length > 0 && (
                <List>
                  {files.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFile(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid2>
          </Grid2>

          <Grid2 container>
            <Grid2 size={12} display={"flex"} justifyContent={"center"}>
              {/* ปุ่มอัปโหลด */}
              <Button
                variant="contained"
                color="success"
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
                style={{ marginTop: "10px" }}
              >
                {uploading ? <CircularProgress size={24} /> : "Upload Images"}
              </Button>
            </Grid2>
          </Grid2>

          <Grid2 container>
            <Grid2 size={12} display={"flex"} justifyContent={"center"}>
              {/* แสดงรูปตัวอย่างที่อัปโหลดสำเร็จ */}
              {imageUrls.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <p>Uploaded Files:</p>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {imageUrls.map((url, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          width: "100px",
                          textAlign: "center",
                        }}
                      >
                        <Image
                          src={url}
                          alt={`Uploaded ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          width={100}
                          height={100}
                          unoptimized
                        />
                        <IconButton
                          onClick={() => handleRemoveUploadedFile(index)}
                          size="small"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
};

export default UploadMultipleImagesWithPreview;
