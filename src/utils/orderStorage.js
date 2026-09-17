const ORDERS_KEY = "goldenpr_orders";
const CURRENT_ORDER_KEY = "goldenpr_current_order";

export const getOrders = () => {
  try {
    const savedOrders =
      localStorage.getItem(ORDERS_KEY);

    if (!savedOrders) {
      return [];
    }

    const orders = JSON.parse(savedOrders);

    return Array.isArray(orders)
      ? orders
      : [];
  } catch (error) {
    console.error(
      "Failed to load orders:",
      error,
    );

    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders),
  );

  // Notify all pages in the same application.
  window.dispatchEvent(
    new Event("ordersUpdated"),
  );

  window.dispatchEvent(
    new Event("orderUpdated"),
  );
};

export const addOrder = (order) => {
  const orders = getOrders();

  const now =
    new Date().toISOString();

  const newOrder = {
    ...order,

    createdAt:
      order.createdAt || now,

    updatedAt:
      order.updatedAt || now,
  };

  const updatedOrders = [
    ...orders,
    newOrder,
  ];

  saveOrders(updatedOrders);

  return updatedOrders;
};

export const updateOrder = (
  orderId,
  changes,
) => {
  const orders = getOrders();

  const updatedOrders =
    orders.map((order) => {
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
    });

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