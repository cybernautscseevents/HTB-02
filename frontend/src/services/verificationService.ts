import batches from "../data/batches";

export async function verifyBatch(batchId) {
  const id = String(batchId || "").trim().toUpperCase();

  if (!id) {
    return null;
  }

  // Simulate verification time.
  // This can later be replaced with the real backend/blockchain API.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // ---------------------------------------------------------
  // 1. Check existing static/demo batches first
  // ---------------------------------------------------------
  const staticBatch = batches[id];

  if (staticBatch) {
    return staticBatch;
  }

  // ---------------------------------------------------------
  // 2. Check batches created from the frontend
  // ---------------------------------------------------------
  if (typeof window !== "undefined") {
    try {
      const savedBatches = localStorage.getItem("medtrace_batches");

      if (savedBatches) {
        const localBatches = JSON.parse(savedBatches);

        if (Array.isArray(localBatches)) {
          const foundBatch = localBatches.find((batch) => {
            return (
              String(batch?.id || "")
                .trim()
                .toUpperCase() === id
            );
          });

          if (foundBatch) {
            return {
              batchId: foundBatch.id,

              medicine:
                foundBatch.medicine || "Unknown Medicine",

              manufacturer:
                foundBatch.manufacturer ||
                "ABC Pharmaceuticals",

              quantity: `${Number(
                String(foundBatch.quantity || "0").replace(/,/g, "")
              ).toLocaleString()} units`,

              manufactured:
                foundBatch.manufacturingDate ||
                foundBatch.manufactured ||
                "Not available",

              expiry:
                foundBatch.expiryDate ||
                foundBatch.expiry ||
                "Not available",

              status:
                foundBatch.status === "EXPIRED"
                  ? "EXPIRED"
                  : "VERIFIED",

              journey: [
                {
                  role: "Manufacturer",

                  name:
                    foundBatch.manufacturer ||
                    "ABC Pharmaceuticals",

                  location: "Not available",

                  date:
                    foundBatch.manufacturingDate ||
                    foundBatch.manufactured ||
                    "Not available",

                  action: "Batch manufactured",
                },
              ],
            };
          }
        }
      }
    } catch (error) {
      console.error(
        "Could not verify locally created batch:",
        error
      );
    }
  }

  // Batch was not found
  return null;
}