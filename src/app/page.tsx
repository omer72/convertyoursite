import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <Box className="text-center max-w-2xl">
        <Typography variant="h2" component="h1" gutterBottom>
          convertYourSite
        </Typography>
        <Typography
          variant="h5"
          component="p"
          color="text.secondary"
          className="mb-8"
        >
          We transform legacy Wix sites into modern, blazing-fast websites built
          with Next.js, React, Tailwind CSS, and MUI.
        </Typography>
        <div className="flex gap-4 justify-center">
          <Button variant="contained" size="large">
            Get Started
          </Button>
          <Button variant="outlined" size="large">
            Learn More
          </Button>
        </div>
      </Box>
    </main>
  );
}
