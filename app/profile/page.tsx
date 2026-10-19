import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProgressSummary } from "@/components/ProgressSummary";
import { SettingsPanel } from "@/components/SettingsPanel";
import { getLanguages } from "@/lib/content";
// The version number shown under Settings → About comes from package.json.
import packageInfo from "@/package.json";

export const metadata: Metadata = { title: "Profile" };

// The Profile tab: your streak, daily goal and word counts, then
// Settings. Milestones and sign-up come later.

export default function ProfilePage() {
  const languages = getLanguages().map(({ meta }) => ({
    code: meta.code,
    name: meta.name,
  }));

  return (
    <>
      <PageHeader eyebrow="Profile" title="Your progress" />
      <ProgressSummary />
      <SettingsPanel languages={languages} version={packageInfo.version} />
    </>
  );
}
