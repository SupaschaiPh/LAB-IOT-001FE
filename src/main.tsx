import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import axios from "axios";
import HomePage from "./pages";
import { Notifications } from "@mantine/notifications";
import BooksPage from "./pages/books";
import BookByIdPage from "./pages/book-by-id";
import BookEditById from "./pages/book-edit-by-id";
import { ModalsProvider } from "@mantine/modals";
import BookCreatePage from "./pages/book-create";
import MenuPage from "./pages/menu";
import MenuCreatePage from "./pages/menu-create";
import StaffPage from "./pages/staff";
import MenuEditById from "./pages/menu-edit-by-id";
import ReceiptPage from "./pages/receipt";
import StaffBookPage from "./pages/staff-books";
import StaffMenuPage from "./pages/staff-menus";
import StaffOrderPage from "./pages/staff-orders";
import StaffStudentPage from "./pages/staff-students";
import StudentCreatePage from "./pages/student-create";
import NotFoundPage from "./pages/404";

const theme = createTheme({
  primaryColor: "orange",
  fontFamily: '"Noto Sans Thai Looped", sans-serif',
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/books",
    element: <BooksPage />,
  },
  {
    path: "/books/create",
    element: <BookCreatePage />,
  },
  {
    path: "/books/:bookId",
    element: <BookByIdPage />,
  },
  {
    path: "/books/:bookId/edit",
    element: <BookEditById />,
  },
  {
    path: "/menu",
    element: <MenuPage />,
  },
  {
    path: "/menu/create",
    element: <MenuCreatePage />,
  },
  {
    path: "/menu/edit/:menuId",
    element: <MenuEditById />,
  },
  {
    path: "/receipt/:receiptId",
    element: <ReceiptPage />,
  },
  {
    path: "/staff",
    element: <StaffPage />,
  },
  {
    path: "/staff/books",
    element: <StaffBookPage />,
  },
  {
    path: "/staff/menus",
    element: <StaffMenuPage />,
  },
  {
    path: "/staff/students",
    element: <StaffStudentPage />,
  },
  {
    path: "/staff/orders",
    element: <StaffOrderPage />,
  },
  {
    path: "/students/create",
    element: <StudentCreatePage />,
  },{
    path:"*",
    element:<NotFoundPage/>
  }
]);

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          axios
            .get(url, {
              baseURL:
                import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
            })
            .then((res) => res.data),
      }}
    >
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ModalsProvider>
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </SWRConfig>
  </React.StrictMode>,
);
