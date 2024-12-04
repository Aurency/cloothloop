import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen flex flex-col justify-start space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#0A4635] text-left">
        Activity
      </h1>

      {/* Card 1: Submission */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">
          Submission
        </h2>
        <p className="text-sm text-gray-600">
          Manage your submission details and track the status of your requests.
        </p>
      </div>

      {/* Card 2: Delivery */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">
          Delivery
        </h2>
        <div className="text-sm text-gray-600 space-y-4">
          <p>
            <span className="font-medium">Recipient Name:</span> John Doe
          </p>
          <p>
            <span className="font-medium">Delivery Address:</span> Jl. Raya No.123, Jakarta, Indonesia
          </p>
          <p>
            <span className="font-medium">Estimated Delivery Time:</span> 2-3 Business Days
          </p>
        </div>
      </div>

      {/* Card 3: History */}
      <div className="bg-white p-6 rounded-md  shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">
          History
        </h2>
        <p className="text-sm text-gray-600">
          View your previous orders and delivery history.
        </p>
      </div>
    </div>
  );
}
