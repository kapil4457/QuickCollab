import AddEditProjectModal from "@/pages/Dashboard/Dashboard/components/AddEditProjectModal";
import { deleteProjectHandler } from "@/store/controllers/UserController";
import { ProjectDetailsRequestDTO } from "@/store/dtos/request/projectDetailsRequestDTO";
import { useAppDispatch } from "@/store/hooks";
import { MediaType } from "@/utils/enums";
import showToast from "@/utils/showToast";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { ExternalLink, Pencil, Trash } from "lucide-react";
import { useRef } from "react";
import ReactPlayer from "react-player";
import PersonalProjectDetails from "@/pages/Dashboard/Dashboard/components/PersonalProjectDetails";

const ProjectCard = ({
  project,
  isAdmin,
}: {
  project: ProjectDetailsRequestDTO;
  isAdmin: boolean;
}) => {
  const addEditProjectModalRef = useRef();
  const projectDetailsRef = useRef();
  const dispatch = useAppDispatch();

  const openAddEditProjectModal = () => {
    if (
      addEditProjectModalRef.current &&
      "openModal" in addEditProjectModalRef.current
    ) {
      (addEditProjectModalRef.current as { openModal: () => void }).openModal();
    }
  };
  const deleteProject = async () => {
    const { success, message } = await deleteProjectHandler(
      project?.projectId,
      dispatch
    );

    if (success) {
      showToast({
        color: "success",
        title: message,
      });
    } else {
      showToast({
        color: "danger",
        title: message,
      });
    }
  };

  const openProjectDetails = async () => {
    if (projectDetailsRef.current && "openModal" in projectDetailsRef.current) {
      (projectDetailsRef.current as { openModal: () => void }).openModal();
    }
  };
  return (
    <>
      <PersonalProjectDetails ref={projectDetailsRef} project={project} />
      <AddEditProjectModal
        operationType="update"
        data={project}
        ref={addEditProjectModalRef}
      />
      <Card
        isFooterBlurred
        className="border-none py-4"
        radius="lg"
        classNames={{
          base: "w-[100%] lg:w-[30rem] h-[100%]",
        }}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col gap-4 items-start">
          <p className="text-tiny uppercase font-bold flex justify-between w-full">
            <div className="break-words w-[70%]">{project?.title}</div>
            <div>
              {isAdmin ? (
                <>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={openAddEditProjectModal}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={deleteProject}
                  >
                    <Trash size={15} />
                  </Button>
                </>
              ) : (
                <></>
              )}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={openProjectDetails}
              >
                <ExternalLink size={15} />
              </Button>
            </div>
          </p>
          <span className="flex flex-wrap">
            {project?.externalLinks?.map((link) => {
              return (
                <Chip
                  className="flex justify-center items-center text-center"
                  variant="solid"
                  as={Link}
                  href={link?.url}
                  size="sm"
                >
                  {link?.title}
                </Chip>
              );
            })}
          </span>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          {project &&
            project?.existingMedia &&
            project?.existingMedia?.length > 0 && (
              <>
                {project?.existingMedia[0].type === MediaType.IMAGE ? (
                  <Image
                    isZoomed
                    alt={project?.existingMedia[0]?.url}
                    className="object-cover h-[20rem] md:h-[25rem] w-[100%]"
                    src={project?.existingMedia[0].url}
                    classNames={{
                      wrapper: "width-wrapper",
                    }}
                  />
                ) : (
                  <ReactPlayer
                    url={project?.existingMedia[0].url}
                    controls
                    width={100}
                    height={100}
                    muted
                  />
                )}
              </>
            )}
        </CardBody>
      </Card>
    </>
  );
};

export default ProjectCard;
