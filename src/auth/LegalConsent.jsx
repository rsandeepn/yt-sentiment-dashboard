import { Checkbox, FormControlLabel, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function LegalConsent({ checked, onChange }) {
  return (
    <FormControlLabel
      sx={{ alignItems: "flex-start", m: 0 }}
      control={(
        <Checkbox
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          required
          size="small"
          sx={{ pt: 0.1 }}
        />
      )}
      label={(
        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
          I agree to the <MuiLink component={RouterLink} to="/terms" target="_blank">Terms of Use</MuiLink>
          {" "}and acknowledge the <MuiLink component={RouterLink} to="/privacy" target="_blank">Privacy Policy</MuiLink>.
        </Typography>
      )}
    />
  );
}
