"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";

const StatusPill = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
    status === "PENDING" ? "bg-yellow-500" :
    status === "IN_PROGRESS" ? "bg-blue-500" :
    status === "WAITING_PARTS" ? "bg-purple-500" :
    status === "WAITING_CONFIRM" ? "bg-orange-500" :
    status === "COMPLETED" ? "bg-green-600" :
    status === "SHIPPED" ? "bg-indigo-600" :
    status === "CLOSED" ? "bg-gray-700" : "bg-gray-400"
  }`}>{status.replace("_"," ")}</span>
);

export default function RepairDetailsPage() {
  const { data: session, status: sstatus } = useSession();
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [loading, setLoading] = useState(true);
  const [repair, setRepair] = useState(null);
  const [activeTab, setActiveTab] = useState("parts");
  const [parts, setParts] = useState([]);
  const [images, setImages] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({ status: "", remark: "", notify: true });
  const [saving, setSaving] = useState(false);

  const role = session?.user?.role;
  const canEdit = role === "SHOP" || role === "TECHNICIAN" || role === "ADMIN";
  const isMember = role === "MEMBER";

  useEffect(() => {
    if (!id || !session) return;
    setLoading(true);
    fetch(`/api/repairs/${id}`)
      .then((r) => r.json())
      .then((json) => {
        setRepair(json);
        setParts(json.details?.parts || []);
        setImages(json.images || []);
        setStatusUpdate((v) => ({ ...v, status: json.status }));
      })
      .finally(() => setLoading(false));
  }, [id, session]);

  const total = useMemo(() => {
    return parts.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 1), 0);
  }, [parts]);

  const handleAddPart = () => setParts((ps) => [...ps, { id: Date.now(), partName: "", price: 0, quantity: 1 }]);
  const handlePartChange = (idx, key, val) => {
    setParts((ps) => ps.map((p, i) => i === idx ? { ...p, [key]: key === "price" || key === "quantity" ? Number(val) : val } : p));
  };
  const handleRemovePart = (idx) => setParts((ps) => ps.filter((_, i) => i !== idx));

  const handleImageUpload = (files) => {
    const selected = Array.from(files || []);
    const valid = selected.filter((f) => /^image\//.test(f.type) && f.size <= 5 * 1024 * 1024).slice(0, 5);
    setImages((prev) => [...prev, ...valid]);
  };

  const saveDetails = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/repairs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parts }),
      });
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      alert("บันทึกสำเร็จ");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/repairs/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusUpdate),
      });
      if (!res.ok) throw new Error("อัพเดตสถานะไม่สำเร็จ");
      const updated = await res.json();
      setRepair((r) => ({ ...r, status: updated.status }));
      alert("อัพเดตสถานะสำเร็จ");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const notifyCustomer = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      alert("ส่งการแจ้งเตือนแล้ว (mock)");
    } finally {
      setSaving(false);
    }
  };

  if (sstatus === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>กรุณาล็อกอิน</p>;
  if (!repair) return (
    <DashboardLayout user={session.user}>
      <div className="max-w-5xl mx-auto">ไม่พบงานซ่อม</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout user={session.user}>
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{repair.serialNumber} − {repair.printerModel}</h1>
            <p className="text-sm text-gray-600">ลูกค้า: {repair.customer?.name || "-"} · วันที่แจ้ง: {new Date(repair.requestDate).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={repair.status} />
            {canEdit && <button onClick={saveDetails} disabled={saving || isMember} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Save</button>}
            {role === "ADMIN" && <button className="px-3 py-2 border rounded" onClick={() => router.push(`/dashboard/close-repair?id=${repair.id}`)}>Close Job</button>}
          </div>
        </div>

        <div className="bg-white rounded shadow">
          <div className="border-b px-4">
            <nav className="flex gap-4">
              {[
                { key: "parts", label: "อะไหล่ & ราคา" },
                { key: "images", label: "รูปภาพเพิ่มเติม" },
                { key: "status", label: "สถานะงานซ่อม" },
                { key: "notify", label: "แจ้งลูกค้า" },
              ].map((t) => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`py-3 border-b-2 ${activeTab === t.key ? "border-blue-600 font-semibold" : "border-transparent text-gray-600"}`}>
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4">
            {activeTab === "parts" && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 border text-left">รายการ</th>
                        <th className="p-2 border text-left">จำนวน</th>
                        <th className="p-2 border text-left">ราคา/หน่วย</th>
                        <th className="p-2 border text-left">รวม</th>
                        {canEdit && <th className="p-2 border">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((p, idx) => (
                        <tr key={p.id || idx} className="odd:bg-white even:bg-gray-50">
                          <td className="p-2 border">
                            {isMember ? (
                              <span>{p.partName}</span>
                            ) : (
                              <input className="border px-2 py-1 rounded w-full" value={p.partName} onChange={(e) => handlePartChange(idx, "partName", e.target.value)} />
                            )}
                          </td>
                          <td className="p-2 border">
                            {isMember ? (
                              <span>{p.quantity}</span>
                            ) : (
                              <input type="number" min={1} className="border px-2 py-1 rounded w-24" value={p.quantity} onChange={(e) => handlePartChange(idx, "quantity", e.target.value)} />
                            )}
                          </td>
                          <td className="p-2 border">
                            {isMember ? (
                              <span>{p.price}</span>
                            ) : (
                              <input type="number" step="0.01" className="border px-2 py-1 rounded w-32" value={p.price} onChange={(e) => handlePartChange(idx, "price", e.target.value)} />
                            )}
                          </td>
                          <td className="p-2 border font-semibold">{(Number(p.price) * Number(p.quantity)).toFixed(2)}</td>
                          {canEdit && (
                            <td className="p-2 border text-center">
                              <button className="px-2 py-1 border rounded" onClick={() => handleRemovePart(idx)}>ลบ</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {canEdit && (
                  <div className="flex items-center justify-between">
                    <button className="px-3 py-2 border rounded" onClick={handleAddPart}>เพิ่มรายการ</button>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">รวม</div>
                        <div className="text-xl font-bold">฿ {total.toFixed(2)}</div>
                      </div>
                      <button className="px-3 py-2 bg-amber-600 text-white rounded" onClick={notifyCustomer}>ขออนุมัติราคา</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "images" && (
              <div className="space-y-3">
                {!isMember && (
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} />
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="border rounded p-2">
                      <img src={img.url || URL.createObjectURL(img)} alt={`img-${idx}`} className="w-full h-28 object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "status" && (
              <div className="space-y-3">
                {isMember ? (
                  <div className="text-gray-700">สถานะปัจจุบัน: <StatusPill status={repair.status} /></div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">สถานะ</label>
                        <select className="border px-3 py-2 rounded w-full" value={statusUpdate.status} onChange={(e) => setStatusUpdate((v) => ({ ...v, status: e.target.value }))}>
                          {[
                            "IN_PROGRESS",
                            "WAITING_PARTS",
                            "WAITING_CONFIRM",
                            "COMPLETED",
                          ].map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">หมายเหตุ</label>
                        <textarea className="border px-3 py-2 rounded w-full" rows={3} value={statusUpdate.remark} onChange={(e) => setStatusUpdate((v) => ({ ...v, remark: e.target.value }))} />
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={statusUpdate.notify} onChange={(e) => setStatusUpdate((v) => ({ ...v, notify: e.target.checked }))} />
                      <span>แจ้งลูกค้าเมื่ออัพเดต</span>
                    </label>
                    <div className="flex justify-end">
                      <button onClick={updateStatus} disabled={saving} className={`px-4 py-2 rounded text-white ${saving ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}>อัพเดตสถานะ</button>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">ไทม์ไลน์สถานะ (mock)</h3>
                      <ul className="list-disc ml-6 text-sm text-gray-600">
                        <li>สร้างงาน − {new Date(repair.requestDate).toLocaleString()}</li>
                        <li>อัพเดตล่าสุด − {new Date(repair.requestDate).toLocaleString()}</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "notify" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">เทมเพลต</label>
                  <select className="border px-3 py-2 rounded w-full">
                    <option>ใบเสนอราคา</option>
                    <option>ความคืบหน้า</option>
                    <option>เสร็จสิ้น</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">ข้อความ</label>
                  <textarea className="border px-3 py-2 rounded w-full" rows={5} defaultValue={`เรียนลูกค้า,\n\nสถานะงาน: ${repair.status}\nเครื่อง: ${repair.printerModel} (${repair.serialNumber})\n\nขอบคุณค่ะ`}></textarea>
                </div>
                <div className="flex justify-end">
                  <button onClick={notifyCustomer} className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700">ส่งข้อความ</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
