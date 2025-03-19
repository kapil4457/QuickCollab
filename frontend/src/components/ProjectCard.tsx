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
import { Delete, ExternalLink, Pencil, Trash } from "lucide-react";
import { useRef } from "react";
import { Video } from "reactjs-media";

const ProjectCard = ({
  project,
  isAdmin,
}: {
  project: ProjectDetailsRequestDTO;
  isAdmin: boolean;
}) => {
  const addEditProjectModalRef = useRef();
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
  return (
    <>
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
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold flex justify-between w-full">
            {project?.title}
            <span>
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
                as={Link}
                href={`/project/${project?.projectId}`}
              >
                <ExternalLink size={15} />
              </Button>
            </span>
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
                  <Video
                    src={project?.existingMedia[0].url}
                    height={400}
                    width={400}
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
