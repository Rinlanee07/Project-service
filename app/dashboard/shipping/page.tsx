"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";

export default function ShippingPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const canEdit = role === "SHOP" || role === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch("/api/repairs")
      .then((r) => r.json())
      .then((json) => setRows(json))
      .finally(() => setLoading(false));
  }, [session]);

  const startEdit = (r) => {
    setEditing({
      id: r.id,
      company: r.shipping?.company || "",
      trackingNumber: r.shipping?.trackingNumber || "",
      sentDate: r.shipping?.sentDate ? r.shipping.sentDate.slice(0, 10) : "",
      status: r.shipping?.status || "",
    });
  };

  const save = async () => {
    if (!editing) return;
    const { id, ...payload } = editing;
    await fetch(`/api/repairs/${id}/shipping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, shipping: { ...payload } } : r)));
    setEditing(null);
  };

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>กรุณาล็อกอิน</p>;

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">การจัดส่ง</h1>

        <div className="overflow-x-auto border rounded">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border text-left">Serial</th>
                <th className="p-2 border text-left">ลูกค้า</th>
                <th className="p-2 border text-left">บริษัทขนส่ง</th>
                <th className="p-2 border text-left">เลขพัสดุ</th>
                <th className="p-2 border text-left">วันที่ส่งออก</th>
                <th className="p-2 border text-left">สถานะ</th>
                <th className="p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{r.serialNumber}</td>
                  <td className="p-2 border">{r.customer?.name || "-"}</td>
                  <td className="p-2 border">{r.shipping?.company || "-"}</td>
                  <td className="p-2 border">{r.shipping?.trackingNumber || "-"}</td>
                  <td className="p-2 border">{r.shipping?.sentDate ? new Date(r.shipping.sentDate).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border">{r.shipping?.status || "-"}</td>
                  <td className="p-2 border">
                    {canEdit ? (
                      <button className="px-3 py-1 rounded border" onClick={() => startEdit(r)}>Update</button>
                    ) : (
                      r.shipping?.trackingNumber ? (
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(r.shipping.trackingNumber)}`} target="_blank" className="text-blue-600 underline">Track</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && canEdit && (
          <div className="bg-white p-4 rounded shadow space-y-3 max-w-xl">
            <h2 className="font-semibold">อัพเดตการจัดส่ง</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">บริษัทขนส่ง</label>
                <input className="border px-3 py-2 rounded w-full" value={editing.company} onChange={(e) => setEditing((v) => ({ ...v, company: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">เลขพัสดุ</label>
                <input className="border px-3 py-2 rounded w-full" value={editing.trackingNumber} onChange={(e) => setEditing((v) => ({ ...v, trackingNumber: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">วันที่ส่งออก</label>
                <input type="date" className="border px-3 py-2 rounded w-full" value={editing.sentDate} onChange={(e) => setEditing((v) => ({ ...v, sentDate: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">สถานะการจัดส่ง</label>
                <input className="border px-3 py-2 rounded w-full" value={editing.status} onChange={(e) => setEditing((v) => ({ ...v, status: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2 border rounded" onClick={() => setEditing(null)}>ยกเลิก</button>
              <button className="px-3 py-2 rounded text-white bg-blue-600" onClick={save}>บันทึก</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
