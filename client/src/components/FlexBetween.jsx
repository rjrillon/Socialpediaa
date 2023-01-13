import { Box } from "@mui/material";
import { styled } from "@mui/system";

//this syntax: helpful for reusing css as a component
const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}); 

export default FlexBetween;