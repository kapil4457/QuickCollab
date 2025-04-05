import { UserProfileJobHistoryDTO } from "@/store/dtos/helper";
import { formatDate } from "@/utils/generalUtils";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";

const CurrentJobDetails = ({
  currentJobDetails,
  isServingNoticePeriod,
  noticePeriodInDays = 0,
  noticePeriodEndDate,
}: {
  currentJobDetails: UserProfileJobHistoryDTO;
  isServingNoticePeriod: boolean;
  noticePeriodInDays: number;
  noticePeriodEndDate: Date;
}) => {
  if (!currentJobDetails || isServingNoticePeriod === null) return;
  return (
    <Card className="border border-gray-300 w-full  shadow-md rounded-xl p-6 h-full">
      <CardHeader className="text-xl font-semibold border-b pb-3">
        Current Job Details
      </CardHeader>
      <CardBody className="space-y-4 mt-3">
        {[
          {
            label: "Reports to",
            value:
              currentJobDetails?.reportingUser?.firstName +
              " " +
              currentJobDetails?.reportingUser?.lastName,
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
            label: "Joining Date",
            value: formatDate(currentJobDetails?.startDate?.toString() || ""),
          },
          {
            label: "Notice Period (in days)",
            value: noticePeriodInDays,
          },
          {
            label: "Notice Period End Date",
            value: noticePeriodEndDate
              ? formatDate(noticePeriodEndDate.toString())
              : "N/A",
          },
          {
            label: "Is Serving Notice Period",
            value: isServingNoticePeriod ? "YES" : "NO",
          },
        ].map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">{item.label}</span>
            {item?.label === "Reports to" ? (
              <Link
                href={"/profile/" + currentJobDetails?.reportingUser?.userId}
                className="text-sm font-semibold text-blue-400"
              >
                @{item?.value}
              </Link>
            ) : (
              <span className="font-bold text-gray-600">
                {item.value || "N/A"}
              </span>
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default CurrentJobDetails;
