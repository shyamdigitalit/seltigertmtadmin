import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Button, TextField, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import AddBlockButton from "./add-block-buttons";
import ActiveBlockEditor from "./active-block-editor";
import BlockPreview from "./block-preview";
import BlogList from "./blog-list";

const defaultValues = {
  title: "",
  meta: {
    description: "",
    url: "",
    type: "",
    site_name: "",
    image: "",
  },
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues,
  });

  /* ---------------- BLOG CRUD ---------------- */

  const addNewBlog = () => {
    setSelectedBlogId(null);
    setBlocks([]);
    setActiveBlock(null);
    reset(defaultValues);
  };

  const onSubmit = (data) => {
    const payload = {
      id: selectedBlogId || Date.now(),
      title: data.title,
      blocks,
      meta: data.meta,
    };

    console.log(payload)
    if (selectedBlogId) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === selectedBlogId ? payload : b))
      );
    } else {
      setBlogs((prev) => [...prev, payload]);
    }
  };

  const editBlog = (blog) => {
    setSelectedBlogId(blog.id);
    setBlocks(blog.blocks);
    reset({
      title: blog.title,
      meta: blog.meta || defaultValues.meta,
    });
    setActiveBlock(null);
  };

  const deleteBlog = (id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    if (id === selectedBlogId) addNewBlog();
  };

  /* ---------------- BLOCK CRUD ---------------- */

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

  const saveBlock = () => {
    if (!activeBlock) return;

    if (editingIndex !== null) {
      const updated = [...blocks];
      updated[editingIndex] = activeBlock;
      setBlocks(updated);
    } else {
      setBlocks((prev) => [...prev, activeBlock]);
    }

    setActiveBlock(null);
    setEditingIndex(null);
  };

  const deleteBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- RENDER ---------------- */

  return (
    <Grid display="flex" alignItems="start" width="100%" gap={2} p={2}>
      {/* LEFT – BLOG EDITOR */}
      <Grid width="70%">
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Blog Editor</Typography>

              <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                Save Blog
              </Button>
            </Box>

            {/* Blog Title */}
            <Controller name="title" control={control} rules={{ required: "Blog title is required" }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Blog Title" fullWidth sx={{ mb: 2 }}
                  error={!!fieldState.error} helperText={fieldState.error?.message}
                />
              )}
            />

            {/* Meta Fields */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12}>
                <Controller name="meta.description" control={control}
                  render={({ field }) => ( <TextField {...field} label="Meta Description" fullWidth /> )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller name="meta.url" control={control}
                  render={({ field }) => ( <TextField {...field} label="URL" fullWidth /> )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller name="meta.type" control={control}
                  render={({ field }) => ( <TextField {...field} label="Type" fullWidth /> )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller name="meta.site_name" control={control}
                  render={({ field }) => ( <TextField {...field} label="Site Name" fullWidth /> )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller name="meta.image" control={control}
                  render={({ field }) => ( <TextField {...field} label="Image URL" fullWidth /> )}
                />
              </Grid>
            </Grid>

            {/* BLOCK PREVIEW */}
            {blocks.map((block, index) => (
              <BlockPreview key={index} index={index} block={block}
                startEditBlock={startEditBlock} deleteBlock={deleteBlock}
              />
            ))}

            {/* ADD BLOCK BUTTONS */}
            <AddBlockButton activeBlock={activeBlock} startAddBlock={startAddBlock} />

            {/* ACTIVE BLOCK EDITOR */}
            {activeBlock && (
              <ActiveBlockEditor activeBlock={activeBlock} setActiveBlock={setActiveBlock} saveBlock={saveBlock} />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* RIGHT – BLOG LIST */}
      <BlogList addNewBlog={addNewBlog} blogs={blogs} selectedBlogId={selectedBlogId} editBlog={editBlog} deleteBlog={deleteBlog} />
    </Grid>
  );
};

export default Blog;
