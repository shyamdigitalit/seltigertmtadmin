import { Save } from "@mui/icons-material";
import { Button, Card, CardContent, Stack, TextField } from "@mui/material";

const ActiveBlockEditor = ({ activeBlock, setActiveBlock, saveBlock }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent>
      {activeBlock.type === "img" ? (
        <Stack spacing={2}>
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


export default ActiveBlockEditor;