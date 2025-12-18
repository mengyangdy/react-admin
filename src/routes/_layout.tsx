import { createFileRoute } from "@tanstack/react-router";

import BaseLayout from "@/layouts/base-layout";

export const Route = createFileRoute("/_layout")({
	component: LayoutComponent,
});

function LayoutComponent() {
	return <BaseLayout />;
}
