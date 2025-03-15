import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { PlusIcon } from "../../PostedJobs/PostedJobs";

const MyProjects = () => {
  return (
    <Card className="border border-gray-300 shadow-md rounded-xl p-6 w-full">
      <CardHeader className="text-xl font-semibold border-b pb-3 flex w-full justify-between">
        My Projects
        <Button className="font-bold" size="md">
          Create New <PlusIcon className="text-sm" />
        </Button>
      </CardHeader>
      <CardBody className="space-y-5 mt-4"></CardBody>
    </Card>
  );
};

export default MyProjects;
