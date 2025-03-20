import { useAppSelector } from "@/store/hooks";
import {
  selectEmployeesCount,
  selectEmployeesOnNoticePeriodCount,
  selectTotalSalaryPaid,
} from "@/store/slices/userSlice";
import { Card, CardHeader, CardBody } from "@heroui/card";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const EmployeeStats = () => {
  const employeeCount = useAppSelector(selectEmployeesCount);
  const employeeOnNoticePeriodCount = useAppSelector(
    selectEmployeesOnNoticePeriodCount
  );
  const totalSalaryPaid = useAppSelector(selectTotalSalaryPaid);

  const chartData = [
    {
      onNoticePeriod: employeeOnNoticePeriodCount,
      notOnNoticePeriod: employeeCount - employeeOnNoticePeriodCount,
    },
  ];
  const chartConfig = {
    onNoticePeriod: {
      label: "Resigned",
      color: "red",
    },
    notOnNoticePeriod: {
      label: "Not Resigned",
      color: "green",
    },
  } satisfies ChartConfig;
  return (
    <Card className="border border-gray-300 shadow-md  flex-1 w-full  rounded-xl p-6  min-h-full overflow-auto">
      <CardHeader className="text-xl font-semibold border-b pb-3">
        Employee Stats
      </CardHeader>
      <CardBody className="space-y-5 mt-4 min-h-full">
        <div className="text-gray-600 font-bold">
          <span>Number of Employees : </span>
          <span>{employeeCount}</span>
        </div>
        <div>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={90}
              outerRadius={150}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            ${totalSalaryPaid}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Total Salary paid annually
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="onNoticePeriod"
                stackId="a"
                cornerRadius={5}
                fill="red"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="notOnNoticePeriod"
                fill="green"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default EmployeeStats;
