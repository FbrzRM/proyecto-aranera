import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { CasoDetallePage } from "../features/casos/CasoDetallePage";
import { CasosPage } from "../features/casos/CasosPage";
import { CrearCasoPage } from "../features/casos/CrearCasoPage";
import { DashboardPage } from "../features/metricas/DashboardPage";
import { BandejaPage } from "../features/operacion/BandejaPage";
import { OperacionCasoPage } from "../features/operacion/OperacionCasoPage";
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
            children: [
              { path: "/casos", element: <CasosPage /> },
              { path: "/casos/nuevo", element: <CrearCasoPage /> },
              { path: "/casos/:id", element: <CasoDetallePage /> }
            ]
          },
          {
            element: <RutaPorRol roles={["empleado"]} />,
            children: [
              { path: "/bandeja", element: <BandejaPage /> },
              { path: "/bandeja/:id", element: <OperacionCasoPage /> }
            ]
          },
          {
            element: <RutaPorRol roles={["jefatura", "administrador"]} />,
            children: [{ path: "/dashboard", element: <DashboardPage /> }]
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
