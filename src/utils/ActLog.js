const ACTIVITY_LOG_KEY = "goldenpr_activity_log";

export const getActivityLogs = () => {
  try {
    const savedLogs = localStorage.getItem(ACTIVITY_LOG_KEY);

    if (!savedLogs) {
      return [];
    }

    const logs = JSON.parse(savedLogs);

    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error("Failed to load activity logs:", error);
    return [];
  }
};

export const addActivityLog = ({
  role,
  userName,
  action,
}) => {
  const logs = getActivityLogs();

  const newLog = {
    id: crypto.randomUUID(),
    role: role || "Customer",
    userName: userName || "Unknown User",
    action: action || "Performed an action",
    timestamp: new Date().toISOString(),
  };

  const updatedLogs = [
    newLog,
    ...logs,
  ].slice(0, 100);

  localStorage.setItem(
    ACTIVITY_LOG_KEY,
    JSON.stringify(updatedLogs)
  );

  window.dispatchEvent(
    new Event("activityLogUpdated")
  );

  return newLog;
};

export const clearActivityLogs = () => {
  localStorage.removeItem(ACTIVITY_LOG_KEY);

  window.dispatchEvent(
    new Event("activityLogUpdated")
  );
};

export { ACTIVITY_LOG_KEY };