import { Card, CardBody, CardHeader } from "@heroui/card";
import { PersonalProject } from "@/store/dtos/helper";
import ProjectCard from "./ProjectCard";

const PersonalProjects = ({ projects }: { projects: PersonalProject[] }) => {
  return (
    <>
      <Card className="border border-gray-300 shadow-md rounded-xl p-6 w-full">
        <CardHeader className="text-xl font-semibold border-b pb-3 flex w-full justify-between">
          Personal Projects
        </CardHeader>
        <CardBody className="flex-wrap gap-5 flex flex-row items-center ">
          {projects?.map((project) => {
            return <ProjectCard project={project} />;
          })}
        </CardBody>
      </Card>
    </>
  );
};

export default PersonalProjects;
