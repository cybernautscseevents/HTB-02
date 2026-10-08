"use client";

import { useEffect, useRef } from "react";

type QRScannerProps = {
  onScan: (value: string) => void;
  onClose: () => void;
};

export default function QRScanner({
  onScan,
  onClose,
}: QRScannerProps) {
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let scanner: any;

    async function startScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");

      scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          (decodedText: string) => {
            onScan(decodedText);
          },
          () => {
            // Ignore QR scan errors while camera is searching.
          }
        );
      } catch (error) {
        console.error("QR scanner error:", error);
      }
    }

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="qr-overlay">

      <div className="qr-modal">

        <button
          className="qr-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="qr-header">
          <div className="qr-icon">
            ◉
          </div>

          <div>
            <h2>Scan Medicine QR</h2>

            <p>
              Point your camera at the medicine QR code
            </p>
          </div>
        </div>

        <div
          id="qr-reader"
          className="qr-reader"
        />

        <div className="qr-instruction">
          Align the QR code inside the frame
        </div>

      </div>

    </div>
  );
}