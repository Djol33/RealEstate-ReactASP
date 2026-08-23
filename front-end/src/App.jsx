import "./App.scss";
import { Main } from "./features/main/components/Main/Main";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/Login/Login";
import ForgotPassword from "./features/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./features/Auth/ResetPassword/ResetPassword";
import { RealEstatePage } from "./features/realEstatePage/components/realEstatePage/realEstatePage";
import { RegisterUser } from "./features/Auth/Register/Register";
import { Header } from "./shared/components/Header/Header";
import Auth from "./features/Auth/AuthLayout/Auth";
import { RegisterCompany } from "./features/Auth/RegisterCompany/RegisterCompany";
import { Layout } from "./features/Layout/Layout";
import { User } from "./features/User/components/User/User";
import { useAuth } from "./AuthStore";
import { UserProfile } from "./features/User/components/UserProfile/UserProfile";
import { preload } from "react-dom";
import { RealEstateWrapper } from "./features/realEstatePage/RealEstateWrapper";
import {AddRealEstate} from './features/realEstatePage/components/addRealEstate/addRealEstate'
import {EditRealEstate} from './features/realEstatePage/components/editRealEstate/editRealEstate'
import { Messages } from './features/chat/components/Messages/Messages'
import { AdminGuard } from './features/admin/components/AdminGuard/AdminGuard'
import { RequireAuth } from './shared/components/RequireAuth'
import { AdminLayout } from './features/admin/components/AdminLayout/AdminLayout'
import { AdminDashboard } from './features/admin/components/AdminDashboard/AdminDashboard'
import { AdminUsers } from './features/admin/components/AdminUsers/AdminUsers'
import { AdminRealEstates } from './features/admin/components/AdminRealEstates/AdminRealEstates'
import { AdminHeroBanner } from './features/admin/components/AdminHeroBanner/AdminHeroBanner'
import { AdminReports } from './features/admin/components/AdminReports/AdminReports'
import { AdminAmenities } from './features/admin/components/AdminAmenities/AdminAmenities'
import { AdminContactMessages } from './features/admin/components/AdminContactMessages/AdminContactMessages'
import { AdminContactReasons } from './features/admin/components/AdminContactReasons/AdminContactReasons'
import { NotFound } from './features/NotFound/NotFound'
import { Contact } from './features/Contact/Contact'

const router = createBrowserRouter([
    {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      { path: "/realestate/:id", element: <RealEstatePage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "/messages", element: <Messages /> },
          { path: "/messages/:userId", element: <Messages /> },
        ],
      },
      { path: "/contact", element: <Contact /> },
      {
        path: "admin",
        element: <AdminGuard />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "", element: <AdminDashboard /> },
              { path: "users", element: <AdminUsers /> },
              { path: "realestates", element: <AdminRealEstates /> },
              { path: "hero-banner", element: <AdminHeroBanner /> },
              { path: "reports", element: <AdminReports /> },
              { path: "amenities", element: <AdminAmenities /> },
              { path: "contact-messages", element: <AdminContactMessages /> },
              { path: "contact-reasons", element: <AdminContactReasons /> },
            ],
          },
        ],
      },

      {
        path: "auth",
        element: <Auth />,

        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "registerUser",
            element: <RegisterUser />,
          },
          {
            path: "registerCompany",
            element: <RegisterCompany />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
        ],
      },
      {
        path: "user",
        element: <User />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              {
                path: "profile",
                element: <UserProfile />,
              },
            ],
          },
          {
            path: ":id",
            element: <UserProfile />,
          },
        ],
      },
      {
        path: "realestate",
        element: <RealEstateWrapper />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              {
                path: "new",
                element: <AddRealEstate />,
              },
              {
                path: ":id/edit",
                element: <EditRealEstate />,
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
