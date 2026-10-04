const ORDERS_KEY = "goldenpr_orders";
const CURRENT_ORDER_KEY = "goldenpr_current_order";

export const getOrders = () => {
  try {
    const savedOrders = localStorage.getItem(ORDERS_KEY);

    if (!savedOrders) {
      return [];
    }

    const orders = JSON.parse(savedOrders);

    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Failed to load orders:", error);
    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders),
  );

  window.dispatchEvent(
    new Event("ordersUpdated"),
  );

  window.dispatchEvent(
    new Event("orderUpdated"),
  );
};

export const addOrder = (order) => {
  const orders = getOrders();
  const now = new Date().toISOString();

  // Always create a completely new internal ID
  // for every newly confirmed order.
  const uniqueId = `order-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  // Generate a unique customer-facing order number.
  let orderNumber;

  do {
    orderNumber = `ORD-${Math.floor(
      100000 + Math.random() * 900000,
    )}`;
  } while (
    orders.some(
      (existingOrder) =>
        String(existingOrder.orderNumber) ===
        String(orderNumber),
    )
  );

  const newOrder = {
    ...order,

    // Do NOT reuse the ID/order number from
    // the previous/current order.
    id: uniqueId,
    orderNumber,

    createdAt:
      order.createdAt || now,

    updatedAt: now,
  };

  const updatedOrders = [
    ...orders,
    newOrder,
  ];

  saveOrders(updatedOrders);

  return newOrder;
};

export const updateOrder = (
  orderId,
  changes,
) => {
  const orders = getOrders();

  const updatedOrders = orders.map(
    (order) => {
      const matchesId =
        String(order.id) ===
        String(orderId);

      const matchesOrderNumber =
        String(order.orderNumber) ===
        String(orderId);

      if (
        matchesId ||
        matchesOrderNumber
      ) {
        return {
          ...order,
          ...changes,
          updatedAt:
            new Date().toISOString(),
        };
      }

      return order;
    },
  );

  saveOrders(updatedOrders);

  return updatedOrders;
};

export const getCurrentOrder = () => {
  try {
    const savedOrder =
      localStorage.getItem(
        CURRENT_ORDER_KEY,
      );

    if (!savedOrder) {
      return null;
    }

    return JSON.parse(savedOrder);
  } catch (error) {
    console.error(
      "Failed to load current order:",
      error,
    );

    return null;
  }
};

export const saveCurrentOrder = (
  order,
) => {
  localStorage.setItem(
    CURRENT_ORDER_KEY,
    JSON.stringify(order),
  );
};

export const clearCurrentOrder = () => {
  localStorage.removeItem(
    CURRENT_ORDER_KEY,
  );
};