import { Typography, Paper, Box } from "@mui/material";
import MainContainer from "@/components/MainContainer";

export default function ContactPage() {
  return (
    <MainContainer>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ p: 2 }}>
            <Typography>
              CSE Department, Shreeyash College of Engineering, Satara Tanda, Chhatrapati Sambhajinagar, Maharashtra - 431002
            </Typography>
            <Typography sx={{ mt: 1 }}>Phone :</Typography>
            <Typography>Nikita M. Rathod +91 92099 48974</Typography>
            <Typography sx={{ mt: 1 }}>Email : mealnetworks@gmail.com</Typography>
          </Paper>
        </Box>

      </Box>
    </MainContainer>
  );
}


