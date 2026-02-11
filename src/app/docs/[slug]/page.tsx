
import { notFound } from "next/navigation";
import { docSections } from "../content";
import DocContent from "./doc-content";

export default async function DocSectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const section = docSections[slug];

    if (!section) {
        return notFound();
    }

    return <DocContent slug={slug} />;
}
