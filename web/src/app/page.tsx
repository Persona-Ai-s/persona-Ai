import { Header } from "@/components/header";
import { RoomComponent } from "@/components/room-component";
// import { Auth } from "@/components/auth";
import LK from "@/components/lk";
import Heart from "@/assets/heart.svg";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { defaultPresets } from "@/data/presets";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  let title = "Persona AI";
  let description =
    "Speech-to-speech interview platform for hiring.";

  const presetId = searchParams?.preset;
  if (presetId) {
    const selectedPreset = defaultPresets.find(
      (preset) => preset.id === presetId,
    );
    if (selectedPreset) {
      title = `Persona AI`;
      description = `Speak to a "${selectedPreset.name}" in a speech-to-speech interview platform for hiring.`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://persona-ai-production.up.railway.app/",
      images: [
        {
          url: "https://persona-ai-production.up.railway.app/og-image.png",
          width: 1200,
          height: 675,
          type: "image/png",
          alt: title,
        },
      ],
    },
  };
}

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <header className="flex flex-shrink-0 h-12 items-center justify-between px-4 w-full md:mx-auto">
        <LK />
        {/* <Auth /> */}
      </header>
      <main className="flex flex-col flex-grow overflow-hidden p-0 md:p-2 md:pt-0 w-full md:mx-auto">
        <Header />
        <RoomComponent />
      </main>
      <footer className="hidden md:flex md:items-center md:gap-2 md:justify-end font-mono uppercase text-right pt-1 pb-2 px-8 text-xs text-gray-600 w-full md:mx-auto">
        Built with
        <Heart />
        by
        <a
          href="https://voltairelabs.co.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Voltaire Labs
        </a>{" "}
        • © 2025 
      </footer>
    </div>
  );
}
