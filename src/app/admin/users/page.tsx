'use client'

import React, { useEffect, useState } from "react";

interface User {
  id?: string | number;
  _id?: string | number;
  name: string;
  email: string;
  image?: string;
}

export default function UserListAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleNotify = (id: string | number) => {
    const _id = id;
  };

  const handleDelete = (id: string | number) => {
    const _id = id;
  };

  if (loading) {
    return <div className="text-zinc-400 p-6">Loading users...</div>;
  }

  return (
    <div className="space-y-4 p-6 bg-zinc-950 min-h-screen text-zinc-100">
      <h2 className="text-xl font-bold tracking-tight">User Management</h2>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <p className="p-6 text-zinc-500 text-sm">No users found in database.</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {users.map((user) => {
              const userId = user.id || user._id || "";
              const userImage = user?.image && typeof user.image === "string" && user.image.trim() !== "" 
                ? user.image 
                : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png";

              return (
                <div 
                  key={userId} 
                  className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img 
                      src={userImage} 
                      alt={user.name || "user"} 
                      className="w-12 h-12 object-cover rounded-full bg-zinc-800 shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-zinc-200 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleNotify(userId)}
                      className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(userId)}
                      className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}