import { Button, Stack } from "@mui/material";

const BLOCK_TYPES = [
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
  { label: "H5", value: "h5" },
  { label: "H6", value: "h6" },
  { label: "Paragraph", value: "p" },
  { label: "Image", value: "img" },
  { label: "List", value: "ul" },
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
        {b.label}
      </Button>
    ))}
  </Stack>
);

export default AddBlockButton;