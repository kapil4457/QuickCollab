import { PersonalProject } from "@/store/dtos/helper";
import { MediaType } from "@/utils/enums";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { ExternalLink } from "lucide-react";
import { useRef } from "react";
import ReactPlayer from "react-player";
import PersonalProjectDetails from "./PersonalProjectDetails";

const ProjectCard = ({ project }: { project: PersonalProject }) => {
  const projectDetailsRef = useRef();

  const openProjectDetails = async () => {
    if (projectDetailsRef.current && "openModal" in projectDetailsRef.current) {
      (projectDetailsRef.current as { openModal: () => void }).openModal();
    }
  };
  return (
    <>
      <PersonalProjectDetails project={project} ref={projectDetailsRef} />
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
            project?.mediaFiles &&
            project?.mediaFiles?.length > 0 && (
              <>
                {project?.mediaFiles[0].type === MediaType.IMAGE ? (
                  <Image
                    isZoomed
                    alt={project?.mediaFiles[0]?.url}
                    className="object-cover h-[20rem] md:h-[25rem] w-[100%]"
                    src={project?.mediaFiles[0].url}
                    classNames={{
                      wrapper: "width-wrapper",
                    }}
                  />
                ) : (
                  <ReactPlayer
                    url={project?.mediaFiles[0].url}
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
