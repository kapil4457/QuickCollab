import { updateEmployeeSalaryHandler } from "@/store/controllers/JobController";
import { ContentCreatorEmployee } from "@/store/dtos/helper";
import { useAppDispatch } from "@/store/hooks";
import showToast from "@/utils/showToast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { forwardRef, useImperativeHandle, useState } from "react";
type propsType = {
  employee: ContentCreatorEmployee | null;
};

const UpdateSalaryModal = forwardRef((props: propsType, ref) => {
  const dispatch = useAppDispatch();
  const [updatedSalary, setUpdatedSalary] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));
  const updateEmployeeSalary = async () => {
    onClose();
    const { message, success } = await updateEmployeeSalaryHandler(
      dispatch,
      props?.employee?.userId!,
      updatedSalary
    );
    if (success) {
      showToast({ color: "success", title: message });
    } else {
      showToast({ color: "danger", title: message });
    }
  };
  return (
    <Modal backdrop="blur" size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent className="p-2">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Offer Details
            </ModalHeader>
            <ModalBody>
              <div className="mb-2 text-sm ">
                {props?.employee?.firstName} {props?.employee?.lastName}'s
                current salary is{" "}
                <span className="font-bold">
                  ${props?.employee?.currentSalary}
                </span>
              </div>
              <Input
                type="number"
                min={0}
                label="Updated Salary (in USD)"
                labelPlacement="outside"
                defaultValue={updatedSalary.toString()}
                onChange={(e) => setUpdatedSalary(e.target.valueAsNumber)}
                startContent="$"
              />

              <div className="flex gap-2 justify-center m-2">
                <Button
                  color="primary"
                  className="font-semibold"
                  onPress={updateEmployeeSalary}
                  isDisabled={updatedSalary === 0}
                >
                  Update Salary
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default UpdateSalaryModal;
