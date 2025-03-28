import { useAppSelector } from "@/store/hooks";
import {
  selectCurrentJobDetails,
  selectLoggedInUser,
  selectNoticePeriodEndDate,
  selectReportsTo,
} from "@/store/slices/userSlice";
import { formatDate } from "@/utils/generalUtils";
import { Card, CardBody, CardHeader } from "@heroui/card";

const CurrentJobDetails = () => {
  const currentJobDetails = useAppSelector(selectCurrentJobDetails);
  const user = useAppSelector(selectLoggedInUser);
  const reportsTo = useAppSelector(selectReportsTo);
  const noticePeriodEndDate = useAppSelector(selectNoticePeriodEndDate);
  return (
    <Card className="border border-gray-300 w-full  shadow-md rounded-xl p-6 h-full">
      <CardHeader className="text-xl font-semibold border-b pb-3">
        Current Job Details
      </CardHeader>
      <CardBody className="space-y-4 mt-3">
        {[
          {
            label: "Reports to",
            value: reportsTo?.firstName + " " + reportsTo?.lastName,
          },
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
          {
            label: "Notice Period (in days)",
            value: user?.currentJobNoticePeriodDays,
          },
          {
            label: "Notice Period End Date",
            value: noticePeriodEndDate
              ? formatDate(noticePeriodEndDate.toString())
              : "N/A",
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
