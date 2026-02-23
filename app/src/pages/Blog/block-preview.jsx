import { Delete, Edit } from "@mui/icons-material";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import styles from "../../styles/BlogContent.module.css";


const BlockPreview = ({ index, block, startEditBlock, deleteBlock }) => (
    <Box key={index} mb={2}>
        <Stack direction="row" justifyContent="space-between">
            <Box className={styles.wrapper} flex={1}>
                {block.type === "h1" && ( <h1> {block.content} </h1> )}
                {block.type === "h2" && ( <h2> {block.content} </h2> )}
                {block.type === "h3" && ( <h3> {block.content} </h3> )}
                {block.type === "h4" && ( <h4> {block.content} </h4> )}
                {block.type === "h5" && ( <h5> {block.content} </h5> )}
                {block.type === "h6" && ( <h6> {block.content} </h6> )}
                {block.type === "p" && ( <Typography paragraph> {block.content} </Typography> )}
                {block.type === "img" && ( <img src={block.src} alt={block.alt} style={{ maxWidth: "100%", borderRadius: 6 }} /> )}
            </Box>

            <Stack direction="row">
            <IconButton onClick={() => startEditBlock(block, index)} >
                <Edit fontSize="small" />
            </IconButton>
            <IconButton color="error" onClick={() => deleteBlock(index)} >
                <Delete fontSize="small" />
            </IconButton>
            </Stack>
        </Stack>

        <Divider sx={{ mt: 2 }} />
    </Box>
);

export default BlockPreview;