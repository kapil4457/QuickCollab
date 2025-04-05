import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { PlusIcon } from "../../PostedJobs/PostedJobs";
import AddEditProjectModal from "./AddEditProjectModal";
import { useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectPersonalProjects } from "@/store/slices/userSlice";
import ProjectCard from "@/components/ProjectCard";
import { ProjectDetailsRequestDTO } from "@/store/dtos/request/projectDetailsRequestDTO";

const MyProjects = () => {
  const addEditProjectModalRef = useRef();
  const personalProjects = useAppSelector(selectPersonalProjects);
  const openAddEditProjectModal = () => {
    if (
      addEditProjectModalRef.current &&
      "openModal" in addEditProjectModalRef.current
    ) {
      (addEditProjectModalRef.current as { openModal: () => void }).openModal();
    }
  };

  return (
    <>
      <AddEditProjectModal
        ref={addEditProjectModalRef}
        operationType="create"
      />
      <Card className="border border-gray-300 shadow-md rounded-xl p-6 w-full">
        <CardHeader className="text-xl font-semibold border-b pb-3 flex w-full justify-between">
          My Projects
          <Button
            className="font-bold"
            size="md"
            onPress={openAddEditProjectModal}
          >
            Create New <PlusIcon className="text-sm" />
          </Button>
        </CardHeader>
        <CardBody className="flex-wrap gap-5 flex flex-row items-center ">
          {personalProjects?.map((project) => {
            let projectDetails: ProjectDetailsRequestDTO = {
              projectId: project?.projectId,
              description: project?.description,
              title: project?.title,
              existingMedia: project?.mediaFiles,
              externalLinks: project?.externalLinks,
              mediaFiles: [],
            };
            return <ProjectCard project={projectDetails} isAdmin={true} />;
          })}
        </CardBody>
      </Card>
    </>
  );
};

export default MyProjects;
