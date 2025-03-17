import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Form } from "@heroui/form";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ValidationError } from "@react-types/shared";
import { ProjectDetailsRequestDTO } from "@/store/dtos/request/projectDetailsRequestDTO";
import { useAppDispatch } from "@/store/hooks";
import { Input } from "@heroui/input";

interface propsType {
  data: ProjectDetailsRequestDTO;
  operationType: "create" | "update";
}
type FormErrors = {
  title?: string;
  description?: string;
  mediaFiles?: string;
  externalLinks?: string;
};
const CreateProjectModal = forwardRef((props: propsType, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const [newProject, setNewProject] = useState<ProjectDetailsRequestDTO>({
    description: "",
    existingMedia: [],
    externalLinks: [],
    mediaFiles: [],
    title: "",
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files) {
      setNewProject({
        ...newProject,
        mediaFiles: files,
      });
      files.map((file) => {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl([...previewUrl, objectUrl]);
      });
    }
  };

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  const createProject = async () => {};

  const updateProject = async () => {};
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
              <Input placeholder="Project Title" />
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export default CreateProjectModal;
