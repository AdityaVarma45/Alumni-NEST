import { Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileGuard from "../components/ProfileGuard";

import DashboardHome from "../pages/DashboardHome";
import Notifications from "../pages/Notifications";
import Chats from "../pages/Chats";
import ChatPage from "../pages/ChatPage";
import Users from "../pages/Users";
import MentorshipRequests from "../pages/MentorshipRequests";
import MentorshipOffers from "../pages/MentorshipOffers";
import ProfileSetup from "../pages/ProfileSetup";
import UserProfile from "../pages/UserProfile";
import BlockedUsers from "../pages/BlockedUsers";
import Opportunities from "../pages/Opportunities";
import CreateOpportunity from "../pages/CreateOpportunity";
import MyProfile from "../pages/MyProfile";

export default function DashboardRoutes() {
  return (
    <>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="profile-setup" element={<ProfileSetup />} />

        <Route
          index
          element={
            <ProfileGuard>
              <DashboardHome />
            </ProfileGuard>
          }
        />

        <Route
          path="notifications"
          element={
            <ProfileGuard>
              <Notifications />
            </ProfileGuard>
          }
        />

        <Route
          path="chats"
          element={
            <ProfileGuard>
              <Chats />
            </ProfileGuard>
          }
        />

        <Route
          path="chat/:conversationId"
          element={
            <ProfileGuard>
              <ChatPage />
            </ProfileGuard>
          }
        />

        <Route
          path="users"
          element={
            <ProfileGuard>
              <Users />
            </ProfileGuard>
          }
        />

        <Route
          path="users/:id"
          element={
            <ProfileGuard>
              <UserProfile />
            </ProfileGuard>
          }
        />

        <Route
          path="my-profile"
          element={
            <ProfileGuard>
              <MyProfile />
            </ProfileGuard>
          }
        />

        <Route
          path="blocked-users"
          element={
            <ProfileGuard>
              <BlockedUsers />
            </ProfileGuard>
          }
        />

        <Route
          path="mentorship"
          element={
            <ProfileGuard>
              <MentorshipRequests />
            </ProfileGuard>
          }
        />

        <Route
          path="mentorship-offers"
          element={
            <ProfileGuard>
              <MentorshipOffers />
            </ProfileGuard>
          }
        />

        <Route
          path="opportunities"
          element={
            <ProfileGuard>
              <Opportunities />
            </ProfileGuard>
          }
        />

        <Route
          path="opportunities/create"
          element={
            <ProfileGuard>
              <CreateOpportunity />
            </ProfileGuard>
          }
        />
      </Route>
    </>
  );
}