import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card as ShadCnCard,
  CardContent as ShadCnCardContent,
  CardDescription as ShadCnCardDescription,
  CardHeader as ShadCnCardHeader,
  CardTitle as ShadCnCardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const EmployeeStats = () => {
  return (
    <Card className="border border-gray-300 shadow-md rounded-xl p-6">
      <CardHeader className="text-xl font-semibold border-b pb-3">
        Employee Stats
      </CardHeader>
      <CardBody className="space-y-5 mt-4">
        <div className="text-gray-600 font-bold">
          <span>Number of Employees : </span>
          <span>0</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default EmployeeStats;
