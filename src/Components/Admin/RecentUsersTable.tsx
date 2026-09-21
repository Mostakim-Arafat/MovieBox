import React, { useState, useMemo } from "react";
import Link from "next/link";
import Pagination from "@/UI/Pagination";

type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  avater?: string;
  image?: string;
  plan?: string;
  joinDate?: string;
};

const planStyles: Record<string, string> = {
  Free: "bg-zinc-800 text-zinc-300 border-zinc-700",
  Premium: "bg-rose-600/10 text-rose-400 border-rose-500/20",
  Pro: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function RecentUsersTable({ users }: { users: User[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil((users?.length || 0) / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-zinc-100">Recent Users</h3>
            <p className="text-sm text-zinc-500 mt-0.5">Latest signups</p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-3 pr-4">User</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">Plan</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-zinc-500 text-xs">
                    No recent users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => {
                  const plan = user.plan || "Free";
                  const avatar = user.avater || user.image;
                  const initial = (user.name || "U")[0].toUpperCase();

                  return (
                    <tr key={user.email || user.id || idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {avatar && avatar.startsWith("http") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0 border border-zinc-700">
                              {initial}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-200 truncate max-w-[140px] sm:max-w-xs">{user.name}</p>
                            <p className="text-xs text-zinc-500 truncate max-w-[140px] sm:max-w-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${planStyles[plan] || planStyles.Free}`}>
                          {plan}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-zinc-400 whitespace-nowrap">
                        {user.joinDate || "Recently"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 border-t border-zinc-800/60 pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            totalItems={users.length}
            pageSize={pageSize}
            showSummary={true}
            itemName="users"
          />
        </div>
      )}
    </div>
  );
}