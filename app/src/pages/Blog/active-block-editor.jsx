import React from "react";
import { Delete, Save, Upload } from "@mui/icons-material";
import { Button, Card, CardContent, CircularProgress, IconButton, Stack, TextField } from "@mui/material";
import axiosInstance from "../../config/axiosInstance";

const ActiveBlockEditor = ({ activeBlock, setActiveBlock, saveBlock }) => {

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);

  // 🔥 Upload Image API
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      // const formData = new FormData();
      // formData.append("files", selectedFile);

      // Replace with your API
      const response = await axiosInstance.post("/files/upload", {files: selectedFile});

      const data = await response.json();
      console.log(data)
      // assuming API returns { imageUrl: "https://..." }
      // setActiveBlock({
      //   ...activeBlock,
      //   src: data.imageUrl,
      // });

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {activeBlock.type === "ul" ? (
          <Stack spacing={2}>
            {activeBlock.items?.map((item, i) => (
              <Stack direction="row" spacing={1} alignItems="center" key={i}>
                
                <TextField label={`Item ${i + 1}`} fullWidth value={item}
                  onChange={(e) => {
                    const updated = [...activeBlock.items];
                    updated[i] = e.target.value;
                    setActiveBlock({ ...activeBlock, items: updated });
                  }}
                />
    
                {/* ❌ Delete button */}
                <IconButton color="error"
                  onClick={() => {
                    const updated = activeBlock.items.filter((_, idx) => idx !== i);
                    setActiveBlock({ ...activeBlock, items: updated.length ? updated : [""],  });
                  }}
                >
                  <Delete />
                </IconButton>
    
              </Stack>
            ))}
    
            {/* ➕ Add Item */}
            <Button onClick={() => setActiveBlock({ ...activeBlock, items: [...(activeBlock.items || []), ""], }) } >
              Add Item
            </Button>
          </Stack>
        ) : activeBlock.type === "img" ? (
          <Stack spacing={2}>
            
            {/* File Input */}
            <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
    
            {/* Upload Button */}
            <Button variant="contained" onClick={handleUpload} disabled={uploading || !selectedFile}
              startIcon={ uploading ? <CircularProgress size={18} /> : <Upload /> }
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
    
            <TextField label="Image URL" fullWidth value={activeBlock.src}
              onChange={(e) => setActiveBlock({ ...activeBlock, src: e.target.value, })}
            />
            <TextField label="Alt Text" fullWidth value={activeBlock.alt}
              onChange={(e) => setActiveBlock({ ...activeBlock, alt: e.target.value, })}
            />
          </Stack>
        ) : (
          <TextField label="Content" fullWidth multiline 
              rows={activeBlock.type === "p" ? 4 : 2} value={activeBlock.content} 
              onChange={(e) => setActiveBlock({ ...activeBlock, content: e.target.value, })}
          />
        )}
    
        <Stack alignItems="flex-end" mt={2}>
          <Button variant="contained" startIcon={<Save />} onClick={saveBlock} > Save Block </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
  
  


export default ActiveBlockEditor;