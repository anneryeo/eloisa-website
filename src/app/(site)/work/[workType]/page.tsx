import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkGrid } from "@/components/work/WorkGrid";
import { getWorkByType, type WorkType } from "@/sanity/queries";

export const revalidate = 3600;

const WORK_TYPES: WorkType[] = ["personal", "professional"];

const LABELS: Record<WorkType, string> = {
  personal: "Personal",
  professional: "Professional",
};

function parseWorkType(value: string): WorkType | null {
  return WORK_TYPES.includes(value as WorkType) ? (value as WorkType) : null;
}

export function generateStaticParams() {
  return WORK_TYPES.map((workType) => ({ workType }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workType: string }>;
}): Promise<Metadata> {
  const workType = parseWorkType((await params).workType);
  return { title: workType ? `${LABELS[workType]} Work` : "Work" };
}

/** One of the two Work sub-lists reached from the expanded Work nav. */
export default async function WorkTypePage({
  params,
}: {
  params: Promise<{ workType: string }>;
}) {
  const workType = parseWorkType((await params).workType);
  if (!workType) notFound();

  const pieces = await getWorkByType(workType);

  return <WorkGrid pieces={pieces} />;
}
