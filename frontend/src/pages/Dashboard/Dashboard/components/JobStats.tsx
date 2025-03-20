import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { JobStatus } from "@/utils/enums";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useAppSelector } from "@/store/hooks";
import { selectPostedJobs } from "@/store/slices/userSlice";

const JobStats = () => {
  const postedJobs = useAppSelector(selectPostedJobs);
  const chartData = [
    {
      status: JobStatus.ACTIVE,
      count:
        postedJobs?.filter((job) => job?.jobStatus === JobStatus.ACTIVE)
          ?.length || 0,
    },
    {
      status: JobStatus.INACTIVE,
      count:
        postedJobs?.filter((job) => job?.jobStatus === JobStatus.INACTIVE)
          ?.length || 0,
    },
    {
      status: JobStatus.EXPIRED,
      count:
        postedJobs?.filter((job) => job?.jobStatus === JobStatus.EXPIRED)
          ?.length || 0,
    },
    {
      status: JobStatus.FILLED,
      count:
        postedJobs?.filter((job) => job?.jobStatus === JobStatus.FILLED)
          ?.length || 0,
    },
  ];
  const chartConfig = {
    count: {
      label: "Count",
      color: "blue",
    },
  } satisfies ChartConfig;
  return (
    <>
      <Card className="border border-gray-300 shadow-md  flex-1 w-full  rounded-xl p-6  min-h-[15rem] overflow-auto">
        <CardHeader className="text-xl font-semibold border-b pb-3 flex w-full justify-between">
          Posted Jobs Stats
        </CardHeader>
        <CardBody className="space-y-5 mt-4 min-h-full">
          <ChartContainer config={chartConfig} className="max-h-[20rem]">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="status"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="blue" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardBody>
      </Card>
    </>
  );
};

export default JobStats;
