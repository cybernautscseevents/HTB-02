"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TransfersPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [destination, setDestination] = useState("");
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const savedBatches = localStorage.getItem("medtrace_batches");
    const savedTransfers = localStorage.getItem("medtrace_transfers");

    if (savedBatches) {
      try {
        const parsedBatches = JSON.parse(savedBatches);

        if (Array.isArray(parsedBatches)) {
          setBatches(parsedBatches);
        }
      } catch (error) {
        console.error("Could not load batches:", error);
      }
    }

    if (savedTransfers) {
      try {
        const parsedTransfers = JSON.parse(savedTransfers);

        if (Array.isArray(parsedTransfers)) {
          setTransfers(parsedTransfers);
        }
      } catch (error) {
        console.error("Could not load transfers:", error);
      }
    }
  }, []);

  const handleTransfer = () => {
    if (!selectedBatch || !destination.trim()) {
      alert("Please select a batch and enter a destination.");
      return;
    }

    const batch = batches.find((item) => item.id === selectedBatch);

    if (!batch) {
      alert("Batch not found.");
      return;
    }

    const newTransfer = {
      id: Date.now(),
      batchId: batch.id,
      medicine: batch.medicine,
      destination: destination.trim(),
      date: new Date().toLocaleDateString("en-GB"),
      status: "TRANSFERRED",
    };

    const updatedTransfers = [newTransfer, ...transfers];

    setTransfers(updatedTransfers);

    localStorage.setItem(
      "medtrace_transfers",
      JSON.stringify(updatedTransfers)
    );

    // Also update the batch destination
    const updatedBatches = batches.map((item) => {
      if (item.id === batch.id) {
        return {
          ...item,
          destination: destination.trim(),
        };
      }

      return item;
    });

    setBatches(updatedBatches);

    localStorage.setItem(
      "medtrace_batches",
      JSON.stringify(updatedBatches)
    );

    setSelectedBatch("");
    setDestination("");

    alert("Batch transferred successfully!");
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-slate-900">

      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F3A] text-lg font-bold text-cyan-400">
                M
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide text-[#0B1F3A]">
                  MED<span className="text-cyan-600">TRACE</span>
                </h1>

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Medicine Supply Chain
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-10">

        {/* Page Heading */}
        <div>
          <div className="mb-3 inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Supply Chain
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-[#0B1F3A]">
            Transfers
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500">
            Transfer medicine batches securely to distributors, pharmacies,
            and other supply-chain participants.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Available Batches
            </p>

            <p className="mt-2 text-3xl font-bold text-[#0B1F3A]">
              {batches.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Batches available for transfer
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Transfers
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-600">
              {transfers.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Recorded supply-chain transfers
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Transfer Status
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              System Active
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Ready to process transfers
            </p>
          </div>

        </div>

        {/* Transfer Form */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 bg-gradient-to-r from-[#0B1F3A] to-[#12345C] px-7 py-6 text-white">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                ⇄
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  Create New Transfer
                </h3>

                <p className="mt-1 text-sm text-slate-300">
                  Select a medicine batch and specify its next destination.
                </p>
              </div>

            </div>

          </div>

          <div className="p-7">

            <div className="grid gap-6 md:grid-cols-2">

              {/* Batch Selection */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Medicine Batch
                </label>

                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
                >
                  <option value="">
                    Select a batch
                  </option>

                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.id} — {batch.medicine}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  Choose the batch you want to transfer.
                </p>

              </div>

              {/* Destination */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transfer Destination
                </label>

                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. ABC Distributor"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter the distributor, pharmacy, or next participant.
                </p>

              </div>

            </div>

            {/* Selected Batch Preview */}
            {selectedBatch && (
              <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-5">

                {(() => {
                  const batch = batches.find(
                    (item) => item.id === selectedBatch
                  );

                  if (!batch) return null;

                  return (
                    <div className="grid gap-4 md:grid-cols-3">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                          Batch ID
                        </p>

                        <p className="mt-1 font-bold text-[#0B1F3A]">
                          {batch.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                          Medicine
                        </p>

                        <p className="mt-1 font-bold text-[#0B1F3A]">
                          {batch.medicine}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                          Quantity
                        </p>

                        <p className="mt-1 font-bold text-[#0B1F3A]">
                          {batch.quantity}
                        </p>
                      </div>

                    </div>
                  );
                })()}

              </div>
            )}

            {/* Transfer Button */}
            <div className="mt-7 flex justify-end">

              <button
                onClick={handleTransfer}
                className="rounded-xl bg-[#0B1F3A] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-md"
              >
                Transfer Batch →
              </button>

            </div>

          </div>
        </section>

        {/* Transfer History */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-7 py-6">

            <div>
              <div className="flex items-center gap-3">

                <h3 className="text-xl font-bold text-[#0B1F3A]">
                  Transfer History
                </h3>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  {transfers.length}
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Recent movement of medicine batches through the supply chain.
              </p>
            </div>

          </div>

          {transfers.length === 0 ? (

            <div className="px-7 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ⇄
              </div>

              <h4 className="mt-5 text-lg font-bold text-[#0B1F3A]">
                No transfers yet
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Once you transfer a medicine batch, the transfer will appear
                here with its destination, date, and status.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">

                    <th className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Batch ID
                    </th>

                    <th className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Medicine
                    </th>

                    <th className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Destination
                    </th>

                    <th className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {transfers.map((transfer) => (

                    <tr
                      key={transfer.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50 last:border-0"
                    >

                      <td className="px-7 py-5">

                        <Link
                          href={`/batch/${transfer.batchId}`}
                          className="font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
                        >
                          {transfer.batchId}
                        </Link>

                      </td>

                      <td className="px-7 py-5 text-sm font-medium text-slate-700">
                        {transfer.medicine}
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-600">
                        {transfer.destination}
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-500">
                        {transfer.date}
                      </td>

                      <td className="px-7 py-5">

                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                          {transfer.status}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* Footer Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>

          MedTrace Supply Chain Management

          <span>•</span>

          Secure medicine movement tracking

        </div>

      </div>
    </main>
  );
}