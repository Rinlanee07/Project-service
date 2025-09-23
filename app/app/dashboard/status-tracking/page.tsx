import { useEffect, useState } from "react";

const StatusTrackingPage = () => {
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const response = await fetch("/api/repairs/status");
        if (!response.ok) {
          throw new Error("Failed to fetch status data");
        }
        const data = await response.json();
        setStatusData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Status Tracking</h1>
      <ul>
        {statusData.map((status) => (
          <li key={status.id} className="border-b py-2">
            <h2 className="font-semibold">{status.title}</h2>
            <p>{status.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusTrackingPage;