import React from "react";

interface User {
  name: string;
  email: string;
  plan: "Free" | "Premium" | "Pro";
  joinDate: string;
  avatar: string;
}

const recentUsers: User[] = [
  { name: "Sarah Johnson", email: "sarah.j@email.com", plan: "Premium", joinDate: "Sep 2, 2026", avatar: "SJ" },
  { name: "Alex Rivera", email: "alex.r@email.com", plan: "Pro", joinDate: "Sep 1, 2026", avatar: "AR" },
  { name: "Mike Chen", email: "mike.c@email.com", plan: "Free", joinDate: "Aug 31, 2026", avatar: "MC" },
  { name: "Emily Davis", email: "emily.d@email.com", plan: "Premium", joinDate: "Aug 30, 2026", avatar: "ED" },
  { name: "James Wilson", email: "james.w@email.com", plan: "Free", joinDate: "Aug 29, 2026", avatar: "JW" },
  { name: "Priya Patel", email: "priya.p@email.com", plan: "Premium", joinDate: "Aug 28, 2026", avatar: "PP" },
];

const planStyles: Record<string, string> = {
  Free: "bg-zinc-800 text-zinc-300 border-zinc-700",
  Premium: "bg-rose-600/10 text-rose-400 border-rose-500/20",
  Pro: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function RecentUsersTable() {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-100">Recent Users</h3>
          <p className="text-sm text-zinc-500 mt-0.5">Latest signups</p>
        </div>
        <button className="text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors cursor-pointer">
          View All →
        </button>
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
            {recentUsers.map((user) => (
              <tr key={user.email} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0 border border-zinc-700">
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-200 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 hidden sm:table-cell">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${planStyles[user.plan]}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="py-3 text-xs text-zinc-400 whitespace-nowrap">{user.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}