import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography, TextField, Stack, IconButton, Divider, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BLOCK_TYPES = [
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "Paragraph", value: "p" },
  { label: "Image", value: "img" },
];

const BlogEditor = () => {
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const startAddBlock = (type) => {
    if (activeBlock) return;

    setEditingIndex(null);
    setActiveBlock(
      type === "img"
        ? { type, src: "", alt: "" }
        : { type, content: "" }
    );
  };

  const startEditBlock = (block, index) => {
    setActiveBlock({ ...block });
    setEditingIndex(index);
  };

  const updateActiveBlock = (key, value) => {
    setActiveBlock((prev) => ({ ...prev, [key]: value }));
  };

  const saveBlock = () => {
    if (!activeBlock) return;

    if (editingIndex !== null) {
      // EDIT
      const updated = [...blocks];
      updated[editingIndex] = activeBlock;
      setBlocks(updated);
    } else {
      // ADD
      setBlocks((prev) => [...prev, activeBlock]);
    }

    setActiveBlock(null);
    setEditingIndex(null);
  };

  const deleteBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  return (
    <Box maxWidth={900} mx="auto" p={2}>
      
      {/* PREVIEW */}
      <Card variant="outlined">
        <CardContent>
          {blocks.length === 0 && (
            <Typography color="text.secondary">
              No content added yet
            </Typography>
          )}

          {blocks.map((block, index) => (
            <Box key={index} mb={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" >
                <Box flex={1}>
                  {block.type === "h1" && (<h1> {block.content} </h1>)}
                  {block.type === "h2" && (<h2>{block.content}</h2>)}
                  {block.type === "p" && (<p>{block.content}</p> )}
                  {block.type === "img" && block.src && (<img src={block.src} alt={block.alt} style={{ width: "100%", }} />)}
                </Box>

                {/* ACTION ICONS */}
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => startEditBlock(block, index)} > <EditIcon fontSize="small" /> </IconButton>
                  <IconButton size="small" color="error" onClick={() => deleteBlock(index)} > <DeleteIcon fontSize="small" /> </IconButton>
                </Stack>
              </Stack>

              {/* <Divider sx={{ mt: 2 }} /> */}
            </Box>
          ))}
        </CardContent>
      </Card>


      
      <Divider sx={{ my: 4 }} />

      {/* ACTIVE EDITOR */}
      {activeBlock && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" mb={1}>
              {editingIndex !== null ? "Edit" : "Add"}{" "}
              {activeBlock.type.toUpperCase()}
            </Typography>

            {activeBlock.type === "img" ? (
              <Stack spacing={2}>
                <TextField label="Image URL" fullWidth value={activeBlock.src}
                  onChange={(e) => updateActiveBlock("src", e.target.value) }
                />
                <TextField label="Alt Text" fullWidth value={activeBlock.alt}
                  onChange={(e) => updateActiveBlock("alt", e.target.value) }
                />
              </Stack>
            ) : (
              <TextField label="Content" fullWidth multiline rows={activeBlock.type === "p" ? 4 : 2} 
                value={activeBlock.content} onChange={(e) => updateActiveBlock("content", e.target.value) } />
            )}

            <Stack direction="row" justifyContent="flex-end" mt={2}>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={saveBlock} > Save </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      
      {/* ADD BUTTONS */}
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        {BLOCK_TYPES.map((b) => (
          <Button key={b.value} variant="outlined" startIcon={<AddIcon />} disabled={!!activeBlock}
            onClick={() => startAddBlock(b.value)} >
            Add {b.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default BlogEditor;
