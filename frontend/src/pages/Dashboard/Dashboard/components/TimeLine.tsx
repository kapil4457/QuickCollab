import { JobHistory } from "@/store/dtos/helper";
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

const TimeLine = ({ jobHistory }: { jobHistory: JobHistory[] }) => {
  const currJobDetails = useAppSelector(selectCurrentJobDetails);
  const items = useMemo(() => {
    let allJobHistory = [];
    const currentJobDetail = { ...currJobDetails, endDate: new Date() };
    if (currentJobDetail != null) {
      allJobHistory.push(currentJobDetail);
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
              return (
                <TimelineItem>
                  <TimelineOppositeContent>
                    <span className="text-sm w-full">
                      {`${getYearAndMonth(
                        history?.startDate || new Date()
                      )} - ${getYearAndMonth(new Date(history?.endDate) || new Date())}`}
                    </span>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent className="flex flex-col gap-2">
                    <div className="flex flex-col gap-[0.1rem]">
                      <h2 className="font-bold">{history?.title}</h2>
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

export default TimeLine;
