"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");         // กำหนด type string
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // ใส่ type ให้ event ของ form
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data: { error?: string } = await res.json();

      if (res.status === 201) {
        alert("สมัครสมาชิกเรียบร้อย!");
        router.push("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-green-50">
      <form
        className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
          สมัครสมาชิก
        </h2>

        <input
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "กำลังสมัครสมาชิก..." : "Register"}
        </button>

        <p className="text-center text-gray-500 mt-4">
          มีบัญชีอยู่แล้ว?{" "}
          <a
            href="/signin"
            className="text-green-600 hover:underline font-medium"
          >
            เข้าสู่ระบบ
          </a>
        </p>
      </form>
    </div>
  );
}
