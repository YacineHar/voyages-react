// Avec react router, il est possible de déplacer la logique de navigation dans un fichier dédié.
import { createBrowserRouter } from "react-router-dom"
// createBrowserRouter permet de créer un router selon les url du navigateur
import MainLayout from "../layouts/MainLayout"
import AboutPage from "../pages/AboutPage"
import DestinationDetailsPage from "../pages/DestinationDetailsPage"
import DestinationsPage from "../pages/DestinationsPage"
import HomePage from "../pages/HomePage"
import NotFoundPage from "../pages/NotFoundPage"
import SearchPage from "../pages/SearchPage"
import ContactPage from "../pages/ContactPage"
import RegionPage from "../pages/RegionPage"
import RegisterPage from "../pages/RegisterPage"
import LoginPage from "../pages/LoginPage"
import ProfilePage from "../pages/ProfilePage"
import AdminPage from "../pages/AdminPage"
import AdminHomePage from "../pages/admin/AdminHomePage"
import AdminContactsPage from "../pages/admin/AdminContactsPage"
import AdminUsersPage from "../pages/admin/AdminUsersPage"
import AdminDestinationsPage from "../pages/admin/AdminDestinationsPage"
import AdminDestinationCreatePage from "../pages/admin/AdminDestinationCreatePage"
import AdminCommentsPage from "../pages/admin/AdminCommentsPage"
import ProtectedRoute from "../components/ProtectedRoute"
import AdminRoute from "../components/AdminRoute"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        // Toutes les pages passent par MainLayout
        errorElement: <NotFoundPage/>,
        children: [
            {
                index: true,
                // c'est la page par défaut
                element: <HomePage/>
            },
            {
                path: "destinations",
                element: <DestinationsPage/>
            },
            {
                path: "destinations/:slug",
                element: <DestinationDetailsPage/>
            },
            {
                path: "search",
                element: <SearchPage/>
            },
            {
                path: "about",
                element: <AboutPage/>
            },
            {
                path: "contact",
                element: <ContactPage/>
            },
            {
                path: "region/:region",
                element: <RegionPage/>
            },
            {
                path: "register",
                element: <RegisterPage/>
            },
            {
                path: "login",
                element: <LoginPage/>
            },
            {
                path: "profile",
                element: <ProtectedRoute><ProfilePage/></ProtectedRoute>
            },
            {
                path: "admin",
                element: <AdminRoute><AdminPage/></AdminRoute>,
                children: [
                    {
                        index: true,
                        element: <AdminHomePage/>
                    },
                    {
                        path: "contacts",
                        element: <AdminContactsPage/>
                    },
                    {
                        path: "users",
                        element: <AdminUsersPage/>
                    },
                    {
                        path: "destinations",
                        element: <AdminDestinationsPage/>
                    },
                    {
                        path: "destinations/new",
                        element: <AdminDestinationCreatePage/>
                    },
                    {
                        path: "comments",
                        element: <AdminCommentsPage/>
                    }
                ]
            },
            {
                path: "*",
                element: <NotFoundPage/>
            }
        ]
    }
])

export default router
