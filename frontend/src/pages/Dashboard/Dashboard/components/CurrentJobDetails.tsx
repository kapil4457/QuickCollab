import { useAppSelector } from "@/store/hooks";
import { selectCurrentJobDetails } from "@/store/slices/userSlice";
import { formatDate } from "@/utils/generalUtils";
import { Card, CardBody, CardHeader } from "@heroui/card";
import React from "react";

const CurrentJobDetails = () => {
  const currentJobDetails = useAppSelector(selectCurrentJobDetails);
  return (
    <Card className="border border-gray-300 shadow-md rounded-xl p-6">
      <CardHeader className="text-xl font-semibold border-b pb-3">
        Current Job Details
      </CardHeader>
      <CardBody className="space-y-4 mt-3">
        {[
          {
            label: "Job Designation",
            value: currentJobDetails?.title,
          },
          {
            label: "Job Location",
            value: currentJobDetails?.location,
          },
          {
            label: "Job Type",
            value: currentJobDetails?.locationType,
          },
          {
            label: "Current Salary (USD)",
            value: `$${currentJobDetails?.salary}`,
          },
          {
            label: "Joining Date",
            value: formatDate(currentJobDetails?.startDate?.toString() || ""),
          },
        ].map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="font-bold text-gray-600">
              {item.value || "N/A"}
            </span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default CurrentJobDetails;
