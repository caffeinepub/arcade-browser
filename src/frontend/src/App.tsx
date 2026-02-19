import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/Layout/AppLayout';
import CatalogPage from './pages/CatalogPage';
import PlayGamePage from './pages/PlayGamePage';
import HelpPage from './pages/HelpPage';
import ProfileSetupDialog from './components/Auth/ProfileSetupDialog';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <ProfileSetupDialog />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage,
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/$gameId',
  component: PlayGamePage,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage,
});

const routeTree = rootRoute.addChildren([indexRoute, playRoute, helpRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
