'use client';

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import UpdateProfileForm from "@/components/UpdateProfile";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

/**
 * Renders the user profile page, displaying user information and providing options to update details,
 * change password, and log out.
 */
const Profile = () => {
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] = useState<boolean>(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false); // State for password form

  /**
   * Navigates the user back to the home page.
   */
  const handleBack = useCallback(() => {
    router.push('/home');
  }, [router]);

  /**
   * Handles the user logout process by sending a POST request to the logout API endpoint.
   * On successful logout, the user is redirected to the login page.
   */
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        router.refresh(); // Refreshes the current route to clear any cached data.
        router.push("/"); // Redirects to the login page.
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  /**
   * Fetches the authenticated user's information upon component mounting.
   * If the user is logged in, their name and email are set in the component's state.
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/status", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
        if (data.isLoggedIn) {
          setName(data.user.name);
          setEmail(data.user.email);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <Header title="Profile" onClick={handleBack} />

      <main className="p-6 flex-grow flex flex-col items-center gap-6">
        {/* User Profile Information Section */}
        <section className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-myred text-center">Details</h2>
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                readOnly
                className="border rounded px-4 py-3 w-full text-gray-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                value={email}
                readOnly
                className="border rounded px-4 py-3 w-full text-gray-700 bg-white"
              />
            </div>
          </div>
        </section>

        {/* Profile Actions Section */}
        <section className="flex flex-col gap-4 w-full max-w-md">
          <Button
            className="bg-myred text-white font-semibold py-8 text-md w-full rounded-xl hover:bg-red-700"
            onClick={() => setShowUpdateDetailsForm(true)}
          >
            Update Details
          </Button>

          <Button
            variant="outline"
            className="border-myred text-myred font-semibold py-8 text-md w-full rounded-xl hover:bg-red-50"
            onClick={() => setShowChangePasswordForm(true)}
          >
            Change Password
          </Button>
        </section>

        {/* Logout Button */}
        <section className="max-w-md w-full mt-auto mx-3">
          <Button
            className="bg-myred w-full py-8 rounded-full font-normal hover:bg-red-800 text-lg"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </section>
      </main>

      {/* Update Profile Form Modal */}
      {showUpdateDetailsForm && (
        <UpdateProfileForm
          onClose={() => setShowUpdateDetailsForm(false)}
          onUpdate={({ name: updatedName, email: updatedEmail }) => {
            setName(updatedName);
            setEmail(updatedEmail);
            console.log('Profile updated successfully:', { updatedName, updatedEmail });
            // Optionally, you might want to refresh the user data from the server here
          }}
        />
      )}

      {/* Change Password Form Modal */}
      {showChangePasswordForm && (
        <ChangePasswordForm
          onClose={() => setShowChangePasswordForm(false)}
          onChangePassword={({ currentPassword, newPassword }) => {
            console.log('Changing password with:', { currentPassword, newPassword });
            // Here you would typically send these passwords to your API for update
            // After successful update, you might want to show a success message or handle errors
          }}
        />
      )}
    </div>
  );
};

export default Profile;