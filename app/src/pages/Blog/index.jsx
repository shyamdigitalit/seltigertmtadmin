import React, { useState, useEffect, useRef } from "react";
import { Grid, Card, CardContent, Typography, Button, TextField, Box, IconButton } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import AddBlockButton from "./add-block-buttons";
import ActiveBlockEditor from "./active-block-editor";
import BlockPreview from "./block-preview";
import BlogList from "./blog-list";
import axiosInstance from "../../config/axiosInstance";
import { Close } from "@mui/icons-material";

const defaultValues = {
  slug: "",
  meta: {
    title: "",
    robots: "",
    canonical: "",
    description: "",
    url: "",
    type: "",
    site_name: "",
    image: "",
  },
};

const Blog = () => {
  const bottomRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues,
  });

  React.useEffect(() => {
    getBlogList();
  }, []);

  const getBlogList = async () => {

    try {
      const response = await axiosInstance.get("/blogs").then(res => res.data);
      console.log(response)
      if(response.success){
        setBlogs(response.data);
      }
       
    } catch (error) {
      
    }

  }

  /* ---------------- BLOG CRUD ---------------- */

  const addNewBlog = () => {
    setSelectedBlogId(null);
    setBlocks([]);
    setActiveBlock(null);
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    const payload = {
      slug: data.slug,
      meta: data.meta,
      blocks,
    };

    console.log(payload)
    try {
      const url = selectedBlogId ? `/blogs/update?id=${selectedBlogId}` : "/blogs";
      const response = await axiosInstance[selectedBlogId ? "patch":"post"](url, payload).then(res => res.data);
      console.log(response)
      if(response.success){
        getBlogList();
        addNewBlog();
      }
    }catch (error) {
      console.log(error)
    }
  };

  const editBlog = (blog) => {
    console.log(blog)
    setSelectedBlogId(blog._id);
    setBlocks(blog.blocks);
    reset({
      slug: blog.slug,
      meta: blog.meta || defaultValues.meta,
    });
    setActiveBlock(null);
  };

  const deleteBlog = async (id) => {
    try {
      const response = await axiosInstance.put(`/blogs/delete?id=${id}`).then(res => res.data);
      console.log(response)
      if(response.success){
        getBlogList();
      }
    }catch (error) {

    }
    // setBlogs((prev) => prev.filter((b) => b._id !== id));
    // if (id === selectedBlogId) addNewBlog();
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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

              <Box display={"flex"} gap={2}>
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                  {selectedBlogId ? "Update":"Add New"} Blog
                </Button>
                {selectedBlogId && <IconButton color="error" onClick={() => addNewBlog()}> <Close /> </IconButton>}
              </Box>
            </Box>

            <Grid container display={"grid"} gridTemplateColumns={"2fr 1fr"} spacing={2} mb={2}>
              <Grid item>
                <Controller name="meta.title" control={control} rules={{ required: "Meta title is required" }}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="Meta Title" fullWidth
                      error={!!fieldState.error} helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller name="slug" control={control} rules={{ required: "Slug is required" }}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="Slug" fullWidth
                      error={!!fieldState.error} helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

            </Grid>

            {/* Meta Fields */}
            <Grid container display={"grid"} gridTemplateColumns={"1fr 1fr 1fr"} spacing={2} mb={3}>
              <Grid item xs={6}>
                <Controller name="meta.robots" control={control}
                  render={({ field }) => ( <TextField {...field} label="Robots" fullWidth /> )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller name="meta.canonical" control={control}
                  render={({ field }) => ( <TextField {...field} label="Canonical" fullWidth /> )}
                />
              </Grid>
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

        {/* 👇 this is the bottom anchor */}
        <div ref={bottomRef} style={{ height: "200px" }}   />
      </Grid>

      {/* RIGHT – BLOG LIST */}
      <BlogList addNewBlog={addNewBlog} blogs={blogs} selectedBlogId={selectedBlogId} editBlog={editBlog} deleteBlog={deleteBlog} />
    </Grid>
  );
};

export default Blog;
