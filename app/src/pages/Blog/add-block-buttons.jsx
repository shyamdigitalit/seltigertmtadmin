import { Button, Stack } from "@mui/material";

const BLOCK_TYPES = [
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "Paragraph", value: "p" },
  { label: "Image", value: "img" },
];

const AddBlockButton = ({ activeBlock, startAddBlock }) => (
  <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
    {BLOCK_TYPES.map((b) => (
      <Button
        key={b.value}
        size="small"
        variant="outlined"
        disabled={!!activeBlock}
        onClick={() => startAddBlock(b.value)}
      >
        Add {b.label}
      </Button>
    ))}
  </Stack>
);

export default AddBlockButton;