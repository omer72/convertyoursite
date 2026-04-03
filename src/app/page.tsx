import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { buildMetadata } from "@/components/layout/seo";

export const metadata = buildMetadata({
  title: "Modern Web Development",
  description:
    "We convert legacy Wix sites into modern, high-performance websites using Next.js, React, Tailwind CSS, and MUI.",
  path: "/",
});

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-8">
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

      <Box className="w-full max-w-5xl mt-16">
        <Typography
          variant="h4"
          component="h2"
          className="text-center mb-8"
          gutterBottom
        >
          See What We Do
        </Typography>
        <Box
          className="rounded-2xl overflow-hidden shadow-2xl"
          sx={{
            aspectRatio: "16/9",
            width: "100%",
            backgroundColor: "#0a0a2e",
          }}
        >
          <video
            src="/company-reel.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>
    </section>
  );
}
