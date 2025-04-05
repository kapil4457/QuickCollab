import { JobHistory, UserProfileJobHistoryDTO } from "@/store/dtos/helper";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentJobDetails } from "@/store/slices/userSlice";
import { getYearAndMonth } from "@/utils/generalUtils";
import { useMemo } from "react";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";

const JobHistoryTimeline = ({
  jobHistory,
  currJobDetails,
}: {
  jobHistory: UserProfileJobHistoryDTO[];
  currJobDetails: UserProfileJobHistoryDTO;
}) => {
  const items = useMemo(() => {
    let allJobHistory = [];
    if (currJobDetails != null) {
      allJobHistory.push(currJobDetails);
    }
    allJobHistory.concat(jobHistory);
    return allJobHistory;
  }, [jobHistory, currJobDetails]);
  return (
    <Card className="border border-gray-300 shadow-md rounded-xl p-6 w-full h-full overflow-x-hidden flex flex-col gap-3 flex-1 min-h-[20rem] overflow-auto">
      <CardHeader className="text-xl font-semibold border-b pb-3">
        Job History
      </CardHeader>
      <CardBody className="space-y-5 mt-4">
        {/* <h1 className="w-full font-bold text-3xl text-center"></h1> */}
        <Timeline
          className="w-full"
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.2,
            },
          }}
        >
          {items?.length > 0 ? (
            items?.map((history) => {
              console.log("history : ", history);
              return (
                <TimelineItem>
                  <TimelineOppositeContent>
                    <span className="text-sm w-full">
                      {`${getYearAndMonth(
                        history?.startDate || new Date()
                      )} - ${history?.endDate ? getYearAndMonth(new Date(history?.endDate)) : "Present"}`}
                    </span>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent className="flex flex-col gap-2">
                    <div className="flex flex-col gap-[0.1rem]">
                      <h2 className="font-bold">{history?.title}</h2>
                      <Link
                        href={`/profile/${history?.reportingUser?.userId}`}
                        className="text-sm font-semibold text-blue-400"
                      >
                        @{history?.reportingUser?.firstName}{" "}
                        {history?.reportingUser?.lastName}
                      </Link>
                      <span className="text-xs">
                        {history?.location} ( {history?.locationType} )
                      </span>
                    </div>
                    {/* <h3 className="font-light text-sm text-gray-400">
                      {history?.description}
                    </h3> */}
                  </TimelineContent>
                </TimelineItem>
              );
            })
          ) : (
            <span className="font-semibold text-xl text-center w-full">
              No Job History Exists
            </span>
          )}
        </Timeline>
      </CardBody>
    </Card>
  );
};

export default JobHistoryTimeline;
