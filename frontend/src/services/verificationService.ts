
const API_BASE_URL =
  process.env.NEXT_PUBLIC_MEDTRACE_API_URL ||
  "http://localhost:5001";

export async function verifyBatch(batchId: string) {
  const id = String(batchId || "").trim().toUpperCase();

  if (!id) {
    return null;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/verify/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (response.status === 404 || result.status === "UNREGISTERED") {
    return {
      batchId: id,
      medicine: "Unknown Medicine",
      manufacturer: "Not registered",
      quantity: "Not available",
      manufactured: "Not available",
      expiry: "Not available",
      status: "UNREGISTERED",
      message: result.message || "This batch is not registered on the blockchain.",
      journey: [],
    };
  }

  if (!response.ok) {
    throw new Error(
      result.message || "The verification service is unavailable."
    );
  }

  return {
    batchId: id,
    medicine: result.medicine || "Medicine details unavailable",
    manufacturer: result.manufacturer || "Not available",
    quantity: result.quantity || "Not available",
    manufactured: result.manufactured || "Not available",
    expiry: result.expiry || "Not available",
    status: result.status || "INVALID",
    message: result.message || "Verification completed.",
    journey: result.journey || [],
  };
}

