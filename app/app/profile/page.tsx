import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Profile
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold">Name: {user.name}</h3>
        <p className="text-gray-700">Email: {user.email}</p>
        {/* Add more user details as needed */}
      </div>
    </div>
  );
};

export default ProfilePage;