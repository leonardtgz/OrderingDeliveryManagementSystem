import React from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import Header from "../../../components/Header/Header";

import StatisticsGrid from "./StatisticsGrid";
import RecentOrders from "./RecentOrders";
import DeliverySchedule from "./DeliverySchedule";

const Dashboard = () => {
  return (
    <main className="flex min-h-screen w-full bg-background-main">
      {/* ================= ADMIN SIDEBAR ================= */}
      <AdminSidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* ================= SHARED HEADER ================= */}
        <Header />

        {/* ================= DASHBOARD CONTENT ================= */}
        <div className="flex-1 overflow-y-auto bg-background-main px-4 py-6 sm:px-6 sm:py-8 lg:px-10xl lg:py-10xl">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10xl">

              {/* ================= PAGE TITLE ================= */}
              <section className="flex flex-col gap-xs">
                <h2 className="text-[20px] font-bold leading-[25px] text-text-secondary sm:text-[26px] sm:leading-[32px] lg:text-lg lg:leading-2xl">
                  Dashboard Overview
                </h2>

                <p className="text-sm font-normal leading-sm text-text-accent">
                  Real-time metrics for Golden-PR operations.
                </p>
              </section>

              {/* ================= STATISTICS ================= */}
              <StatisticsGrid />

              {/* ================= RECENT ORDERS + DELIVERY ================= */}
              <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-10xl">
                <RecentOrders />
                <DeliverySchedule />
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;