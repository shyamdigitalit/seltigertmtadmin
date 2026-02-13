import { Delete, Edit } from "@mui/icons-material";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";

const BlockPreview = ({ index, block, startEditBlock, deleteBlock }) => (
    <Box key={index} mb={2}>
        <Stack direction="row" justifyContent="space-between">
            <Box flex={1}>
                {block.type === "h1" && ( <Typography variant="h4"> {block.content} </Typography> )}
                {block.type === "h2" && ( <Typography variant="h5"> {block.content} </Typography> )}
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