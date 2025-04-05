import { PersonalProject } from "@/store/dtos/helper";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { forwardRef, useImperativeHandle } from "react";
import { Input, Textarea } from "@heroui/input";
import { Label } from "@/components/ui/label";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image } from "@heroui/image";
import ReactPlayer from "react-player";
import { MediaType } from "@/utils/enums";
import { ProjectDetailsRequestDTO } from "@/store/dtos/request/projectDetailsRequestDTO";
type propsType = {
  project: ProjectDetailsRequestDTO;
};

const PersonalProjectDetails = forwardRef((props: propsType, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  return (
    <Modal backdrop="blur" size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props?.project?.title}'s details
            </ModalHeader>
            <ModalBody className="pb-10">
              <div className="pl-10 pr-10">
                <Carousel className="w-full">
                  <CarouselContent>
                    {props?.project?.existingMedia.map((media, index) => (
                      <CarouselItem key={index}>
                        {media?.type === MediaType.IMAGE ? (
                          <Image
                            isZoomed
                            alt={media?.url}
                            className="object-cover h-[20rem] md:h-[25rem] w-[100%]"
                            src={media?.url}
                            classNames={{
                              wrapper: "width-wrapper",
                            }}
                          />
                        ) : (
                          <ReactPlayer
                            url={media?.url}
                            controls
                            width={"100%"}
                            height={"100%"}
                            muted
                          />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              <Input
                isDisabled
                label="Project Id"
                labelPlacement="outside"
                value={props?.project?.projectId.toString()}
              />
              <Textarea
                isDisabled
                label="Project Description"
                labelPlacement="outside"
                value={props?.project?.description}
              />
              <div className="flex flex-col gap-3">
                <Label>External Links</Label>
                {props?.project?.externalLinks?.map((link) => {
                  return (
                    <Chip as={Link} href={link?.url}>
                      {link?.title}
                    </Chip>
                  );
                })}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default PersonalProjectDetails;
