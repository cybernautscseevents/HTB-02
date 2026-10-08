"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const savedBatches = localStorage.getItem("medtrace_batches");

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
  }, []);

  const activeBatches = batches.filter(
    (batch) => batch.status === "ACTIVE"
  ).length;

  const expiredBatches = batches.filter(
    (batch) => batch.status === "EXPIRED"
  ).length;

  const totalUnits = batches.reduce(
    (total, batch) => total + Number(batch.quantity || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      {/* Top Navigation */}
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
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-8">
        {/* Heading */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Inventory Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B1F3A]">
            Medicine Batches
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage all medicine batches registered in MedTrace.
          </p>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">
              Total Batches
            </p>

            <p className="mt-3 text-4xl font-bold text-[#0B1F3A]">
              {batches.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">
              Active Batches
            </p>

            <p className="mt-3 text-4xl font-bold text-emerald-600">
              {activeBatches}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">
              Expired Batches
            </p>

            <p className="mt-3 text-4xl font-bold text-red-500">
              {expiredBatches}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">
              Total Units
            </p>

            <p className="mt-3 text-4xl font-bold text-cyan-600">
              {totalUnits.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Batch Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                All Batches
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a batch to view its complete details.
              </p>
            </div>

            <Link
              href="/"
              className="rounded-lg bg-[#0B1F3A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              + Create Batch
            </Link>
          </div>

          {batches.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📦
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No batches found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first medicine batch from the dashboard.
              </p>

              <Link
                href="/"
                className="mt-5 inline-block rounded-lg bg-[#0B1F3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Batch ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Medicine
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Expiry
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Destination
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {batches.map((batch) => (
                    <tr
                      key={batch.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/batch/${batch.id}`}
                          className="font-semibold text-cyan-600 hover:text-cyan-700 hover:underline"
                        >
                          {batch.id}
                        </Link>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-800">
                          {batch.medicine}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {Number(batch.quantity || 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {batch.expiryDate || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            batch.status === "EXPIRED"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {batch.destination || "Manufacturer"}
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/batch/${batch.id}`}
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0B1F3A] transition hover:border-cyan-300 hover:bg-cyan-50"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 px-5 py-4">
          <p className="text-sm text-cyan-800">
            <span className="font-semibold">MedTrace:</span> Batch information
            is currently stored locally for development. Backend and blockchain
            integration will be connected later.
          </p>
        </div>
      </div>
    </main>
  );
}