"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { verifyBatch as verifyBatchService } from "../../services/verificationService";

export default function VerificationPage() {
  const [batchId, setBatchId] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [currentBatch, setCurrentBatch] = useState(null);

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("starting");

  const scannerRef = useRef(null);

  /* =========================================
     VERIFY MEDICINE
  ========================================= */

  async function verifyBatch(id) {
    const value = String(id || batchId).trim().toUpperCase();

    if (!value) {
      setSearched(false);
      setSearchedId("");
      setCurrentBatch(null);
      setError("");
      return;
    }

    setBatchId(value);
    setSearchedId(value);
    setSearched(true);
    setLoading(true);
    setError("");
    setCurrentBatch(null);

    try {
      const result = await verifyBatchService(value);

      if (result) {
        setCurrentBatch(result);
      } else {
        setCurrentBatch(null);
      }
    } catch (err) {
      console.error("Verification error:", err);

      setError(
        "Unable to connect to the verification service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     ENTER KEY
  ========================================= */

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      verifyBatch(batchId)
    }
  }

  /* =========================================
     START QR SCANNER
  ========================================= */

  useEffect(() => {
    if (!scannerOpen) {
      return;
    }

    let scanner = null;
    let cancelled = false;

    async function startScanner() {
      try {
        setScannerStatus("starting");

        const { Html5Qrcode } = await import("html5-qrcode");

        if (cancelled) {
          return;
        }

        scanner = new Html5Qrcode("verification-qr-reader");

        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
            aspectRatio: 1,
          },

          async (decodedText) => {
            if (!decodedText || cancelled) {
              return;
            }

            const id = String(decodedText).trim().toUpperCase();

            if (!id) {
              return;
            }

            setScannerStatus("detected");

            try {
              await scanner.stop();
            } catch {
              // Scanner may already have stopped.
            }

            scannerRef.current = null;

            setTimeout(() => {
              if (!cancelled) {
                setScannerOpen(false);
                verifyBatch(id);
              }
            }, 500);
          },

          () => {
            // Ignore continuous QR scanning errors.
          }
        );

        if (!cancelled) {
          setScannerStatus("scanning");
        }
      } catch (err) {
        console.error("QR scanner error:", err);

        if (!cancelled) {
          setScannerStatus("error");

          setError(
            "Camera access failed. Please allow camera permission and try again."
          );
        }
      }
    }

    startScanner();

    return () => {
      cancelled = true;

      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {});

        scannerRef.current = null;
      }
    };
  }, [scannerOpen]);

  /* =========================================
     CLOSE SCANNER
  ========================================= */

  async function closeScanner() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // Scanner already stopped.
      }

      scannerRef.current = null;
    }

    setScannerOpen(false);
    setScannerStatus("starting");
  }

  /* =========================================
     RESULT STATE
  ========================================= */

  const isExpired =
    currentBatch?.status === "EXPIRED";

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .verification-page {
          min-height: 100vh;
          background: #F4F7FB;
          color: #334155;
          padding-bottom: 70px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .verification-header {
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 22px 7%;
        }

        .brand {
          color: #0B1F3A;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .brand span {
          color: #06B6D4;
        }

        .brand-subtitle {
          margin-top: 3px;
          color: #64748B;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .verification-content {
          width: min(1120px, 88%);
          margin: 0 auto;
          padding-top: 38px;
        }

        .page-label {
          color: #06B6D4;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .page-title {
          margin: 0;
          color: #0B1F3A;
          font-size: 34px;
          line-height: 1.15;
          font-weight: 800;
        }

        .page-description {
          margin: 9px 0 0;
          color: #64748B;
          font-size: 14px;
          line-height: 1.6;
          max-width: 680px;
        }

        .verify-card {
          margin-top: 28px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
        }

        .verify-card-title {
          color: #0B1F3A;
          font-size: 17px;
          font-weight: 750;
          margin: 0;
        }

        .verify-card-subtitle {
          margin: 5px 0 20px;
          color: #64748B;
          font-size: 12px;
        }

        .input-row {
          display: flex;
          gap: 10px;
        }

        .batch-input {
          flex: 1;
          min-width: 0;
          height: 46px;
          padding: 0 14px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          background: #FFFFFF;
          color: #0B1F3A;
          font-size: 14px;
          outline: none;
        }

        .batch-input:focus {
          border-color: #06B6D4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.12);
        }

        .batch-input::placeholder {
          color: #94A3B8;
        }

        .verify-button {
          height: 46px;
          padding: 0 24px;
          border: none;
          border-radius: 10px;
          background: #0B1F3A;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
        }

        .verify-button:hover {
          background: #0E7490;
        }

        .verify-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .scan-button {
          height: 46px;
          padding: 0 20px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          background: #FFFFFF;
          color: #0B1F3A;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .scan-button:hover {
          border-color: #06B6D4;
          color: #0891B2;
          background: #ECFEFF;
        }

        .demo-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 15px;
          color: #64748B;
          font-size: 11px;
        }

        .demo-row button {
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          color: #475569;
          padding: 6px 10px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .demo-row button:hover {
          border-color: #06B6D4;
          background: #ECFEFF;
          color: #0891B2;
        }

        .loading-card {
          margin-top: 24px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 45px 25px;
          text-align: center;
        }

        .spinner {
          width: 42px;
          height: 42px;
          margin: 0 auto 18px;
          border: 4px solid #E2E8F0;
          border-top-color: #06B6D4;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-card h2 {
          margin: 0;
          color: #0B1F3A;
          font-size: 19px;
        }

        .loading-card p {
          margin: 7px 0 0;
          color: #64748B;
          font-size: 13px;
        }

        .status-card {
          margin-top: 24px;
          padding: 21px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid;
        }

        .status-card.verified {
          background: #ECFDF5;
          border-color: #A7F3D0;
        }

        .status-card.expired {
          background: #FFF7ED;
          border-color: #FED7AA;
        }

        .status-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .verified .status-icon {
          background: #D1FAE5;
          color: #059669;
        }

        .expired .status-icon {
          background: #FFEDD5;
          color: #EA580C;
        }

        .status-info {
          flex: 1;
        }

        .status-label {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .verified .status-label {
          color: #047857;
        }

        .expired .status-label {
          color: #C2410C;
        }

        .status-info p {
          margin: 4px 0 0;
          color: #64748B;
          font-size: 12px;
        }

        .batch-badge {
          padding: 7px 10px;
          border-radius: 8px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #0B1F3A;
          font-size: 11px;
          font-weight: 800;
        }

        .section-card {
          margin-top: 20px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 21px;
        }

        .section-label {
          color: #06B6D4;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .section-title {
          margin: 0;
          color: #0B1F3A;
          font-size: 19px;
          font-weight: 800;
        }

        .blockchain-badge {
          padding: 8px 11px;
          border-radius: 8px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #047857;
          font-size: 11px;
          font-weight: 700;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .detail {
          padding: 15px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 11px;
        }

        .detail-label {
          display: block;
          color: #64748B;
          font-size: 10px;
          margin-bottom: 6px;
        }

        .detail-value {
          display: block;
          color: #0B1F3A;
          font-size: 14px;
          font-weight: 750;
        }

        .timeline {
          position: relative;
        }

        .timeline-item {
          position: relative;
          display: flex;
          gap: 15px;
          padding-bottom: 26px;
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-item:not(:last-child)::before {
          content: "";
          position: absolute;
          left: 15px;
          top: 32px;
          bottom: 0;
          width: 2px;
          background: #CBD5E1;
        }

        .timeline-dot {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #ECFDF5;
          border: 2px solid #10B981;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          position: relative;
          z-index: 1;
        }

        .timeline-role {
          color: #06B6D4;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .timeline-name {
          margin: 3px 0;
          color: #0B1F3A;
          font-size: 14px;
          font-weight: 750;
        }

        .timeline-action {
          color: #64748B;
          font-size: 12px;
        }

        .timeline-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 7px;
          color: #64748B;
          font-size: 10px;
        }

        .blockchain-section {
          margin-top: 20px;
          background: #0B1F3A;
          border-radius: 16px;
          padding: 24px;
        }

        .blockchain-section .section-label {
          color: #67E8F9;
        }

        .blockchain-section .section-title {
          color: #FFFFFF;
        }

        .blockchain-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .blockchain-item {
          padding: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }

        .blockchain-item span {
          display: block;
          color: #94A3B8;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .blockchain-item strong {
          color: #FFFFFF;
          font-size: 12px;
        }

        .blockchain-confirmed {
          color: #6EE7B7 !important;
        }

        .not-verified {
          margin-top: 24px;
          background: #FFFFFF;
          border: 1px solid #FECACA;
          border-radius: 16px;
          padding: 38px 25px;
          text-align: center;
        }

        .not-verified-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: #FEE2E2;
          color: #EF4444;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
        }

        .not-verified-label {
          color: #DC2626;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        .not-verified h2 {
          margin: 7px 0;
          color: #0B1F3A;
          font-size: 21px;
        }

        .not-verified p {
          max-width: 520px;
          margin: 0 auto;
          color: #64748B;
          font-size: 13px;
          line-height: 1.6;
        }

        .warning {
          margin: 18px auto 0;
          max-width: 500px;
          padding: 11px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 9px;
          color: #B91C1C;
          font-size: 11px;
          font-weight: 700;
        }

        .retry-button {
          margin-top: 18px;
          height: 42px;
          padding: 0 20px;
          border: none;
          border-radius: 9px;
          background: #0B1F3A;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .retry-button:hover {
          background: #0E7490;
        }

        .qr-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(11,31,58,0.70);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .qr-modal {
          width: min(500px, 100%);
          background: #FFFFFF;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 25px 70px rgba(15,23,42,0.30);
          position: relative;
        }

        .qr-close {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 35px;
          height: 35px;
          border-radius: 9px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #64748B;
          cursor: pointer;
        }

        .qr-close:hover {
          background: #F8FAFC;
          color: #0B1F3A;
        }

        .qr-title {
          margin: 0;
          color: #0B1F3A;
          font-size: 20px;
          font-weight: 800;
        }

        .qr-description {
          margin: 5px 0 20px;
          color: #64748B;
          font-size: 12px;
        }

        .qr-reader-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          background: #0B1F3A;
        }

        .qr-reader {
          overflow: hidden;
          min-height: 320px;
        }

        .scanner-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scan-frame {
          width: 250px;
          height: 250px;
          border: 2px solid #06B6D4;
          border-radius: 14px;
          box-shadow:
            0 0 0 999px rgba(11,31,58,0.35),
            0 0 25px rgba(6,182,212,0.25);
          position: relative;
        }

        .scan-frame::after {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          top: 50%;
          height: 2px;
          background: #06B6D4;
          box-shadow: 0 0 10px #06B6D4;
          animation: scan-line 2s ease-in-out infinite;
        }

        @keyframes scan-line {
          0%, 100% {
            transform: translateY(-100px);
            opacity: 0.5;
          }

          50% {
            transform: translateY(100px);
            opacity: 1;
          }
        }

        .scanner-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
          color: #64748B;
          font-size: 12px;
        }

        .status-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #06B6D4;
          animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.35;
          }

          50% {
            opacity: 1;
          }
        }

        .scanner-detected {
          color: #059669;
          font-weight: 700;
        }

        .scanner-detected .status-pulse {
          background: #10B981;
          animation: none;
        }

        .scanner-error {
          color: #DC2626;
          font-weight: 600;
        }

        .scanner-error .status-pulse {
          background: #EF4444;
          animation: none;
        }

        .qr-privacy {
          margin-top: 10px;
          text-align: center;
          color: #94A3B8;
          font-size: 10px;
        }

        @media (max-width: 800px) {
          .verification-content {
            width: 92%;
          }

          .page-title {
            font-size: 29px;
          }

          .input-row {
            flex-direction: column;
          }

          .verify-button,
          .scan-button {
            width: 100%;
          }

          .details-grid,
          .blockchain-grid {
            grid-template-columns: 1fr 1fr;
          }

          .status-card {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 520px) {
          .verification-content {
            width: calc(100% - 28px);
            padding-top: 28px;
          }

          .page-title {
            font-size: 27px;
          }

          .verify-card,
          .section-card {
            padding: 19px;
          }

          .details-grid,
          .blockchain-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
          }

          .qr-modal {
            padding: 20px;
          }

          .scan-frame {
            width: 220px;
            height: 220px;
          }
        }
      `}</style>

      <main className="verification-page">

        {/* HEADER */}

        <header className="verification-header">
          <div className="brand">
            MED<span>TRACE</span>
          </div>

          <div className="brand-subtitle">
            Medicine Supply Chain
          </div>
        </header>

        {/* CONTENT */}

        <div className="verification-content">

          {/* BACK TO DASHBOARD */}

          <div style={{ marginBottom: "20px" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 20px",
                borderRadius: "10px",
                background: "#0B1F3A",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="page-label">
            Verification
          </div>

          <h1 className="page-title">
            Medicine Verification
          </h1>

          <p className="page-description">
            Verify the authenticity of a medicine batch and
            trace its complete journey through the supply chain.
          </p>

          {/* VERIFY CARD */}

          <section className="verify-card">

            <h2 className="verify-card-title">
              Verify Medicine
            </h2>

            <p className="verify-card-subtitle">
              Enter the batch ID printed on the package
              or scan its QR code.
            </p>

            <div className="input-row">

              <input
                className="batch-input"
                value={batchId}
                onChange={(event) =>
                  setBatchId(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter Batch ID  e.g. MED-001"
              />

              <button
                className="verify-button"
                onClick={() => verifyBatch(batchId)}
                disabled={loading}
              >
                {loading
                  ? "VERIFYING..."
                  : "VERIFY MEDICINE"}
              </button>

              <button
                className="scan-button"
                onClick={() => {
                  setError("");
                  setScannerOpen(true);
                }}
              >
                📷 Scan QR
              </button>

            </div>

            <div className="demo-row">

              <span>Demo batches:</span>

              <button
                onClick={() => {
                  setBatchId("MED-001");
                  verifyBatch("MED-001");
                }}
              >
                MED-001
              </button>

              <button
                onClick={() => {
                  setBatchId("EXP-001");
                  verifyBatch("EXP-001");
                }}
              >
                EXP-001
              </button>

              <button
                onClick={() => {
                  setBatchId("FAKE-001");
                  verifyBatch("FAKE-001");
                }}
              >
                FAKE-001
              </button>

            </div>

          </section>

          {/* LOADING */}

          {searched && loading && (
            <section className="loading-card">

              <div className="spinner"></div>

              <h2>
                Verifying Medicine
              </h2>

              <p>
                Checking batch {searchedId} against
                the trusted supply chain...
              </p>

            </section>
          )}

          {/* ERROR */}

          {error && !loading && (
            <section className="not-verified">

              <div className="not-verified-icon">
                !
              </div>

              <div className="not-verified-label">
                VERIFICATION ERROR
              </div>

              <h2>
                Unable to Verify Medicine
              </h2>

              <p>
                {error}
              </p>

              <button
                className="retry-button"
                onClick={() => verifyBatch(searchedId)}
              >
                TRY AGAIN
              </button>

            </section>
          )}

          {/* UNKNOWN BATCH */}

          {searched &&
            !loading &&
            !error &&
            !currentBatch && (
              <section className="not-verified">

                <div className="not-verified-icon">
                  ✕
                </div>

                <div className="not-verified-label">
                  VERIFICATION FAILED
                </div>

                <h2>
                  Medicine Not Verified
                </h2>

                <p>
                  Batch ID{" "}
                  <strong>{searchedId}</strong>{" "}
                  could not be found in the trusted
                  supply chain.
                </p>

                <div className="warning">
                  ⚠ Do not trust or dispense this medicine.
                </div>

                <button
                  className="retry-button"
                  onClick={() => verifyBatch(searchedId)}
                >
                  TRY AGAIN
                </button>

              </section>
            )}

          {/* VERIFIED / EXPIRED */}

          {searched &&
            !loading &&
            !error &&
            currentBatch && (
              <>

                {/* STATUS */}

                <section
                  className={
                    isExpired
                      ? "status-card expired"
                      : "status-card verified"
                  }
                >

                  <div className="status-icon">
                    {isExpired ? "⚠" : "✓"}
                  </div>

                  <div className="status-info">

                    <div className="status-label">
                      {isExpired
                        ? "EXPIRED MEDICINE"
                        : "VERIFIED MEDICINE"}
                    </div>

                    <p>
                      {isExpired
                        ? "This medicine batch has passed its expiry date."
                        : "This medicine batch has been successfully verified against the trusted supply chain."}
                    </p>

                  </div>

                  <div className="batch-badge">
                    {currentBatch.batchId}
                  </div>

                </section>

                {/* DETAILS */}

                <section className="section-card">

                  <div className="section-header">

                    <div>
                      <div className="section-label">
                        Medicine Record
                      </div>

                      <h2 className="section-title">
                        Medicine Details
                      </h2>
                    </div>

                    <div className="blockchain-badge">
                      🔗 Blockchain Record
                    </div>

                  </div>

                  <div className="details-grid">

                    <div className="detail">
                      <span className="detail-label">
                        Medicine
                      </span>

                      <strong className="detail-value">
                        {currentBatch.medicine}
                      </strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Batch ID
                      </span>

                      <strong className="detail-value">
                        {currentBatch.batchId}
                      </strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Manufacturer
                      </span>

                      <strong className="detail-value">
                        {currentBatch.manufacturer}
                      </strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Quantity
                      </span>

                      <strong className="detail-value">
                        {currentBatch.quantity}
                      </strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Manufactured
                      </span>

                      <strong className="detail-value">
                        {currentBatch.manufactured}
                      </strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Expiry Date
                      </span>

                      <strong className="detail-value">
                        {currentBatch.expiry}
                      </strong>
                    </div>

                  </div>

                </section>

                {/* TIMELINE */}

                <section className="section-card">

                  <div className="section-header">

                    <div>
                      <div className="section-label">
                        Traceability
                      </div>

                      <h2 className="section-title">
                        Supply Chain Journey
                      </h2>
                    </div>

                  </div>

                  <div className="timeline">

                    {(currentBatch.journey || []).map(
                      (step, index) => (
                        <div
                          className="timeline-item"
                          key={`${step.role}-${index}`}
                        >

                          <div className="timeline-dot">
                            ✓
                          </div>

                          <div>

                            <div className="timeline-role">
                              {step.role}
                            </div>

                            <div className="timeline-name">
                              {step.name}
                            </div>

                            <div className="timeline-action">
                              {step.action}
                            </div>

                            <div className="timeline-meta">

                              <span>
                                📍 {step.location}
                              </span>

                              <span>
                                🕒 {step.date}
                              </span>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </section>

                {/* BLOCKCHAIN */}

                <section className="blockchain-section">

                  <div className="section-label">
                    Blockchain Verification
                  </div>

                  <h2 className="section-title">
                    Trusted Record
                  </h2>

                  <div className="blockchain-grid">

                    <div className="blockchain-item">

                      <span>
                        Verification Status
                      </span>

                      <strong className="blockchain-confirmed">
                        ✓ Record Verified
                      </strong>

                    </div>

                    <div className="blockchain-item">

                      <span>
                        Batch Reference
                      </span>

                      <strong>
                        {currentBatch.batchId}
                      </strong>

                    </div>

                    <div className="blockchain-item">

                      <span>
                        Supply Chain
                      </span>

                      <strong className="blockchain-confirmed">
                        ✓ Traceable
                      </strong>

                    </div>

                  </div>

                </section>

              </>
            )}

        </div>

        {/* QR SCANNER MODAL */}

        {scannerOpen && (
          <div className="qr-overlay">

            <div className="qr-modal">

              <button
                className="qr-close"
                onClick={closeScanner}
              >
                ✕
              </button>

              <h2 className="qr-title">
                Scan Medicine QR
              </h2>

              <p className="qr-description">
                Position the medicine QR code inside
                the scanning frame.
              </p>

              <div className="qr-reader-wrapper">

                <div
                  id="verification-qr-reader"
                  className="qr-reader"
                />

                <div className="scanner-overlay">
                  <div className="scan-frame"></div>
                </div>

              </div>

              <div
                className={
                  scannerStatus === "detected"
                    ? "scanner-status scanner-detected"
                    : scannerStatus === "error"
                    ? "scanner-status scanner-error"
                    : "scanner-status"
                }
              >

                <span className="status-pulse"></span>

                {scannerStatus === "starting" &&
                  "Starting camera..."}

                {scannerStatus === "scanning" &&
                  "Scanning for QR code..."}

                {scannerStatus === "detected" &&
                  "QR code detected! Verifying..."}

                {scannerStatus === "error" &&
                  "Camera access failed"}

              </div>

              <div className="qr-privacy">
                🔒 Camera is used only to scan the medicine QR code.
              </div>

            </div>

          </div>
        )}

      </main>
    </>
  );
}