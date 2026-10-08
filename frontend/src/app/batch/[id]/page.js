"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function BatchDetails({ params }) {
  const { id } = use(params);

  const [batch, setBatch] = useState(null);

  useEffect(() => {
    const savedBatches = localStorage.getItem("medtrace_batches");

    if (savedBatches) {
      try {
        const batches = JSON.parse(savedBatches);

        if (Array.isArray(batches)) {
          const foundBatch = batches.find(
            (item) => item.id === id
          );

          if (foundBatch) {
            setBatch(foundBatch);
          }
        }
      } catch (error) {
        console.error("Could not load batch:", error);
      }
    }
  }, [id]);

  if (!batch) {
    return (
      <main className="min-h-screen bg-[#F4F7FB]">
        <header className="border-b border-slate-200 bg-white">
          <div className="px-8 py-5">
            <Link
              href="/"
              className="text-2xl font-bold tracking-wide text-[#0B1F3A]"
            >
              MED<span className="text-cyan-500">TRACE</span>
            </Link>

            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              Medicine Supply Chain
            </p>
          </div>
        </header>

        <div className="flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📦
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#0B1F3A]">
              Loading batch details...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we retrieve the batch information.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const statusIsExpired = batch.status === "EXPIRED";

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-8 py-5">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-wide text-[#0B1F3A]"
            >
              MED<span className="text-cyan-500">TRACE</span>
            </Link>

            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              Medicine Supply Chain
            </p>
          </div>

          <Link
            href="/batches"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← All Batches
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
          >
            Dashboard
          </Link>

          <span className="mx-2 text-slate-400">/</span>

          <Link
            href="/batches"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
          >
            Batches
          </Link>

          <span className="mx-2 text-slate-400">/</span>

          <span className="text-sm text-slate-500">
            {batch.id}
          </span>
        </div>

        {/* Batch Header */}
        <div className="rounded-2xl bg-[#0B1F3A] p-8 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-cyan-300">
                Medicine Batch
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                {batch.medicine}
              </h1>

              <p className="mt-2 font-mono text-sm text-slate-300">
                {batch.id}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                statusIsExpired
                  ? "bg-red-500/20 text-red-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {statusIsExpired ? "● EXPIRED" : "● ACTIVE"}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Quantity
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-lg">
                📦
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-[#0B1F3A]">
              {Number(batch.quantity || 0).toLocaleString()}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Units
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Current Owner
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                🏢
              </div>
            </div>

            <p className="mt-4 text-xl font-bold text-[#0B1F3A]">
              {batch.owner || batch.destination || "Manufacturer"}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Current custodian
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Expiry Date
              </p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${
                  statusIsExpired
                    ? "bg-red-50"
                    : "bg-emerald-50"
                }`}
              >
                📅
              </div>
            </div>

            <p
              className={`mt-4 text-xl font-bold ${
                statusIsExpired
                  ? "text-red-600"
                  : "text-[#0B1F3A]"
              }`}
            >
              {batch.expiryDate || batch.expiry || "—"}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Expiration date
            </p>
          </div>
        </div>

        {/* Batch Information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              Batch Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete information recorded for this medicine batch.
            </p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Medicine
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {batch.medicine}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Batch ID
              </p>

              <p className="mt-2 font-mono font-semibold text-slate-800">
                {batch.id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Manufacturer
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {batch.manufacturer || "ABC Pharmaceuticals"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Manufacturing Date
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {batch.manufacturingDate || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Expiry Date
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {batch.expiryDate || batch.expiry || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Destination
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {batch.destination || "Manufacturer"}
              </p>
            </div>
          </div>
        </div>

        {/* Supply Chain */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              Supply Chain Journey
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track the movement of this batch through the supply chain.
            </p>
          </div>

          <div className="p-6">
            {/* Manufactured */}
            <div className="relative flex gap-5 pb-8">
              <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                ✓
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Step 1
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#0B1F3A]">
                  Manufactured
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Batch created by{" "}
                  {batch.manufacturer || "ABC Pharmaceuticals"}.
                </p>

                {batch.manufacturingDate && (
                  <p className="mt-2 text-xs text-slate-400">
                    {batch.manufacturingDate}
                  </p>
                )}
              </div>

              <div className="absolute left-[21px] top-11 h-full w-px bg-slate-200" />
            </div>

            {/* Distributor */}
            <div className="relative flex gap-5 pb-8">
              <div
                className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold ${
                  batch.destination || batch.owner
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {batch.destination || batch.owner ? "✓" : "2"}
              </div>

              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    batch.destination || batch.owner
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  Step 2
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#0B1F3A]">
                  Distributor
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {batch.destination || batch.owner
                    ? `Current destination: ${
                        batch.destination || batch.owner
                      }`
                    : "Waiting for transfer to distributor."}
                </p>
              </div>

              <div className="absolute left-[21px] top-11 h-full w-px bg-slate-200" />
            </div>

            {/* Pharmacy */}
            <div className="flex gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-400">
                3
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Step 3
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#0B1F3A]">
                  Pharmacy
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Waiting for the batch to reach a pharmacy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Verification */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-[#0B1F3A] shadow-lg">
          <div className="p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  Blockchain
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Blockchain Verification
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  This batch is registered on the blockchain and can
                  be verified using its unique batch ID.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                🔗
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Blockchain Status
                </p>

                <p className="mt-2 font-semibold text-emerald-400">
                  ✓ Verified
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Batch Reference
                </p>

                <p className="mt-2 font-mono text-sm font-semibold text-white">
                  {batch.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 px-5 py-4">
          <p className="text-sm text-cyan-800">
            <span className="font-semibold">MedTrace:</span>{" "}
            Blockchain verification is currently represented as a
            frontend demonstration. Smart contract integration will
            be connected with the blockchain module later.
          </p>
        </div>
      </div>
    </main>
  );
}