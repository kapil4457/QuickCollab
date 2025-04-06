import { forwardRef, useImperativeHandle } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";

import { OfferDetail } from "@/store/dtos/helper";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { formatDate } from "@/utils/generalUtils";
import { updateOfferStatusHandler } from "@/store/controllers/JobController";
import { useAppDispatch } from "@/store/hooks";
import showToast from "@/utils/showToast";
import { OfferStatus } from "@/utils/enums";

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
    const { success, message } = await updateOfferStatusHandler(
      dispatch,
      props?.offerDetail?.jobId?.toString()!,
      OfferStatus.REVISION
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

  const acceptOffer = async () => {
    const { success, message } = await updateOfferStatusHandler(
      dispatch,
      props?.offerDetail?.jobId?.toString()!,
      OfferStatus.ACCEPTED
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
        <ModalContent className="p-2">
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
                <div className="flex gap-2 justify-center m-2">
                  <Button
                    color="primary"
                    className="font-semibold"
                    onPress={requestOfferRevision}
                    isDisabled={
                      !(
                        props?.offerDetail?.offerStatus ===
                          OfferStatus.PENDING ||
                        props?.offerDetail?.offerStatus === OfferStatus.REVISION
                      )
                    }
                  >
                    Request Updated Offer
                  </Button>
                  <Button
                    isDisabled={
                      !(
                        props?.offerDetail?.offerStatus ===
                          OfferStatus.PENDING ||
                        props?.offerDetail?.offerStatus === OfferStatus.REVISION
                      )
                    }
                    onPress={acceptOffer}
                  >
                    Accept Offer
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
