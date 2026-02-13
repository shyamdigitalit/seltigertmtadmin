import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Button, TextField, Box } from "@mui/material";
import AddBlockButton from "./add-block-buttons";
import ActiveBlockEditor from "./active-block-editor";
import BlockPreview from "./block-preview";
import BlogList from "./blog-list";


const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [blogTitle, setBlogTitle] = useState("");

  /* ---------------- BLOG CRUD ---------------- */

  console.log(blogs)

  const addNewBlog = () => {
    setSelectedBlogId(null);
    setBlogTitle("");
    setBlocks([]);
  };

  const saveBlog = () => {
    if (!blogTitle) return alert("Blog title required");

    if (selectedBlogId) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === selectedBlogId ? { ...b, title: blogTitle, blocks } : b
        )
      );
    } else {
      setBlogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: blogTitle,
          blocks,
        },
      ]);
    }
  };

  const editBlog = (blog) => {
    setSelectedBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlocks(blog.blocks);
    setActiveBlock(null);
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter((b) => b.id !== id));
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
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  /* ---------------- RENDER ---------------- */

  return (
    <Grid display={"flex"} alignItems={"start"} width={"100%"} gap={2} p={2}>
      {/* LEFT – BLOG EDITOR */}
      <Grid width={"70%"}>
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent={"space-between"} alignItems="center" mb={2}>
              <Typography variant="h6" mb={2}> Blog Editor </Typography>

              <Button variant="contained" onClick={saveBlog} >
                Save Blog
              </Button>

            </Box>

            <TextField label="Blog Title" fullWidth sx={{ mb: 2 }} value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />

            {/* BLOCK PREVIEW */}
            {blocks.map((block, index) => ( <BlockPreview index={index} block={block} 
            startEditBlock={startEditBlock} deleteBlock={deleteBlock} /> ))}

            {/* ADD BLOCK BUTTONS */}
            <AddBlockButton activeBlock={activeBlock} startAddBlock={startAddBlock} />

            {/* ACTIVE BLOCK EDITOR */}
            {activeBlock && ( <ActiveBlockEditor activeBlock={activeBlock} 
            setActiveBlock={setActiveBlock} saveBlock={saveBlock} /> )}

          </CardContent>
        </Card>
      </Grid>

      {/* RIGHT – BLOG LIST */}
      <BlogList addNewBlog={addNewBlog} blogs={blogs} selectedBlogId={selectedBlogId} editBlog={editBlog} deleteBlog={deleteBlog} />
    </Grid>
  );
};

export default Blog;
