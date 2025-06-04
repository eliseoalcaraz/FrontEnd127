'use client';

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import UpdateProfileForm from "@/components/UpdateProfile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Profile = () => {
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [updateDetails, setUpdateDetails] = useState<boolean>(false);

  const handleBack = () => {
    console.log("Back button clicked in Profile component!");
    router.push('/home');
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        router.refresh();
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/status", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (data.isLoggedIn) {
          setName(data.user.name);
          setEmail(data.user.email);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <Header title="Profile" onClick={handleBack} />

      <main className="p-6 flex-grow flex flex-col items-center gap-6">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-myred text-center">Your Profile</h2>
        <div className="flex flex-col gap-2 text-left">
          <p className="text-lg font-medium">Name: {name}</p>
          <p className="text-lg font-medium">Email: {email}</p>
        </div>
      </div>


        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            className="bg-myred text-white font-semibold py-5 w-full rounded-xl"
            onClick={() => setUpdateDetails(true)}
          >
            Update Details
          </Button>

          <Button
            variant="outline"
            className="border-myred text-myred font-semibold py-5 w-full rounded-xl"
            onClick={() => router.push("/profile/change-password")}
          >
            Change Password
          </Button>
        </div>

        <div className="max-w-md w-full mt-auto mx-3">
          <Button
            className="bg-myred w-full py-8 rounded-xl font-semibold hover:bg-red-800 text-lg"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </main>
      {updateDetails &&
      <UpdateProfileForm
        onClose={() => setUpdateDetails(false)}
        onUpdate={({ name, email }) => {
          console.log('Updated name:', name)
          console.log('Updated email:', email)
        }}
      />
      }
      {/* Logout Button at Bottom */}

    </div>
  );
};

export default Profile;
