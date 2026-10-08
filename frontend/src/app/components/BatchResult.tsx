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

  // FAKE / UNKNOWN MEDICINE
  if (!batch) {
    return (
      <div className="fake-card">

        <div className="fake-icon">
          ✕
        </div>

        <div className="fake-label">
          NOT VERIFIED
        </div>

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

  const isExpired = batch.status === "EXPIRED";

  return (
    <div className="result-container">

      {/* =========================
          VERIFICATION STATUS
      ========================= */}

      <div
        className={
          isExpired
            ? "verification-status expired-status"
            : "verification-status verified-status"
        }
      >

        <div className="status-icon">
          {isExpired ? "⚠" : "✓"}
        </div>

        <div className="status-main">

          <div className="status-label">
            {isExpired
              ? "EXPIRED MEDICINE"
              : "VERIFIED MEDICINE"}
          </div>

          <p>
            {isExpired
              ? "This medicine batch has passed its expiry date."
              : "This medicine batch has been successfully verified."}
          </p>

        </div>

        <div className="status-batch">
          {batch.batchId}
        </div>

      </div>


      {/* =========================
          MEDICINE INFORMATION
      ========================= */}

      <section className="medicine-card">

        <div className="card-header">

          <div>
            <span className="card-eyebrow">
              VERIFIED RECORD
            </span>

            <h2>
              Medicine Information
            </h2>
          </div>

          <div className="record-badge">
            🔗 Blockchain Record
          </div>

        </div>


        <div className="details-grid">

          <div className="detail-box">

            <span>Medicine</span>

            <strong>
              {batch.medicine}
            </strong>

          </div>


          <div className="detail-box">

            <span>Batch ID</span>

            <strong>
              {batch.batchId}
            </strong>

          </div>


          <div className="detail-box">

            <span>Manufacturer</span>

            <strong>
              {batch.manufacturer}
            </strong>

          </div>


          <div className="detail-box">

            <span>Quantity</span>

            <strong>
              {batch.quantity}
            </strong>

          </div>


          <div className="detail-box">

            <span>Manufactured</span>

            <strong>
              {batch.manufactured}
            </strong>

          </div>


          <div className="detail-box">

            <span>Expiry Date</span>

            <strong>
              {batch.expiry}
            </strong>

          </div>

        </div>

      </section>


      {/* =========================
          SUPPLY CHAIN
      ========================= */}

      <SupplyTimeline
        journey={batch.journey}
      />

    </div>
  );
}