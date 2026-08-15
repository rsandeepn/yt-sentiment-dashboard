import { Link as MuiLink, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const links = [
  ["About", "/about"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Contact", "/contact"],
];

export default function PublicFooterLinks() {
  return (
    <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" aria-label="Legal and company links">
      {links.map(([label, path]) => (
        <MuiLink key={path} component={RouterLink} to={path} color="text.secondary" variant="caption">
          {label}
        </MuiLink>
      ))}
    </Stack>
  );
}
