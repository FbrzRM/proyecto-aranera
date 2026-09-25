import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { InicioPage } from "../pages/InicioPage";
import { ProximamentePage } from "../pages/ProximamentePage";
import { Layout } from "./Layout";
import { RutaPorRol, RutaProtegida } from "./guards";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <RutaProtegida />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <InicioPage /> },
          {
            element: <RutaPorRol roles={["cliente"]} />,
            children: [{ path: "/casos", element: <ProximamentePage titulo="Mis casos" /> }]
          },
          {
            element: <RutaPorRol roles={["empleado"]} />,
            children: [{ path: "/bandeja", element: <ProximamentePage titulo="Bandeja" /> }]
          },
          {
            element: <RutaPorRol roles={["jefatura"]} />,
            children: [{ path: "/dashboard", element: <ProximamentePage titulo="Dashboard" /> }]
          },
          {
            element: <RutaPorRol roles={["administrador"]} />,
            children: [
              { path: "/usuarios", element: <ProximamentePage titulo="Usuarios" /> },
              { path: "/terceros", element: <ProximamentePage titulo="Terceros" /> }
            ]
          }
        ]
      }
    ]
  }
]);
