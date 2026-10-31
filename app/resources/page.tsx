import type { Metadata } from "next";

import { ResourceBrowser } from "@/components/resource-browser";
import { getCategories, getResources } from "@/lib/hub";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resources",
  description: "Resources kept from X: galleries, type, tools, and how design teams are changing.",
};

export default async function ResourcesPage() {
  const [categories, resources] = await Promise.all([getCategories(), getResources()]);

  return (
    <>
      <h1>Resources</h1>
      <ResourceBrowser categories={categories} resources={resources} />
    </>
  );
}
