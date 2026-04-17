import { Delete, Edit } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

const BlogList = ({ addNewBlog, blogs, selectedBlogId, editBlog, deleteBlog }) => (
    <Grid width={"30%"}>
        <Card variant="outlined">
            <CardContent>
            <Stack direction="row" justifyContent="space-between" mb={2} >
                <Typography variant="h6">Blogs</Typography>
                <Button size="small" onClick={addNewBlog}> + New </Button>
            </Stack>

            <List>
                {blogs.map((blog) => (
                <ListItem
                    style={{ backgroundColor: blog._id === selectedBlogId ? "lightgray" : "transparent", cursor: "pointer" }}  
                    key={blog._id}
                    secondaryAction={
                        <Stack direction="row">
                            <IconButton onClick={() => editBlog(blog)} > <Edit fontSize="small" /> </IconButton>
                            <IconButton color="error" onClick={() => deleteBlog(blog._id)} >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Stack>
                    }
                >
                    <ListItemText primary={blog?.blocks[0]?.content.length > 30 ? blog?.blocks[0]?.content.substring(0, 30) + " ..." : blog?.blocks[0]?.content} 
                    />
                </ListItem>
                ))}
            </List>
            </CardContent>
        </Card>
    </Grid>
)


export default BlogList;