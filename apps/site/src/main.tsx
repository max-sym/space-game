import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "./pages"
import "./styles/index.scss"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const router = createBrowserRouter(routes)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
