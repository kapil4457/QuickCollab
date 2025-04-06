import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Form } from "@heroui/form";
import React, {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ValidationError } from "@react-types/shared";
import {
  ExternalLink,
  ProjectDetailsRequestDTO,
} from "@/store/dtos/request/projectDetailsRequestDTO";
import { useAppDispatch } from "@/store/hooks";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { MediaType } from "@/utils/enums";
import { Video } from "reactjs-media";
import { X } from "lucide-react";
import {
  createProjectHandler,
  updateProjectHandler,
} from "@/store/controllers/UserController";
import showToast from "@/utils/showToast";

interface propsType {
  data?: ProjectDetailsRequestDTO;
  workId?: number;
  operationType: "create" | "update";
}
type FormErrors = {
  title?: string;
  description?: string;
  mediaFiles?: string;
  externalLinks?: string;
};
type previewUrls = {
  file: File;
  url: string;
  type: string;
};
const AddEditProjectModal = forwardRef((props: propsType, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrl, setPreviewUrl] = useState<previewUrls[]>([]);
  const dispatch = useAppDispatch();
  const [newProject, setNewProject] = useState<ProjectDetailsRequestDTO>({
    description: "",
    title: "",
    existingMedia: [],
    externalLinks: [],
    mediaFiles: [],
    projectId: 0,
  });
  const [currExternalLink, setCurrExternalLink] = useState<ExternalLink>({
    title: "",
    url: "",
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files) {
      setNewProject({
        ...newProject,
        mediaFiles: files,
      });
      let urls: previewUrls[] = [];
      files.map((file) => {
        const objectUrl = URL.createObjectURL(file);
        urls.push({
          file: file,
          url: objectUrl,
          type: file.type.includes("image") ? MediaType.IMAGE : MediaType.VIDEO,
        });
      });
      setPreviewUrl(urls);
    }
  };

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  const createProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success, message } = await createProjectHandler(
      newProject,
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
    setPreviewUrl([]);
    onClose();
  };

  const updateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { success, message } = await updateProjectHandler(
      newProject,
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
    setPreviewUrl([]);
    onClose();
  };

  useEffect(() => {
    if (props.data != null && props?.operationType === "update") {
      setNewProject(props.data);
    }
  }, [props]);
  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {props?.operationType === "create" ? "Add" : "Update"} Project
          </ModalHeader>

          <ModalBody>
            <Form
              className="w-full justify-center items-center flex flex-col gap-4 pb-4"
              validationErrors={errors as Record<string, ValidationError>}
              onSubmit={
                props?.operationType === "create"
                  ? createProject
                  : updateProject
              }
            >
              <Input
                isRequired
                placeholder="Add a title to your project"
                labelPlacement="outside"
                label="Project Title"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    title: e.target.value,
                  })
                }
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please Enter a project title";
                  }
                  return errors.title;
                }}
              />
              <Textarea
                isRequired
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description: e.target.value,
                  })
                }
                placeholder="Add a short description to your project"
                labelPlacement="outside"
                label="Project Description"
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please Enter a project description";
                  }
                  return errors.description;
                }}
              />
              <div className="flex flex-col gap-2">
                <Label>External Links</Label>
                <div className="flex gap-2">
                  <Input
                    isDisabled={newProject?.externalLinks?.length > 3}
                    placeholder="Title"
                    value={currExternalLink?.title}
                    onChange={(e) =>
                      setCurrExternalLink({
                        ...currExternalLink,
                        title: e.target.value,
                      })
                    }
                  />
                  <Input
                    isDisabled={newProject?.externalLinks?.length > 3}
                    placeholder="URL"
                    value={currExternalLink?.url}
                    onChange={(e) =>
                      setCurrExternalLink({
                        ...currExternalLink,
                        url: e.target.value,
                      })
                    }
                  />
                  <Button
                    onPress={() => {
                      if (
                        currExternalLink.title !== "" &&
                        currExternalLink.url !== "" &&
                        newProject?.externalLinks?.filter(
                          (link) => link.url === currExternalLink.url
                        ).length === 0
                      ) {
                        let externalLinks = [
                          ...newProject?.externalLinks,
                          currExternalLink,
                        ];
                        setNewProject({
                          ...newProject,
                          externalLinks: externalLinks,
                        });
                      }
                      setCurrExternalLink({
                        title: "",
                        url: "",
                      });
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newProject?.externalLinks?.map((link) => {
                    return (
                      <Link href={link?.url}>
                        <Chip
                          onClose={() => {
                            let externalLinks =
                              newProject?.externalLinks?.filter(
                                (extLink) => extLink.url !== link.url
                              );
                            setNewProject({
                              ...newProject,
                              externalLinks: externalLinks,
                            });
                          }}
                        >
                          {link?.title}
                        </Chip>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full justify-start">
                <Label>Media Files</Label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                />
                <div className="flex flex-wrap gap-1 h-full">
                  {newProject?.existingMedia?.map((media) => {
                    return (
                      <span className="relative">
                        {media?.type === MediaType?.IMAGE ? (
                          <Image src={media?.url} height={50} width={50} />
                        ) : (
                          <Video src={media?.url} height={50} width={50} />
                        )}
                        <X
                          className="absolute top-[4px] right-[4px] z-10 text-black h-[10px] w-[10px] bg-white rounded-full cursor-pointer"
                          onClick={() => {
                            let newExistingMedia =
                              newProject?.existingMedia?.filter(
                                (currMedia) => media.url != currMedia.url
                              );
                            setNewProject({
                              ...newProject,
                              existingMedia: newExistingMedia,
                            });
                          }}
                        />
                      </span>
                    );
                  })}

                  {previewUrl?.map((preview) => {
                    return (
                      <span className="relative">
                        {preview?.type === MediaType?.IMAGE ? (
                          <Image src={preview.url} height={50} width={50} />
                        ) : (
                          <Video src={preview.url} height={50} width={50} />
                        )}
                        <X
                          onClick={() => {
                            let newPreviewUrls = previewUrl?.filter(
                              (currMedia) => preview.file != currMedia.file
                            );
                            setPreviewUrl(newPreviewUrls);
                            let newMediaFiles = newPreviewUrls.map(
                              (url) => url.file
                            );
                            setNewProject({
                              ...newProject,
                              mediaFiles: newMediaFiles,
                            });
                          }}
                          className="absolute top-[4px] right-[4px] z-10 text-black h-[10px] w-[10px] bg-white rounded-full cursor-pointer"
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <Button type="submit" className="w-full">
                {props?.operationType === "create" ? "Add" : "Update"}
              </Button>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export default AddEditProjectModal;
