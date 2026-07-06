import type { Metadata } from "next";
import { CollectionApp } from "@/components/collection/CollectionApp";

export const metadata: Metadata = { title: "Tavolara Collection" };

export default function CollectionPage() {
  return <CollectionApp />;
}
