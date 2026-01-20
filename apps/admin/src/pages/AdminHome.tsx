import { useAccount } from "platform/account";

export function AdminHome() {
  const { data: account, isLoading } = useAccount();

  const users = [
    { id: 1, name: "John Smith", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "Editor", status: "Active" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", role: "Viewer", status: "Inactive" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Editor", status: "Active" },
  ];

  const settings = [
    { icon: "🔐", label: "Security Settings", description: "Password policies and 2FA" },
    { icon: "📧", label: "Email Notifications", description: "Manage notification preferences" },
    { icon: "🔗", label: "API Keys", description: "Manage integration keys" },
    { icon: "📊", label: "Data Export", description: "Download your data" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Admin Panel
          </h1>
          {isLoading ? (
            <div className="w-32 h-6 bg-slate-200 animate-pulse rounded" />
          ) : (
            <span className="text-sm text-slate-500">
              Welcome, <span className="font-medium text-slate-700">{account?.name}</span>
            </span>
          )}
        </div>
        <p className="text-slate-600">
          Manage system settings and users from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-800">1,234</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Sessions 3211111</p>
              <p className="text-2xl font-bold text-slate-800">89</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">API Requests</p>
              <p className="text-2xl font-bold text-slate-800">45.2K</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Disk Usage</p>
              <p className="text-2xl font-bold text-slate-800">67%</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💾</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Users
            </h2>
            <button className="text-sm text-sky-600 hover:text-sky-800 font-medium">
              View All
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "Editor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Settings Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Quick Settings
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {settings.map((setting) => (
              <button
                key={setting.label}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-left hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                  {setting.icon}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{setting.label}</h3>
                  <p className="text-sm text-slate-500">{setting.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
