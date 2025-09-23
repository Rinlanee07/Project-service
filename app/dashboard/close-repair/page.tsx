"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";

// กำหนด type สำหรับ part และ repair
interface Part {
  partName: string;
  quantity: number | string;
  price: number | string;
}

interface Repair {
  id: string | number;
  serialNumber: string;
  printerModel: string;
  details?: {
    parts?: Part[];
  };
  close?: {
    finishedDate?: string;
    receivedDate?: string;
  };
}

export default function CloseRepairPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const params = useSearchParams();
  const id = params.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [repair, setRepair] = useState<Repair | null>(null);
  const [finishedDate, setFinishedDate] = useState<string>("");
  const [receivedDate, setReceivedDate] = useState<string>("");

  useEffect(() => {
    if (!session || !id) return;
    setLoading(true);
    fetch(`/api/repairs/${id}`)
      .then((r) => r.json())
      .then((json: Repair) => {
        setRepair(json);
        setFinishedDate(json.close?.finishedDate?.slice(0, 10) || new Date().toISOString().slice(0,10));
        setReceivedDate(json.close?.receivedDate?.slice(0, 10) || "");
      })
      .finally(() => setLoading(false));
  }, [session, id]);

  const closeJob = async () => {
    if (!isAdmin) return;
    await fetch(`/api/repairs/${id}/close`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ finishedDate, receivedDate }) });
    alert("ปิดงานสำเร็จ");
  };

  const printReceipt = async () => {
    await new Promise((r) => setTimeout(r, 300));
    alert("พิมพ์เอกสาร (mock)");
  };

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>กรุณาล็อกอิน</p>;
  if (!repair) return (
    <DashboardLayout user={session.user}>
      <div className="max-w-3xl mx-auto">ไม่พบงาน</div>
    </DashboardLayout>
  );

  const parts: Part[] = repair.details?.parts || [];
  const total = parts.reduce((s, p) => s + (Number(p.price) || 0) * (Number(p.quantity) || 1), 0);

  return (
    <DashboardLayout user={session.user}>
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">ปิดงานซ่อม #{repair.id}</h1>

        <div className="bg-white rounded shadow p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-600">Serial</div>
              <div className="font-semibold">{repair.serialNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">รุ่น</div>
              <div className="font-semibold">{repair.printerModel}</div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">สรุปอะไหล่</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border text-left">รายการ</th>
                    <th className="p-2 border text-left">จำนวน</th>
                    <th className="p-2 border text-left">ราคา/หน่วย</th>
                    <th className="p-2 border text-left">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-gray-50">
                      <td className="p-2 border">{p.partName}</td>
                      <td className="p-2 border">{p.quantity}</td>
                      <td className="p-2 border">{p.price}</td>
                      <td className="p-2 border">{(Number(p.price) * Number(p.quantity)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="p-2 border text-right font-semibold" colSpan={3}>รวม</td>
                    <td className="p-2 border font-bold">฿ {total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">วันที่ซ่อมเสร็จ</label>
              <input type="date" className="border px-3 py-2 rounded w-full" value={finishedDate} onChange={(e) => setFinishedDate(e.target.value)} disabled={!isAdmin} />
            </div>
            <div>
              <label className="block text-sm mb-1">วันที่ลูกค้ารับเครื่อง</label>
              <input type="date" className="border px-3 py-2 rounded w-full" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} disabled={!isAdmin} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button className="px-3 py-2 border rounded" onClick={printReceipt}>พิมพ์ใบเสร็จ/ใบรับรอง</button>
            {isAdmin && (
              <button className="px-3 py-2 rounded text-white bg-blue-600" onClick={closeJob}>ปิดงาน</button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
