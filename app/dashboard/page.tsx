"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState({ repairs: [], statusCounts: {} });
  const [loading, setLoading] = useState(true);

  // fetch งานซ่อม
  useEffect(() => {
    if (!session) return;

    fetch("/api/dashboard")
      .then(res => res.json())
      .then(json => setData(json))
      .finally(() => setLoading(false));
  }, [session]);

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>กรุณาล็อกอินก่อนเข้าหน้านี้</p>;

  return (
    <DashboardLayout user={session.user}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard งานซ่อม</h1>

        {/* สรุปจำนวนงานตามสถานะ */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(data.statusCounts).map(([status, count]) => (
            <div key={status} className="p-4 bg-gray-100 rounded shadow">
              <h2 className="font-semibold">{status.replace("_", " ")}</h2>
              <p className="text-xl font-bold">{count} งาน</p>
            </div>
          ))}
        </div>

        {/* ปุ่มสร้างงานซ่อมใหม่ */}
        <div className="mb-6">
          <Link
            href="/dashboard/create-repair"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            สร้างงานซ่อมใหม่
          </Link>
        </div>

        {/* ตารางสรุปงานซ่อม */}
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border w-1/6 text-left">Serial Number</th>
                <th className="p-3 border w-1/4 text-left">รุ่น</th>
                <th className="p-3 border w-1/4 text-left">ลูกค้า</th>
                <th className="p-3 border w-1/6 text-left">สถานะ</th>
                <th className="p-3 border w-1/6 text-left">วันที่แจ้งซ่อม</th>
              </tr>
            </thead>
            <tbody>
              {data.repairs.map((repair, index) => (
                <tr
                  key={repair.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="p-3 border w-1/6">{repair.serialNumber}</td>
                  <td className="p-3 border w-1/4">{repair.printerModel}</td>
                  <td className="p-3 border w-1/4">{repair.customer?.name || "-"}</td>
                  <td className="p-3 border w-1/6">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                        repair.status === "PENDING"
                          ? "bg-yellow-500"
                          : repair.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : repair.status === "WAITING_PARTS"
                          ? "bg-purple-500"
                          : repair.status === "WAITING_CONFIRM"
                          ? "bg-orange-500"
                          : repair.status === "COMPLETED"
                          ? "bg-green-500"
                          : repair.status === "SHIPPED"
                          ? "bg-indigo-500"
                          : repair.status === "CLOSED"
                          ? "bg-gray-700"
                          : "bg-gray-400"
                      }`}
                    >
                      {repair.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 border w-1/6">
                    {new Date(repair.requestDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
