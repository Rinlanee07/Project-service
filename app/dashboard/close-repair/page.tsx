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
  const params = useSearchParams();
  const id = params.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [repair, setRepair] = useState<Repair | null>(null);
  const [finishedDate, setFinishedDate] = useState<string>("");
  const [receivedDate, setReceivedDate] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!session || !id) return;
    setLoading(true);
    fetch(`/api/repairs/${id}`)
      .then((r) => r.json())
      .then((json: Repair) => {
        setRepair(json);
        setFinishedDate(json.close?.finishedDate?.slice(0, 10) || new Date().toISOString().slice(0, 10));
        setReceivedDate(json.close?.receivedDate?.slice(0, 10) || "");
      })
      .catch((err) => {
        console.error("Failed to load repair:", err);
      })
      .finally(() => setLoading(false));
  }, [session, id]);

  const closeJob = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/repairs/${id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finishedDate, receivedDate }),
      });
      if (res.ok) {
        alert("ปิดงานสำเร็จ");
        // คุณอาจ redirect หรือ refresh หน้าหลังจากนี้
      } else {
        alert("เกิดข้อผิดพลาดในการปิดงาน");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const printReceipt = () => {
    // Mock function
    alert("พิมพ์เอกสาร (mock)");
  };

  if (status === "loading" || loading) {
    return (
        <div className="max-w-3xl mx-auto flex items-center justify-center h-32">
          Loading...
        </div>
    );
  }

  if (!session) {
    return (
        <div className="max-w-3xl mx-auto p-4 text-center">
          กรุณาล็อกอินเพื่อดำเนินการ
        </div>

    );
  }

  if (!repair) {
    return (

        <div className="max-w-3xl mx-auto p-4 text-center">
          ไม่พบงานซ่อม
        </div>
    );
  }

  const parts: Part[] = repair.details?.parts || [];
  const total = parts.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 1),
    0
  );

  return (

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">ปิดงานซ่อม #{repair.id}</h1>
          <p className="text-sm text-gray-500">กรอกข้อมูลวันที่และยืนยันการปิดงาน</p>
        </div>

        <div className="bg-white rounded-lg border p-5 space-y-5">
          {/* ข้อมูลเครื่อง */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Serial Number</label>
              <div className="font-semibold">{repair.serialNumber}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">รุ่นเครื่อง</label>
              <div className="font-semibold">{repair.printerModel}</div>
            </div>
          </div>

          {/* ตารางอะไหล่ */}
          <div>
            <h2 className="font-semibold text-lg mb-3">สรุปอะไหล่ที่ใช้</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border text-left text-sm font-medium text-gray-700">รายการ</th>
                    <th className="p-3 border text-left text-sm font-medium text-gray-700">จำนวน</th>
                    <th className="p-3 border text-left text-sm font-medium text-gray-700">ราคา/หน่วย</th>
                    <th className="p-3 border text-left text-sm font-medium text-gray-700">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.length > 0 ? (
                    parts.map((p, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-3 border">{p.partName}</td>
                        <td className="p-3 border">{p.quantity}</td>
                        <td className="p-3 border">{Number(p.price).toFixed(2)}</td>
                        <td className="p-3 border">
                          {(Number(p.price) * Number(p.quantity)).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-500">
                        ไม่มีรายการอะไหล่
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="font-bold bg-gray-100">
                    <td colSpan={3} className="p-3 border text-right">
                      รวมทั้งหมด
                    </td>
                    <td className="p-3 border">฿ {total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* วันที่ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่ซ่อมเสร็จ
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={finishedDate}
                onChange={(e) => setFinishedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่ลูกค้ารับเครื่อง
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
          </div>

          {/* ปุ่ม */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={printReceipt}
            >
              พิมพ์ใบเสร็จ
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
              onClick={closeJob}
              disabled={submitting}
            >
              {submitting ? "กำลังปิดงาน..." : "ปิดงาน"}
            </button>
          </div>
        </div>
      </div>
  );
}