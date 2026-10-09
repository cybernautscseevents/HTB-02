
import { Batch } from "../../data/batches";
import SupplyTimeline from "./SupplyTimeline";

type BatchResultProps = {
  batch: Batch | null;
  searchedId: string;
};

export default function BatchResult({
  batch,
  searchedId,
}: BatchResultProps) {
  if (!batch) {
    return (
      <div className="fake-card">
        <div className="fake-icon">✕</div>
        <div className="fake-label">NOT VERIFIED</div>
        <h2>Medicine Not Verified</h2>
        <p>
          Batch ID <strong>{searchedId}</strong> could not
          be found in the trusted supply chain.
        </p>
        <div className="warning-text">
          ⚠ Do not trust or dispense this medicine.
        </div>
      </div>
    );
  }

  const status = String(batch.status || "INVALID").toUpperCase();
  const isExpired = status === "EXPIRED";
  const isRecalled = status === "RECALLED";
  const isUnregistered = status === "UNREGISTERED";
  const isAuthentic = status === "VALID" || status === "VERIFIED";

  const statusLabel = isExpired
    ? "EXPIRED MEDICINE"
    : isRecalled
      ? "RECALLED MEDICINE"
      : isUnregistered
        ? "UNREGISTERED BATCH"
        : isAuthentic
          ? "VERIFIED MEDICINE"
          : "NOT VERIFIED";

  const statusMessage = isExpired
    ? "This medicine batch has expired."
    : isRecalled
      ? "This batch has been recalled. Do not dispense it."
      : isUnregistered
        ? "This batch is not registered on the blockchain."
        : isAuthentic
          ? "The blockchain reports this batch as valid."
          : "Authenticity could not be confirmed. Do not dispense this medicine.";

  const statusClass = isAuthentic
    ? "verified-status"
    : "expired-status";

  return (
    <div className="result-container">
      <div className={`verification-status ${statusClass}`}>
        <div className="status-icon">
          {isAuthentic ? "✓" : "⚠"}
        </div>

        <div className="status-main">
          <div className="status-label">{statusLabel}</div>
          <p>{statusMessage}</p>
        </div>

        <div className="status-batch">
          {batch.batchId || searchedId}
        </div>
      </div>

      <section className="medicine-card">
        <div className="card-header">
          <div>
            <span className="card-eyebrow">
              {isAuthentic ? "VERIFIED RECORD" : "VERIFICATION RESULT"}
            </span>
            <h2>Medicine Information</h2>
          </div>

          {isAuthentic && (
            <div className="record-badge">
              🔗 Blockchain Record
            </div>
          )}
        </div>

        <div className="details-grid">
          <div className="detail-box">
            <span>Medicine</span>
            <strong>{batch.medicine || "Not available"}</strong>
          </div>

          <div className="detail-box">
            <span>Batch ID</span>
            <strong>{batch.batchId || searchedId}</strong>
          </div>

          <div className="detail-box">
            <span>Manufacturer</span>
            <strong>{batch.manufacturer || "Not available"}</strong>
          </div>

          <div className="detail-box">
            <span>Quantity</span>
            <strong>{batch.quantity || "Not available"}</strong>
          </div>

          <div className="detail-box">
            <span>Manufactured</span>
            <strong>{batch.manufactured || "Not available"}</strong>
          </div>

          <div className="detail-box">
            <span>Expiry Date</span>
            <strong>{batch.expiry || "Not available"}</strong>
          </div>
        </div>
      </section>

      {isAuthentic && <SupplyTimeline journey={batch.journey || []} />}
    </div>
  );
}

