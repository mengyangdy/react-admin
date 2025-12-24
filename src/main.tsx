import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import "./plugins/assets";

import { ErrorBoundary } from "react-error-boundary";

import FallbackRender from "./components/ErrorBoundary.tsx";
import * as TanStackQueryProvider from "./features/tanstack-query/root-provider.tsx";
import { setupAppVersionNotification, setupIconifyOffline, setupNProgress } from "./plugins";
import { routeTree } from "./routeTree.gen";

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProviderContext,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function setupApp() {
	const rootElement = document.getElementById("app");
	if (!rootElement) return;
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<ErrorBoundary fallbackRender={FallbackRender}>
			<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
				<RouterProvider router={router} />
			</TanStackQueryProvider.Provider>
		</ErrorBoundary>,
	);
	setupNProgress();
	setupIconifyOffline();
	setupAppVersionNotification();
}
setupApp();
