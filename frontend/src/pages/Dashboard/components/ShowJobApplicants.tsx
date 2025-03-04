import { ContentCreatorEmployee } from "@/store/dtos/helper";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { forwardRef, useImperativeHandle } from "react";

type propsType = {
  applicants: ContentCreatorEmployee[] | null;
};

const ShowJobApplicants = forwardRef((props: propsType, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Job Applicants
            </ModalHeader>
            <ModalBody></ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default ShowJobApplicants;
