import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

// The Today tab, the first page you see. For now it's a placeholder.
// Later it will hold the word of the hour, your next lesson and your streak.

export default function TodayPage() {
  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Welcome to Kata"
        intro="One word at a time, a little every day."
      />
      <EmptyState title="Your day starts here">
        Soon you&apos;ll find your word of the hour, your next lesson and
        your streak on this page.
      </EmptyState>
    </>
  );
}
