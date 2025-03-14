import { OfferDetail } from "@/store/dtos/helper";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { ValidationError } from "@react-types/shared";
import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Form } from "@heroui/form";
import { TeamMemberRole } from "@/utils/enums";
import { Select, SelectItem } from "@heroui/select";
import { DateInput } from "@heroui/date-input";
import { Button } from "@heroui/button";
import { fromDate } from "@internationalized/date";
import {
  createJobOfferHandler,
  updateJobOfferHandler,
} from "@/store/controllers/JobController";
import { useAppDispatch } from "@/store/hooks";
import showToast from "@/utils/showToast";
type propsType = {
  operationType: "create" | "update";
  body?: OfferDetail | null;
};

type FormErrors = {
  jobTitle?: string;
  salary?: string;
  userRole?: string;
  validTill?: string;
};
const CreateOfferModal = forwardRef((props: propsType, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useAppDispatch();

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  const [offerDetail, setOfferDetail] = useState<OfferDetail>({
    offerId: "",
    jobId: 0,
    jobTitle: "",
    offeredOn: new Date(),
    offerStatus: "PENDING",
    salary: 0,
    userId: "",
    userRole: "TEAM_MEMBER",
    validTill: new Date(),
  });

  const createOfferLetter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: OfferDetail = {
      jobId: props.body?.jobId!,
      jobTitle: offerDetail.jobTitle,
      offeredOn: new Date(),
      offerId: props.body?.offerId!,
      offerStatus: offerDetail.offerStatus,
      salary: offerDetail.salary,
      userId: props.body?.userId!,
      userRole: offerDetail.userRole,
      validTill: offerDetail.validTill,
    };
    const { message, success } = await createJobOfferHandler(dispatch, body);

    onClose();
    if (success) {
      showToast({ title: message, color: "success" });
    } else {
      showToast({ title: message, color: "danger" });
    }
  };
  const updateOfferLetter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: OfferDetail = {
      jobId: offerDetail.jobId!,
      jobTitle: offerDetail.jobTitle,
      offeredOn: new Date(),
      offerId: offerDetail.offerId!,
      offerStatus: "PENDING",
      salary: offerDetail.salary,
      userId: offerDetail.userId!,
      userRole: offerDetail.userRole,
      validTill: offerDetail.validTill,
    };
    const { message, success } = await updateJobOfferHandler(dispatch, body);

    onClose();
    if (success) {
      showToast({ title: message, color: "success" });
    } else {
      showToast({ title: message, color: "danger" });
    }
  };

  useEffect(() => {
    if (props.operationType === "update" && props.body != null) {
      setOfferDetail(props.body!);
    }
  }, [props, props?.body]);
  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {props.operationType === "create" ? "Create" : "Update"} Offer
          </ModalHeader>

          <ModalBody>
            <Form
              className="w-full justify-center items-center flex flex-col gap-4 pb-4"
              validationErrors={errors as Record<string, ValidationError>}
              onSubmit={
                props.operationType === "create"
                  ? createOfferLetter
                  : updateOfferLetter
              }
            >
              <Input
                isRequired
                label="Job Title"
                labelPlacement="outside"
                name="jobName"
                placeholder="Enter the job title."
                value={offerDetail?.jobTitle}
                onChange={(e) => {
                  setOfferDetail({
                    ...offerDetail,
                    jobTitle: e.target.value,
                  });
                }}
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter a job title";
                  }
                  return errors.jobTitle;
                }}
              />
              <Input
                isRequired
                label="Salary in USD per year"
                labelPlacement="outside"
                name="salary"
                type="number"
                placeholder="100.0"
                value={offerDetail?.salary?.toString()}
                onChange={(e) => {
                  setOfferDetail({
                    ...offerDetail,
                    salary: e.target.valueAsNumber,
                  });
                }}
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter the offered salary";
                  }
                  return errors.salary;
                }}
              />
              <Select
                label="Select a user role"
                placeholder="User Role"
                name="userRole"
                labelPlacement="outside"
                isRequired
                value={offerDetail?.userRole}
                selectedKeys={[offerDetail?.userRole]}
                onChange={(e) => {
                  setOfferDetail({
                    ...offerDetail,
                    userRole: e.target.value,
                  });
                }}
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please Select a job status";
                  }
                  return errors.userRole;
                }}
              >
                {Object.keys(TeamMemberRole).map((userRole) => (
                  <SelectItem key={userRole}>{userRole}</SelectItem>
                ))}
              </Select>
              <DateInput
                label="Offer Valid Till"
                labelPlacement="outside"
                isRequired
                defaultValue={
                  offerDetail?.validTill instanceof Date
                    ? fromDate(offerDetail.validTill, "Asia/Kolkata")
                    : undefined
                }
                onChange={(e) => {
                  setOfferDetail((prev) => ({
                    ...prev,
                    validTill: e ? e?.toDate() : prev?.validTill, // Convert DateValue to JS Date
                  }));
                }}
              />

              <Button type="submit" className="w-full">
                {props?.operationType === "create" ? "Send" : "Update"}
              </Button>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export default CreateOfferModal;
