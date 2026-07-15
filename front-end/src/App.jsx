import "./App.scss";
import { Main } from "./features/main/components/Main/Main";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/Login/components/Login/Login";
import { RealEstatePage } from "./features/realEstatePage/components/realEstatePage/realEstatePage";
import { RegisterUser } from "./features/Auth/Register/components/Register/Register";
import { Header } from "./shared/components/Header/Header";
import Auth from "./features/Auth/components/Auth/Auth";
import { RegisterCompany } from "./features/Auth/RegisterCompany/components/RegisterCompany/RegisterCompany";
import { Layout } from "./features/Layout/components/Layout/Layout";
import { User } from "./features/User/components/User/User";
import { useAuth } from "./AuthStore";
import { preLoadUser, UserProfile } from "./features/User/components/UserProfile/UserProfile";
import { preload } from "react-dom";
import { RealEstateWrapper } from "./features/realEstatePage/RealEstateWrapper";
import {AddRealEstate} from './features/realEstatePage/components/addRealEstate/addRealEstate'
import {EditRealEstate} from './features/realEstatePage/components/editRealEstate/editRealEstate'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      { path: "/realestate/:id", element: <RealEstatePage /> },

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
        ],
      },
      {
        path: "user",
        element: <User />,
        children: [
          {
            path: "profile",
            loader: async () =>{
              let user = localStorage.getItem("user");
              user = JSON.parse(user);
              console.log("user", user)
              return preLoadUser(user);

              
            },
            element: <UserProfile />,
          },
        ],
      },
      {       path: "apartment",
        element: <RealEstateWrapper />,
      children:[
        {
          path: "add",
          element: <AddRealEstate />,
        },
        {
          path: "edit/:id",
          element: <EditRealEstate />,
        }
      ]}
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
