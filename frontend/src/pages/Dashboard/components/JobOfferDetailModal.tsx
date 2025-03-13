import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";

import { OfferDetail } from "@/store/dtos/helper";
import { Input } from "@heroui/input";
import { Button, ButtonGroup } from "@heroui/button";
import { formatDate } from "@/utils/generalUtils";
import { requestOfferRevisionHandler } from "@/store/controllers/JobController";
import { useAppDispatch } from "@/store/hooks";
import showToast from "@/utils/showToast";

type propsType = {
  offerDetail: OfferDetail | null;
};

export const JobOfferDetailModal = forwardRef((props: propsType, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));
  const dispatch = useAppDispatch();

  const requestOfferRevision = async () => {
    const { success, message } = await requestOfferRevisionHandler(
      dispatch,
      props?.offerDetail?.jobId?.toString()!
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
    onClose();
  };
  return (
    <>
      <Modal backdrop="blur" size="md" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Offer Details
              </ModalHeader>
              <ModalBody>
                <Input
                  disabled
                  label="Job Title"
                  labelPlacement="outside"
                  defaultValue={props?.offerDetail?.jobTitle}
                />
                <Input
                  disabled
                  label="Offer Valid Till"
                  labelPlacement="outside"
                  defaultValue={
                    props?.offerDetail != null
                      ? formatDate(props?.offerDetail?.offeredOn?.toString())
                      : new Date().toISOString()
                  }
                />
                <Input
                  disabled
                  label="Offer Status"
                  labelPlacement="outside"
                  defaultValue={props?.offerDetail?.offerStatus}
                />
                <Input
                  disabled
                  label="Offered Salary (in USD)"
                  labelPlacement="outside"
                  defaultValue={`$${props?.offerDetail?.salary?.toString()}`}
                />
                <Input
                  disabled
                  label="User Role Offered"
                  labelPlacement="outside"
                  defaultValue={props?.offerDetail?.userRole}
                />
                <ButtonGroup>
                  <Button
                    color="primary"
                    className="font-semibold"
                    onPress={requestOfferRevision}
                  >
                    Request Updated Offer
                  </Button>
                  <Button>Accept Offer</Button>
                </ButtonGroup>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
