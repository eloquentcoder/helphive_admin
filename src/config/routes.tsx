import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../domains/auth/login/pages/LoginPage";
import { ForgotPasswordPage } from "../domains/auth/forgot-pass/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../domains/auth/forgot-pass/pages/ResetPasswordPage";
import { AdminLayout } from "../shared/layouts/AdminLayout";
import { DashboardPage } from "../domains/portal/dashboard/pages/DashboardPage";
import { UserManagementPage } from "../domains/portal/users/pages/UserManagementPage";
import { JobManagementPage } from "../domains/portal/jobs/pages/JobManagementPage";
import { ContractManagementPage } from "../domains/portal/contracts/pages/ContractManagementPage";
import { ApplicationManagementPage } from "../domains/portal/applications/pages/ApplicationManagementPage";
import { ConversationManagementPage } from "../domains/portal/conversations/pages/ConversationManagementPage";  
import { JobCategoryManagementPage } from "../domains/portal/job-categories/pages/JobCategoryManagementPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <UserManagementPage />,
      },
      {
        path: "users/pending",
        element: <UserManagementPage />,
      },
      {
        path: "users/banned",
        element: <UserManagementPage />,
      },
      {
        path: "users/seekers",
        element: <UserManagementPage />,
      },
      {
        path: "users/helpers",
        element: <UserManagementPage />,
      },
      {
        path: "jobs",
        element: <JobManagementPage />,
      },
      {
        path: "jobs/pending",
        element: <JobManagementPage />,
      },
      {
        path: "jobs/active",
        element: <JobManagementPage />,
      },
      {
        path: "jobs/paused",
        element: <JobManagementPage />,
      },
      {
        path: "jobs/expired",
        element: <JobManagementPage />,
      },
      {
        path: "jobs/applications",
        element: <ApplicationManagementPage />,
      },
      {
        path: "jobs/contracts",
        element: <ContractManagementPage />,
      },
      {
        path: "contracts",
        element: <ContractManagementPage />,
      },
      {
        path: "contracts/pending",
        element: <ContractManagementPage />,
      },
      {
        path: "contracts/active",
        element: <ContractManagementPage />,
      },
      {
        path: "contracts/completed",
        element: <ContractManagementPage />,
      },
      {
        path: "contracts/disputed",
        element: <ContractManagementPage />,
      },
      {
        path: "contracts/overdue",
        element: <ContractManagementPage />,
      },
      {
        path: "conversations",
        element: <ConversationManagementPage />,
      },
      {
        path: "conversations/unread",
        element: <ConversationManagementPage />,
      },
      {
        path: "conversations/active",
        element: <ConversationManagementPage />,
      },
      {
        path: "conversations/closed",
        element: <ConversationManagementPage />,
      },
      {
        path: "conversations/archived",
        element: <ConversationManagementPage />,
      },
      {
        path: "conversations/application",
        element: <ConversationManagementPage />,
      },
      {
        path: "conversations/contract",
        element: <ConversationManagementPage />,
      },
      {
        path: "conversations/support",
        element: <ConversationManagementPage />,
      },
      {
        path: "job-categories",
        element: <JobCategoryManagementPage />,
      },
      {
        path: "job-categories/parents",
        element: <JobCategoryManagementPage />,
      },
      {
        path: "job-categories/subcategories",
        element: <JobCategoryManagementPage />,
      },
      {
        path: "job-categories/active",
        element: <JobCategoryManagementPage />,
      },
      {
        path: "job-categories/inactive",
        element: <JobCategoryManagementPage />,
      },
      {
        path: "payments/*",
        element: <div>Payments Management - Coming Soon</div>,
      },
      {
        path: "analytics",
        element: <div>Analytics - Coming Soon</div>,
      },
      {
        path: "settings/*",
        element: <div>Settings - Coming Soon</div>,
      },
    ],
  },
]);
