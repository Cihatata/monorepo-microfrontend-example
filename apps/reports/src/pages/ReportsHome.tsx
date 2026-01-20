import { useAccount } from "platform/account";

export function ReportsHome() {
  const { data: account, isLoading } = useAccount();

  const reports = [
    {
      id: 1,
      name: "Weekly Traffic Report",
      type: "Traffic",
      date: "2025-01-05",
      status: "Completed",
    },
    {
      id: 2,
      name: "Monthly Performance Summary",
      type: "Performance",
      date: "2025-01-01",
      status: "Completed",
    },
    {
      id: 3,
      name: "User Behavior Analysis",
      type: "Analysis",
      date: "2025-01-03",
      status: "Processing",
    },
    {
      id: 4,
      name: "SEO Status Report",
      type: "SEO",
      date: "2025-01-04",
      status: "Pending",
    },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Reports
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
          View your detailed reports and create new ones.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 text-left hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <svg
            className="w-8 h-8 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <h3 className="font-semibold text-lg mb-1">New Report</h3>
          <p className="text-blue-100 text-sm">Create custom report</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-xl p-6 text-left hover:shadow-md transition-all">
          <svg
            className="w-8 h-8 mb-3 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <h3 className="font-semibold text-lg text-slate-800 mb-1">Export</h3>
          <p className="text-slate-500 text-sm">Download as PDF or Excel</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-xl p-6 text-left hover:shadow-md transition-all">
          <svg
            className="w-8 h-8 mb-3 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-semibold text-lg text-slate-800 mb-1">Schedule</h3>
          <p className="text-slate-500 text-sm">Set up automatic reports</p>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Reports
          </h2>
          <input
            type="text"
            placeholder="Search reports..."
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Report Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-800">
                    {report.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {report.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : report.status === "Processing"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sky-600 hover:text-sky-800 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
