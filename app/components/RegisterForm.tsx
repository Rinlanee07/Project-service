"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterForm({
  onSwitchToLogin,
}: {
  onSwitchToLogin?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("สมัครสมาชิกเรียบร้อย! คุณจะถูกนำทางสู่แดชบอร์ด");
        router.push("/dashboard");
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการสมัคร");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-96">
      <h2 className="text-2xl font-semibold text-center mb-5">สมัครสมาชิก</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
        >
          {loading ? "กำลังสมัคร..." : "Register"}
        </Button>
      </form>
      <p className="text-sm text-gray-500 mt-3 text-center">
        มีบัญชีแล้ว?{" "}
        <span
          className="text-green-500 cursor-pointer font-medium hover:underline"
          onClick={onSwitchToLogin}
        >
          เข้าสู่ระบบ
        </span>
      </p>
    </div>
  );
}