import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SettingsPanel } from "@/components/SettingsPanel";
import { getLanguages } from "@/lib/content";
// The version number shown under About comes from package.json.
import packageInfo from "@/package.json";

export const metadata: Metadata = { title: "Settings" };

// The Settings page, opened from Profile. It lives inside /profile so
// the Profile tab stays highlighted, and the top bar shows a back arrow
// to Profile (see components/TopBar.tsx).

export default function SettingsPage() {
  const languages = getLanguages().map(({ meta }) => ({
    code: meta.code,
    name: meta.name,
  }));

  return (
    <>
      <PageHeader eyebrow="Profile" title="Settings" />
      <SettingsPanel languages={languages} version={packageInfo.version} />
    </>
  );
}
