"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const initialBatches = [
  {
    id: "MED-2026-001",
    medicine: "Paracetamol 500mg",
    quantity: "5,000",
    expiry: "08 Oct 2028",
    status: "ACTIVE",
    destination: "XYZ Distributor",
  },
  {
    id: "MED-2026-002",
    medicine: "Amoxicillin 250mg",
    quantity: "3,000",
    expiry: "05 Oct 2028",
    status: "ACTIVE",
    destination: "XYZ Pharmacy",
  },
  {
    id: "MED-2026-003",
    medicine: "Ibuprofen 400mg",
    quantity: "2,500",
    expiry: "15 Sep 2026",
    status: "EXPIRED",
    destination: "ABC Distributor",
  },
];

function generateBatchId(existingBatches = []) {
  let newId = "";

  do {
    const randomPart = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();

    newId = `MED-${new Date().getFullYear()}-${randomPart}`;
  } while (
    existingBatches.some(
      (batch) => String(batch.id).toUpperCase() === newId
    )
  );

  return newId;
}

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [qrBatch, setQrBatch] = useState(null);

  const [transferDestination, setTransferDestination] =
    useState("");

  const [batchList, setBatchList] = useState(initialBatches);

  useEffect(() => {
    const savedBatches = localStorage.getItem("medtrace_batches");

    if (savedBatches) {
      try {
        const parsedBatches = JSON.parse(savedBatches);

        if (Array.isArray(parsedBatches)) {
          setBatchList(parsedBatches);
        }
      } catch (error) {
        console.error("Could not load saved batches:", error);
      }
    }
  }, []);

  const [form, setForm] = useState({
    medicine: "",
    batchId: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  /*
   * Open Create Batch form
   * and automatically generate a unique Batch ID.
   */
  const handleOpenCreate = () => {
    const generatedBatchId = generateBatchId(batchList);

    setForm({
      medicine: "",
      batchId: generatedBatchId,
      quantity: "",
      manufacturingDate: "",
      expiryDate: "",
    });

    setShowCreate(true);
  };

  /*
   * Create a new batch.
   */
  const handleCreateBatch = () => {
    const medicine = form.medicine.trim();
    const batchId = form.batchId.trim();
    const quantity = form.quantity.trim();

    if (!medicine) {
      alert("Please enter the medicine name.");
      return;
    }

    if (!batchId) {
      alert(
        "Batch ID could not be generated. Please reopen the form."
      );
      return;
    }

    if (!quantity) {
      alert("Please enter the quantity.");
      return;
    }

    if (!form.manufacturingDate) {
      alert("Please select the manufacturing date.");
      return;
    }

    if (!form.expiryDate) {
      alert("Please select the expiry date.");
      return;
    }

    /*
     * Convert dates into readable format.
     */
    const manufacturingDate = new Date(
      form.manufacturingDate
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const expiryDate = new Date(
      form.expiryDate
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    /*
     * Create complete batch object.
     */
    const newBatch = {
      id: batchId,
      batchId: batchId,
      medicine: medicine,
      quantity: Number(quantity).toLocaleString(),
      manufacturingDate: manufacturingDate,
      manufactured: manufacturingDate,
      expiryDate: expiryDate,
      expiry: expiryDate,
      status: "ACTIVE",
      manufacturer: "ABC Pharmaceuticals",
      destination: "Not Assigned",
      qrValue: batchId,
    };

    /*
     * Save batch in localStorage.
     */
    setBatchList((currentBatches) => {
      const updatedBatches = [
        newBatch,
        ...currentBatches,
      ];

      localStorage.setItem(
        "medtrace_batches",
        JSON.stringify(updatedBatches)
      );

      return updatedBatches;
    });

    /*
     * Show QR popup.
     */
    setQrBatch(newBatch);

    /*
     * Clear form.
     */
    setForm({
      medicine: "",
      batchId: "",
      quantity: "",
      manufacturingDate: "",
      expiryDate: "",
    });

    /*
     * Close create modal.
     */
    setShowCreate(false);

    alert("Batch created successfully!");
  };

  /*
   * Transfer batch.
   */
  const handleTransfer = () => {
    if (!selectedBatch) {
      alert("Please select a batch.");
      return;
    }

    if (!transferDestination.trim()) {
      alert("Please enter a destination.");
      return;
    }

    const updatedBatches = batchList.map((batch) => {
      if (batch.id === selectedBatch.id) {
        return {
          ...batch,
          destination: transferDestination.trim(),
        };
      }

      return batch;
    });

    setBatchList(updatedBatches);

    localStorage.setItem(
      "medtrace_batches",
      JSON.stringify(updatedBatches)
    );

    const savedTransfers =
      localStorage.getItem("medtrace_transfers");

    const existingTransfers = savedTransfers
      ? JSON.parse(savedTransfers)
      : [];

    const newTransfer = {
      id: Date.now(),
      batchId: selectedBatch.id,
      medicine: selectedBatch.medicine,
      destination: transferDestination.trim(),
      date: new Date().toLocaleDateString("en-GB"),
      status: "TRANSFERRED",
    };

    localStorage.setItem(
      "medtrace_transfers",
      JSON.stringify([
        newTransfer,
        ...existingTransfers,
      ])
    );

    setSelectedBatch(null);
    setTransferDestination("");
    setShowTransfer(false);

    alert("Batch transferred successfully!");
  };

  /*
   * Delete batch.
   */
  const handleDeleteBatch = (batchId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmed) {
      return;
    }

    const updatedBatches = batchList.filter(
      (batch) => batch.id !== batchId
    );

    setBatchList(updatedBatches);

    localStorage.setItem(
      "medtrace_batches",
      JSON.stringify(updatedBatches)
    );

    if (qrBatch && qrBatch.id === batchId) {
      setQrBatch(null);
    }

    if (selectedBatch && selectedBatch.id === batchId) {
      setSelectedBatch(null);
      setShowTransfer(false);
    }

    alert("Batch deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B1F3A] text-white shadow-xl">

        <div className="p-6">

          <h1 className="text-2xl font-bold tracking-wide">
            MED<span className="text-cyan-400">TRACE</span>
          </h1>

          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
            Medicine Supply Chain
          </p>

        </div>

        <nav className="px-4">

          <div className="mb-2 rounded-lg bg-blue-600 px-4 py-3">
            Dashboard
          </div>

          <Link
            href="/batches"
            className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Batches
          </Link>

          <Link
            href="/transfers"
            className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Transfers
          </Link>

          <Link
            href="/verify"
            className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Verification
          </Link>

        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-lg bg-slate-800 p-4">

          <p className="text-sm text-slate-400">
            Logged in as
          </p>

          <p className="font-semibold">
            Manufacturer
          </p>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="ml-64 min-h-screen">

        {/* Header */}

        <header className="flex items-center justify-between border-b bg-white px-8 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Manufacturer Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Manage medicine batches and supply chain activity
            </p>

          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Create Batch
          </button>

        </header>

        <div className="p-8">

          {/* ================= STATISTICS ================= */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* Total */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

              <p className="text-sm text-slate-500">
                Total Batches
              </p>

              <p className="mt-3 text-4xl font-bold text-[#0B1F3A]">
                {batchList.length}
              </p>

            </div>

            {/* Active */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

              <p className="text-sm text-slate-500">
                Active Batches
              </p>

              <p className="mt-3 text-4xl font-bold text-emerald-600">

                {
                  batchList.filter(
                    (batch) =>
                      batch.status === "ACTIVE"
                  ).length
                }

              </p>

            </div>

            {/* Expired */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

              <p className="text-sm text-slate-500">
                Expired Batches
              </p>

              <p className="mt-3 text-4xl font-bold text-red-500">

                {
                  batchList.filter(
                    (batch) =>
                      batch.status === "EXPIRED"
                  ).length
                }

              </p>

            </div>

          </div>

          {/* ================= RECENT BATCHES ================= */}

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b p-6">

              <div>

                <h3 className="text-xl font-bold">
                  Recent Batches
                </h3>

                <p className="text-sm text-slate-500">
                  Recently created medicine batches
                </p>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                    <th className="px-6 py-4">
                      Batch ID
                    </th>

                    <th className="px-6 py-4">
                      Medicine
                    </th>

                    <th className="px-6 py-4">
                      Quantity
                    </th>

                    <th className="px-6 py-4">
                      Expiry
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Destination
                    </th>

                    <th className="px-6 py-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {batchList.map((batch) => (

                    <tr
                      key={batch.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50 last:border-b-0"
                    >

                      {/* Batch ID */}

                      <td className="px-6 py-4 font-semibold">

                        <Link
                          href={`/batch/${batch.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {batch.id}
                        </Link>

                      </td>

                      {/* Medicine */}

                      <td className="px-6 py-4">
                        {batch.medicine}
                      </td>

                      {/* Quantity */}

                      <td className="px-6 py-4">
                        {batch.quantity}
                      </td>

                      {/* Expiry */}

                      <td className="px-6 py-4">
                        {batch.expiry}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            batch.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {batch.status}
                        </span>

                      </td>

                      {/* Destination */}

                      <td className="px-6 py-4 text-slate-600">
                        {batch.destination}
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          {/* QR */}

                          <button
                            onClick={() => {
                              setQrBatch(batch);
                            }}
                            className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                          >
                            QR
                          </button>

                          {/* Delete */}

                          <button
                            onClick={() =>
                              handleDeleteBatch(batch.id)
                            }
                            className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>

                          {/* Transfer */}

                          <button
                            onClick={() => {
                              setSelectedBatch(batch);
                              setTransferDestination("");
                              setShowTransfer(true);
                            }}
                            className="rounded-lg bg-[#0B1F3A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                          >
                            Transfer
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

      {/* ===================================================== */}
      {/* CREATE BATCH MODAL */}
      {/* ===================================================== */}

      {showCreate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b p-6">

              <div>

                <h2 className="text-xl font-bold">
                  Create New Batch
                </h2>

                <p className="text-sm text-slate-500">
                  Enter medicine batch information
                </p>

              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <div className="space-y-5 p-6">

              {/* Medicine Name */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Medicine Name
                </label>

                <input
                  type="text"
                  name="medicine"
                  value={form.medicine}
                  onChange={handleChange}
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Automatically Generated Batch ID */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Batch ID
                </label>

                <input
                  type="text"
                  name="batchId"
                  value={form.batchId}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-slate-700 outline-none"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Generated automatically for this batch.
                </p>

              </div>

              {/* Quantity */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Dates */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Manufacturing Date
                  </label>

                  <input
                    type="date"
                    name="manufacturingDate"
                    value={form.manufacturingDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg border px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateBatch}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Create Batch
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================== */}
      {/* QR CODE MODAL */}
      {/* ===================================================== */}

      {qrBatch && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6">

          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
                Batch Created
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                QR Code Generated
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Scan this QR code to verify the medicine batch.
              </p>

              {/* QR Code */}

              <div className="mt-6 flex justify-center">

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <QRCodeSVG
                    value={qrBatch.id}
                    size={220}
                    level="H"
                    includeMargin
                  />

                </div>

              </div>

              {/* Batch ID */}

              <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Batch ID
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-[#0B1F3A]">
                  {qrBatch.id}
                </p>

              </div>

              <p className="mt-4 text-xs text-slate-500">
                The QR code contains the Batch ID only.
              </p>

              {/* Buttons */}

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => setQrBatch(null)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>

                <Link
                  href="/verify"
                  onClick={() => setQrBatch(null)}
                  className="flex-1 rounded-lg bg-[#0B1F3A] px-4 py-3 text-center font-semibold text-white transition hover:bg-cyan-700"
                >
                  Verify Batch
                </Link>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================== */}
      {/* TRANSFER MODAL */}
      {/* ===================================================== */}

      {showTransfer && selectedBatch && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Transfer Header */}

            <div className="flex items-center justify-between border-b p-6">

              <div>

                <h2 className="text-xl font-bold">
                  Transfer Medicine Batch
                </h2>

                <p className="text-sm text-slate-500">
                  Transfer this batch to another participant.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowTransfer(false);
                  setSelectedBatch(null);
                }}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Transfer Content */}

            <div className="space-y-5 p-6">

              {/* Selected Batch */}

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-sm text-slate-500">
                  Batch ID
                </p>

                <p className="mt-1 font-semibold">
                  {selectedBatch.id}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Medicine
                </p>

                <p className="mt-1 font-semibold">
                  {selectedBatch.medicine}
                </p>

              </div>

              {/* Destination */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Transfer To
                </label>

                <input
                  type="text"
                  value={transferDestination}
                  onChange={(e) =>
                    setTransferDestination(e.target.value)
                  }
                  placeholder="e.g. ABC Distributor"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  onClick={() => {
                    setShowTransfer(false);
                    setSelectedBatch(null);
                    setTransferDestination("");
                  }}
                  className="rounded-lg border px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleTransfer}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Confirm Transfer
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}