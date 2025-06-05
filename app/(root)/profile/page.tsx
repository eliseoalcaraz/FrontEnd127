"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import UpdateProfileForm from "@/components/UpdateProfile"; // Assuming this component exists
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { toast } from "sonner";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component

// Define a simple modal for password confirmation for deletion
// In a real app, this would likely be a separate component file (e.g., components/DeleteUserForm.tsx)
interface DeleteUserFormProps {
  onClose: () => void;
  onDeleteConfirm: (passwordConfirmation: string) => Promise<void>;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  onClose,
  onDeleteConfirm,
}) => {
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    await onDeleteConfirm(passwordConfirmation);
    setIsDeleting(false);
    onClose(); // Close the modal after the attempt, regardless of success/fail
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
        <p className="mb-4 text-gray-700">
          This action cannot be undone. Please enter your password to confirm.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="mb-4 w-full border border-gray-300 rounded-md p-2"
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isDeleting}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Renders the user profile page, displaying user information and providing options to update details,
 * delete account, and log out.
 */
const Profile = () => {
  const router = useRouter();
  // Removed 'fetchAuthStatus' from destructuring as per user feedback
  const { user, logout, isLoggedIn, loading: authLoading } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] =
    useState<boolean>(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState<boolean>(false);

  // Set initial name and email from auth context user data
  useEffect(() => {
    if (!authLoading && user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [authLoading, user]);

  // Redirect if not logged in after auth check completes
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/sign-in"); // Redirect to login if not logged in
    }
  }, [authLoading, isLoggedIn, router]);

  /**
   * Handles the update of user details (name and email).
   * This function will be passed to the UpdateProfileForm.
   */
  const handleUpdateDetails = useCallback(
    async ({
      name: updatedName,
      email: updatedEmail,
    }: {
      name: string;
      email: string;
    }) => {
      if (!user?.id) {
        toast.error("User ID not available for update.");
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: updatedName, email: updatedEmail }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Profile updated successfully!");
          setName(updatedName); // Update local state
          setEmail(updatedEmail); // Update local state
          // Since 'fetchAuthStatus' is not available, we can trigger a refresh
          // or rely on AuthContext to update its user state on its own.
          // For immediate UI consistency in other parts of the app that rely on AuthContext.user,
          // you might consider router.refresh() here or implement a way to update AuthContext's user state.
          // For now, only local state in this component is updated.
        } else {
          toast.error(
            data.error || data.message || "Failed to update profile.",
          );
          console.error("Profile update error:", data);
        }
      } catch (error) {
        console.error("Network error during profile update:", error);
        toast.error("Network error during profile update.");
      }
    },
    [user],
  ); // Removed fetchAuthStatus from dependencies

  /**
   * Handles the deletion of the user account.
   * This function will be passed to the DeleteUserForm.
   */
  const handleDeleteUser = useCallback(
    async (passwordConfirmation: string) => {
      if (!user?.id) {
        toast.error("User ID not available for deletion.");
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password_confirmation: passwordConfirmation }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Account deleted successfully!");
          logout(); // Log out the user from AuthContext
          router.push("/sign-in"); // Redirect to login page
        } else {
          toast.error(
            data.error || data.message || "Failed to delete account.",
          );
          console.error("Account deletion error:", data);
        }
      } catch (error) {
        console.error("Network error during account deletion:", error);
        toast.error("Network error during account deletion.");
      }
    },
    [user, logout, router],
  );

  /**
   * Handles the user logout process.
   */
  const handleLogout = useCallback(async () => {
    try {
      logout(); // Use logout from AuthContext
      toast.success("Logged out successfully!");
      router.push("/sign-in"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    }
  }, [logout, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full pt-10 mx-2">
      <Header title="Profile" onClick={() => router.back()} />

      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 gap-6">
        {/* Profile Info */}
        <section className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
            {name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600">{email}</p>
        </section>

        {/* Action Buttons */}
        <section className="w-full max-w-md flex flex-col gap-4 px-3">
          <Button
            className="bg-myred w-full py-8 rounded-full font-normal hover:bg-red-800 text-lg"
            onClick={() => setShowUpdateDetailsForm(true)}
          >
            Update Details
          </Button>

          <Button
            className="bg-red-500 w-full py-8 rounded-full font-normal hover:bg-red-600 text-lg"
            onClick={() => setShowDeleteUserForm(true)}
          >
            Delete User
          </Button>
        </section>

        {/* Logout Button */}
        <section className="max-w-md w-full mt-auto mx-3">
          <Button
            className="bg-gray-400 w-full py-8 rounded-full font-normal hover:bg-gray-500 text-lg"
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
          onUpdate={handleUpdateDetails}
          // Removed initialName and initialEmail props as per user feedback
          // If UpdateProfileForm needs to display current user data, it should fetch it internally
          // or rely on its own state management.
        />
      )}

      {/* Delete User Form Modal */}
      {showDeleteUserForm && (
        <DeleteUserForm
          onClose={() => setShowDeleteUserForm(false)}
          onDeleteConfirm={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default Profile;

