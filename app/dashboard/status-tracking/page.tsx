"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";

const statuses = ["PENDING", "IN_PROGRESS", "WAITING_PARTS", "WAITING_CONFIRM", "COMPLETED"];

function StatusBadge({ s }) {
  const map = {
    PENDING: "bg-gray-500",
    IN_PROGRESS: "bg-blue-500",
    WAITING_PARTS: "bg-purple-500",
    WAITING_CONFIRM: "bg-orange-500",
    COMPLETED: "bg-green-600",
  };
  return <span className={`px-2 py-1 rounded-full text-white text-xs ${map[s] || "bg-gray-400"}`}>{s.replace("_"," ")}</span>;
}

export default function StatusTrackingPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const canUpdate = role === "SHOP" || role === "TECHNICIAN" || role === "ADMIN";

  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ q: "", status: "" });

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch("/api/repairs")
      .then((r) => r.json())
      .then((json) => setRows(json))
      .finally(() => setLoading(false));
  }, [session]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const hitQ = [r.serialNumber, r.printerModel, r.customer?.name].some((v) => (v || "").toLowerCase().includes(filters.q.toLowerCase()));
      const hitS = filters.status ? r.status === filters.status : true;
      return hitQ && hitS;
    });
  }, [rows, filters]);

  const updateRowStatus = async (id, status) => {
    if (!canUpdate) return;
    await fetch(`/api/repairs/${id}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>กรุณาล็อกอิน</p>;

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ติดตามสถานะ</h1>
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded border ${view === "table" ? "bg-blue-600 text-white" : ""}`} onClick={() => setView("table")}>Table</button>
            <button className={`px-3 py-1 rounded border ${view === "kanban" ? "bg-blue-600 text-white" : ""}`} onClick={() => setView("kanban")}>Kanban</button>
          </div>
        </div>

        <div className="bg-white p-3 rounded shadow flex flex-wrap gap-3 items-center">
          <input className="border px-3 py-2 rounded w-64" placeholder="ค้นหา Serial/รุ่น/ลูกค้า" value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
          <select className="border px-3 py-2 rounded" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
            <option value="">ทุกสถานะ</option>
            {statuses.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
          </select>
          {filters.q || filters.status ? (
            <button className="px-3 py-2 border rounded" onClick={() => setFilters({ q: "", status: "" })}>ล้างตัวกรอง</button>
          ) : null}
        </div>

        {view === "table" && (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border text-left">Serial</th>
                  <th className="p-2 border text-left">รุ่น</th>
                  <th className="p-2 border text-left">ลูกค้า</th>
                  <th className="p-2 border text-left">ร้าน</th>
                  <th className="p-2 border text-left">สถานะ</th>
                  <th className="p-2 border text-left">วันที่แจ้ง</th>
                  <th className="p-2 border text-left">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr key={r.id} className={`odd:bg-white even:bg-gray-50`}>
                    <td className="p-2 border">{r.serialNumber}</td>
                    <td className="p-2 border">{r.printerModel}</td>
                    <td className="p-2 border">{r.customer?.name || "-"}</td>
                    <td className="p-2 border">{r.shop?.name || "-"}</td>
                    <td className="p-2 border">
                      {canUpdate ? (
                        <select className="border px-2 py-1 rounded" value={r.status} onChange={(e) => updateRowStatus(r.id, e.target.value)}>
                          {statuses.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                        </select>
                      ) : (
                        <StatusBadge s={r.status} />
                      )}
                    </td>
                    <td className="p-2 border">{new Date(r.requestDate).toLocaleDateString()}</td>
                    <td className="p-2 border text-sm text-gray-600">{r.remark || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {statuses.map((col) => (
              <div key={col} className="bg-white rounded shadow p-3 min-h-64">
                <div className="font-semibold mb-2 flex items-center justify-between">
                  <span>{col.replace("_"," ")}</span>
                  <span className="text-xs text-gray-500">{filtered.filter((r) => r.status === col).length}</span>
                </div>
                <div className="space-y-2">
                  {filtered.filter((r) => r.status === col).map((r) => (
                    <div key={r.id} className="border rounded p-2">
                      <div className="font-medium">{r.serialNumber}</div>
                      <div className="text-xs text-gray-600">{r.printerModel} · {r.customer?.name || "-"}</div>
                      {canUpdate && (
                        <div className="mt-2">
                          <select className="border px-2 py-1 rounded w-full" value={r.status} onChange={(e) => updateRowStatus(r.id, e.target.value)}>
                            {statuses.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
