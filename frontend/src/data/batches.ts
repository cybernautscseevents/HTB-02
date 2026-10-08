export type JourneyStep = {
  role: string;
  name: string;
  location: string;
  date: string;
  action: string;
};

export type Batch = {
  batchId: string;
  medicine: string;
  manufacturer: string;
  quantity: string;
  manufactured: string;
  expiry: string;
  status: "VERIFIED" | "EXPIRED";
  journey: JourneyStep[];
};

const batches: Record<string, Batch> = {
  "MED-001": {
    batchId: "MED-001",
    medicine: "Paracetamol 500mg",
    manufacturer: "ABC Pharmaceuticals",
    quantity: "5,000 units",
    manufactured: "08 October 2026",
    expiry: "08 October 2028",
    status: "VERIFIED",

    journey: [
      {
        role: "Manufacturer",
        name: "ABC Pharmaceuticals",
        location: "Bengaluru",
        date: "08 October 2026",
        action: "Batch manufactured",
      },
      {
        role: "Distributor",
        name: "XYZ Distributors",
        location: "Mangaluru",
        date: "09 October 2026",
        action: "Shipment received",
      },
      {
        role: "Pharmacy",
        name: "City Care Pharmacy",
        location: "Mangaluru",
        date: "10 October 2026",
        action: "Batch received",
      },
    ],
  },

  "EXP-001": {
    batchId: "EXP-001",
    medicine: "Amoxicillin 500mg",
    manufacturer: "ABC Pharmaceuticals",
    quantity: "3,000 units",
    manufactured: "01 January 2024",
    expiry: "01 January 2025",
    status: "EXPIRED",

    journey: [
      {
        role: "Manufacturer",
        name: "ABC Pharmaceuticals",
        location: "Bengaluru",
        date: "01 January 2024",
        action: "Batch manufactured",
      },
      {
        role: "Distributor",
        name: "XYZ Distributors",
        location: "Mangaluru",
        date: "03 January 2024",
        action: "Shipment received",
      },
      {
        role: "Pharmacy",
        name: "City Care Pharmacy",
        location: "Mangaluru",
        date: "05 January 2024",
        action: "Batch received",
      },
    ],
  },
};

export default batches;