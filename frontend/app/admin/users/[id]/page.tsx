"use client";

import { useState, useEffect } from "react";
import { getUserById } from "@/lib/api/admin";
import Link from "next/link";
import { use } from "react";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [resolvedParams.id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUserById(resolvedParams.id);
      setUser(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Details</h1>
        <div className="space-x-2">
          <Link
            href={`/admin/users/${resolvedParams.id}/edit`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Edit User
          </Link>
          <Link
            href="/admin/users"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="text-2xl font-semibold mb-4">ID: {resolvedParams.id}</div>
        
        {user && (
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Username:</span> {user.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-semibold">First Name:</span> {user.firstName || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Last Name:</span> {user.lastName || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Role:</span>{' '}
              <span className={`px-2 py-1 rounded text-sm ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                {user.role}
              </span>
            </div>
            {user.imageUrl && (
              <div>
                <span className="font-semibold">Profile Image:</span>
                <img src={user.imageUrl} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded" />
              </div>
            )}
            <div>
              <span className="font-semibold">Created At:</span> {new Date(user.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Updated At:</span> {new Date(user.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
