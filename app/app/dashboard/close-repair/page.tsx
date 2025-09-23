import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CloseRepairPage() {
  const [repairId, setRepairId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCloseRepair = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/repairs/${repairId}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        alert("Repair closed successfully!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to close repair.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-100 to-red-50">
      <form
        className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md"
        onSubmit={handleCloseRepair}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
          Close Repair
        </h2>

        <input
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          placeholder="Repair ID"
          value={repairId}
          onChange={(e) => setRepairId(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Closing Repair..." : "Close Repair"}
        </button>

        <p className="text-center text-gray-500 mt-4">
          Want to go back?{" "}
          <a
            href="/dashboard"
            className="text-red-600 hover:underline font-medium"
          >
            Dashboard
          </a>
        </p>
      </form>
    </div>
  );
}