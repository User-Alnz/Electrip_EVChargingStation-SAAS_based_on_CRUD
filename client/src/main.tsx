// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import {SelectedViewProvider} from "./contexts/ReservationContext"

/* ************************************************************************* */

// Import the main app component

import Account from "./pages/Account";
import CGU from "./pages/CGU";
import ChargerMap from "./pages/ChargerMap";
import HomePage from "./pages/HomePage";
import Reservation from "./pages/Reservation"

/* ************************************************************************* */

import ProtectedRoute from "./contexts/ProtectedRoutes";

const router = createBrowserRouter(
  [
  {
    path: "/", // The root path
    element: <HomePage />
  },
  {
    path: "/trouver_une_borne",
    element: 
    (<ProtectedRoute>
        <ChargerMap />
      </ProtectedRoute>)
  },
  {
    path: "/reservation",
    element: 
    (<ProtectedRoute>
        <Reservation />
      </ProtectedRoute>)
  },
  {
    path: "/mon_compte",
    element: <Account />,
  },
  {
    path: "/Conditions_Generales_d'Utilisation",
    element: <CGU />,
  },
  ],
  {
    basename: import.meta.env.BASE_URL, // Inject base URL when React Router your app is mounted under /Electrip. BASE_URL is injected from vite.config.ts
  });

/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    {/* AuthProvider fournit le context à l'ensemble de ce qui est encapsulé */}
    <AuthProvider>
      <SelectedViewProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </SelectedViewProvider>
    </AuthProvider>
  </StrictMode>,
);

/**
 * Helpful Notes:
 *
 * 1. Adding More Routes:
 *    To add more pages to your app, first create a new component (e.g., About.tsx).
 *    Then, import that component above like this:
 *
 *    import About from "./pages/About";
 *
 *    Add a new route to the router:
 *
 *      {
 *        path: "/about",
 *        element: <About />,  // Renders the About component
 *      }
 *
 * 2. Try Nested Routes:
 *    For more complex applications, you can nest routes. This lets you have sub-pages within a main page.
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#nested-routes
 *
 * 3. Experiment with Dynamic Routes:
 *    You can create routes that take parameters (e.g., /users/:id).
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#url-params-in-loaders
 */
