import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProgressSummary } from "@/components/ProgressSummary";

export const metadata: Metadata = { title: "Profile" };

// The Profile tab: your streak and word counts. Milestones and
// sign-up come later.

export default function ProfilePage() {
  return (
    <>
      <PageHeader eyebrow="Profile" title="Your progress" />
      <ProgressSummary />
    </>
  );
}
