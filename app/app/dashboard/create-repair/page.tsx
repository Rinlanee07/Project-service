import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreateRepairPage() {
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCreateRepair = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data: { error?: string } = await res.json();

      if (res.status === 201) {
        alert("สร้างการซ่อมเรียบร้อย!");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <form
        className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md"
        onSubmit={handleCreateRepair}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          สร้างการซ่อม
        </h2>

        <textarea
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="รายละเอียดการซ่อม"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "กำลังสร้างการซ่อม..." : "สร้างการซ่อม"}
        </button>

        <p className="text-center text-gray-500 mt-4">
          ต้องการกลับไปที่{" "}
          <a
            href="/dashboard"
            className="text-blue-600 hover:underline font-medium"
          >
            แดชบอร์ด
          </a>
        </p>
      </form>
    </div>
  );
}