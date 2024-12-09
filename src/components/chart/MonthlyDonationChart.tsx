"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import Chart from "chart.js/auto";

const fetchMonthlyDonations = async (): Promise<number> => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const donationsQuery = query(
      collection(db, "donations"),
      where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth)),
      where("createdAt", "<=", Timestamp.fromDate(lastDayOfMonth))
    );

    const snapshot = await getDocs(donationsQuery);
    let totalWeight = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalWeight += data.weight || 0;
    });

    return totalWeight;
  } catch (error) {
    console.error("Error fetching donation data:", error);
    return 0;
  }
};

const MonthlyDonationChart = () => {
  const [donationData, setDonationData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const loadChartData = async () => {
      const totalWeight = await fetchMonthlyDonations();

      const now = new Date();
      setLabels([`${now.getMonth() + 1}-${now.getFullYear()}`]); // Example: "12-2024"
      setDonationData([totalWeight]);
    };

    loadChartData();
  }, []);

  useEffect(() => {
    if (donationData.length > 0) {
      const ctx = document.getElementById("donationChart") as HTMLCanvasElement;

      // Create gradient for the chart line
      const gradient = ctx.getContext("2d")?.createLinearGradient(0, 0, 0, 400);
      gradient?.addColorStop(0, "rgba(10, 70, 53, 0.8)");
      gradient?.addColorStop(1, "rgba(10, 70, 53, 0.2)");

      new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Total Weight Donated (kg)",
              data: donationData,
              fill: true,
              backgroundColor: gradient,
              borderColor: "rgba(10, 70, 53, 1)",
              borderWidth: 2,
              tension: 0.4, // Smoother line
              pointBackgroundColor: "rgba(10, 70, 53, 1)",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: "#0A4635",
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(10, 70, 53, 0.9)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "rgba(10, 70, 53, 1)",
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#0A4635",
              },
              grid: {
                color: "rgba(10, 70, 53, 0.2)",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: "#0A4635",
              },
              grid: {
                color: "rgba(10, 70, 53, 0.2)",
              },
            },
          },
          animation: {
            duration: 1000,
            easing: "easeInOutQuad",
          },
        },
      });
    }
  }, [donationData, labels]);

  return (
    <div>
      <canvas id="donationChart" width={400} height={200}></canvas>
    </div>
  );
};

export default MonthlyDonationChart;
