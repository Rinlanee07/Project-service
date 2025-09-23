import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const RepairDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the repair ID from the URL
  const [repairDetails, setRepairDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchRepairDetails = async () => {
        try {
          const response = await fetch(`/api/repairs/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch repair details");
          }
          const data = await response.json();
          setRepairDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRepairDetails();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Repair Details</h1>
      {repairDetails ? (
        <div>
          <h2 className="text-xl">Repair ID: {repairDetails.id}</h2>
          <p>Status: {repairDetails.status}</p>
          <p>Description: {repairDetails.description}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>No details available for this repair.</p>
      )}
    </div>
  );
};

export default RepairDetailsPage;