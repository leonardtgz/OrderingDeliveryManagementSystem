const DEMO_ORDERS = [
  {
    id: "demo-order-001",
    orderNumber: "#ORD-1001",
    customerName: "Maria Santos",
    contactNumber: "0917-555-0192",
    deliveryAddress: [
      "Block 4, Lot 12, Phase 2",
      "Sunnyvale Subdivision",
      "Brgy. San Jose, Antipolo",
    ],
    deliveryAddressLines: [
      "Block 4, Lot 12, Phase 2",
      "Sunnyvale Subdivision",
      "Brgy. San Jose, Antipolo",
    ],
    deliveryDate: "Today",
    deliveryTime: "6:00 PM - 9:00 PM",
    deliverySchedule: "Today, 6:00 PM - 9:00 PM",
    products: [
      {
        id: "slim-gallon",
        name: "Slim Gallon Refill",
        quantity: 2,
        price: 25,
        total: 50,
      },
      {
        id: "round-gallon",
        name: "Round Gallon Refill",
        quantity: 2,
        price: 25,
        total: 50,
      },
    ],
    subtotal: 100,
    deliveryFee: 20,
    total: 120,
    status: "Out for Delivery",
    notes: "Please deliver before 9:00 PM.",
    createdAt: "2026-09-24T08:30:00.000Z",
    updatedAt: "2026-09-24T09:15:00.000Z",
  },

  {
    id: "demo-order-002",
    orderNumber: "#ORD-1002",
    customerName: "Maria Santos",
    contactNumber: "0917-555-0192",
    deliveryAddress: [
      "Block 4, Lot 12, Phase 2",
      "Sunnyvale Subdivision",
      "Brgy. San Jose, Antipolo",
    ],
    deliveryAddressLines: [
      "Block 4, Lot 12, Phase 2",
      "Sunnyvale Subdivision",
      "Brgy. San Jose, Antipolo",
    ],
    deliveryDate: "September 20, 2026",
    deliveryTime: "2:00 PM - 5:00 PM",
    deliverySchedule: "September 20, 2026",
    products: [
      {
        id: "bottle-500ml",
        name: "500ml Bottle (Case of 24)",
        quantity: 1,
        price: 240,
        total: 240,
      },
    ],
    subtotal: 240,
    deliveryFee: 20,
    total: 260,
    status: "Delivered",
    notes: "",
    createdAt: "2026-09-20T06:00:00.000Z",
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
];

const DEMO_ACTIVITY_LOGS = [
  {
    id: "demo-activity-001",
    role: "Admin",
    userName: "Admin User",
    action: "Updated delivery status for #ORD-1001",
    timestamp: "2026-09-24T09:15:00.000Z",
  },
  {
    id: "demo-activity-002",
    role: "Customer",
    userName: "Maria Santos",
    action: "Placed order #ORD-1001",
    timestamp: "2026-09-24T08:30:00.000Z",
  },
];

const DEMO_CUSTOMER_PROFILE = {
  name: "Maria Santos",
  contact: "0917-555-0192",
  email: "maria.santos@example.com",
  address: "Block 4, Lot 12, Phase 2, Sunnyvale Subdivision, Brgy. San Jose, Antipolo",
  role: "Customer",
  status: "Active",
};

const DEMO_ADMIN_PROFILE = {
  name: "Admin User",
  contact: "0917-000-0000",
  email: "admin@goldenpr.com",
  address: "GoldenPR Water Refilling Station",
  role: "Admin",
  status: "Active",
};

const seedOrders = () => {
  const existingOrders = localStorage.getItem("goldenpr_orders");

  if (existingOrders) {
    try {
      const parsedOrders = JSON.parse(existingOrders);

      if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
        return;
      }
    } catch {
      // Invalid data will be replaced with demo data.
    }
  }

  localStorage.setItem(
    "goldenpr_orders",
    JSON.stringify(DEMO_ORDERS),
  );
};

const seedActivityLogs = () => {
  const existingLogs = localStorage.getItem(
    "goldenpr_activity_log",
  );

  if (existingLogs) {
    try {
      const parsedLogs = JSON.parse(existingLogs);

      if (Array.isArray(parsedLogs) && parsedLogs.length > 0) {
        return;
      }
    } catch {
      // Invalid data will be replaced with demo data.
    }
  }

  localStorage.setItem(
    "goldenpr_activity_log",
    JSON.stringify(DEMO_ACTIVITY_LOGS),
  );
};

const seedCustomerProfile = () => {
  const existingProfile =
    localStorage.getItem("goldenpr_profile");

  if (existingProfile) {
    return;
  }

  localStorage.setItem(
    "goldenpr_profile",
    JSON.stringify(DEMO_CUSTOMER_PROFILE),
  );
};

const seedAdminProfile = () => {
  const existingProfile =
    localStorage.getItem("goldenpr_admin_profile");

  if (existingProfile) {
    return;
  }

  localStorage.setItem(
    "goldenpr_admin_profile",
    JSON.stringify(DEMO_ADMIN_PROFILE),
  );
};

const seedCurrentOrder = () => {
  const existingCurrentOrder = localStorage.getItem(
    "goldenpr_current_order",
  );

  if (existingCurrentOrder) {
    return;
  }

  localStorage.setItem(
    "goldenpr_current_order",
    JSON.stringify(DEMO_ORDERS[0]),
  );
};

export const seedDemoData = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    seedOrders();
    seedActivityLogs();
    seedCustomerProfile();
    seedAdminProfile();
    seedCurrentOrder();
  } catch (error) {
    console.error(
      "Failed to seed GoldenPR demo data:",
      error,
    );
  }
};

export {
  DEMO_ORDERS,
  DEMO_ACTIVITY_LOGS,
  DEMO_CUSTOMER_PROFILE,
  DEMO_ADMIN_PROFILE,
};