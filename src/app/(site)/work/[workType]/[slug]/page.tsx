import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/work/CaseStudy";
import { getWorkProject, type WorkType } from "@/sanity/queries";

export const revalidate = 3600;

const WORK_TYPES: WorkType[] = ["personal", "professional"];

function parseWorkType(value: string): WorkType | null {
  return WORK_TYPES.includes(value as WorkType) ? (value as WorkType) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workType: string; slug: string }>;
}): Promise<Metadata> {
  const { workType: rawWorkType, slug } = await params;
  const workType = parseWorkType(rawWorkType);
  if (!workType) return { title: "Work" };
  const result = await getWorkProject(workType, slug);
  return { title: result?.project.title ?? "Work" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ workType: string; slug: string }>;
}) {
  const { workType: rawWorkType, slug } = await params;
  const workType = parseWorkType(rawWorkType);
  if (!workType) notFound();

  const result = await getWorkProject(workType, slug);
  if (!result) notFound();

  return <CaseStudy workType={workType} {...result} />;
}
