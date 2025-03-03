import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { createJobDTO } from "@/store/dtos/request/createJobDTO";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { CreateJobStatus, JobLocationType } from "@/utils/enums";
import { Save } from "lucide-react";
import { ValidationError } from "@react-types/shared";
import {
  createJobPostingHandler,
  updateJobPostingHandler,
} from "@/store/controllers/JobController";
import showToast from "@/utils/showToast";
import { useAppDispatch } from "@/store/hooks";

type FormErrors = {
  jobName?: string;
  jobDescription?: string;
  jobStatus?: string;
  openingsCount?: number;
  jobLocationType?: string;
  jobLocation?: string;
  noticePeriodDays?: number;
};
type propsType = {
  operationType: "UPDATE" | "CREATE";
  job?: createJobDTO | null;
  jobId?: string | null;
};

export const AddEditPostedJobModal = forwardRef((props: propsType, ref) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [jobId, setJobId] = useState("");
  const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  const [jobPosting, setJobPosting] = useState<createJobDTO>({
    jobDescription: "",
    jobLocation: "",
    jobLocationType: "",
    jobName: "",
    jobStatus: "",
    noticePeriodDays: 0,
    openingsCount: 0,
  });

  const createJobPosting = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const { success, message } = await createJobPostingHandler(
      jobPosting,
      dispatch
    );
    if (success) {
      showToast({ color: "success", title: message });
    } else {
      showToast({ color: "danger", title: message });
    }
    onClose();
  };
  const updateJobPosting = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const { success, message } = await updateJobPostingHandler(
      jobPosting,
      dispatch,
      jobId
    );
    if (success) {
      showToast({ color: "success", title: message });
    } else {
      showToast({ color: "danger", title: message });
    }
    onClose();
  };

  useEffect(() => {
    if (props?.operationType! === "UPDATE") {
      setJobPosting(props?.job!);
      setJobId(props?.jobId!);
    } else if (props?.operationType! === "CREATE") {
      setJobPosting({
        jobDescription: "",
        jobLocation: "",
        jobLocationType: "",
        jobName: "",
        jobStatus: "",
        noticePeriodDays: 0,
        openingsCount: 0,
      });
      setJobId("");
    }
  }, [props]);
  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.operationType === "CREATE" ? "Create" : "Update"} Job
                Posting
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full justify-center items-center flex flex-col gap-4 pb-4"
                  validationErrors={errors as Record<string, ValidationError>}
                  onSubmit={
                    props.operationType === "CREATE"
                      ? createJobPosting
                      : updateJobPosting
                  }
                >
                  <Input
                    isRequired
                    label="Title"
                    labelPlacement="outside"
                    name="jobName"
                    placeholder="Enter the job title."
                    value={jobPosting?.jobName}
                    onChange={(e) => {
                      setJobPosting({
                        ...jobPosting,
                        jobName: e.target.value,
                      });
                    }}
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return "Please enter a job title";
                      }
                      return errors.jobName;
                    }}
                  />
                  <Textarea
                    isRequired
                    label="Description"
                    labelPlacement="outside"
                    name="jobDescription"
                    placeholder="Enter the job description."
                    value={jobPosting?.jobDescription}
                    onChange={(e) => {
                      setJobPosting({
                        ...jobPosting,
                        jobDescription: e.target.value,
                      });
                    }}
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return "Please enter a job description";
                      }
                      return errors.jobDescription;
                    }}
                  />
                  <Select
                    label="Select a Job Status"
                    placeholder="Job Status"
                    name="jobStatus"
                    labelPlacement="outside"
                    isRequired
                    value={jobPosting?.jobStatus}
                    selectedKeys={[jobPosting.jobStatus]}
                    onChange={(e) => {
                      setJobPosting({
                        ...jobPosting,
                        jobStatus: e.target.value,
                      });
                    }}
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return "Please Select a job status";
                      }
                      return errors.jobStatus;
                    }}
                  >
                    {Object.keys(CreateJobStatus).map((jobStatus) => (
                      <SelectItem key={jobStatus}>{jobStatus}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Openings Count"
                    labelPlacement="outside"
                    placeholder="0.00"
                    type="number"
                    name="openingsCount"
                    value={jobPosting?.openingsCount?.toString()}
                    onChange={(e) => {
                      setJobPosting({
                        ...jobPosting,
                        openingsCount: e.target.valueAsNumber,
                      });
                    }}
                    isRequired
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return "Please enter a number greater than zero";
                      }
                      if (validationDetails.typeMismatch) {
                        return "Please enter a valid number";
                      }
                      return errors.openingsCount;
                    }}
                  />
                  <Select
                    label="Select a Job Location Type"
                    placeholder="Job Location Type"
                    name="jobLocationType"
                    labelPlacement="outside"
                    value={jobPosting?.jobLocationType}
                    selectionMode={"single"}
                    selectedKeys={[jobPosting.jobLocationType]}
                    onChange={(e) => {
                      setJobPosting({
                        ...jobPosting,
                        jobLocationType: e.target.value,
                      });
                    }}
                    isRequired
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return "Please Select a job location type";
                      }
                      return errors.jobLocationType;
                    }}
                  >
                    {Object.keys(JobLocationType).map((jobLocationType) => (
                      <SelectItem key={jobLocationType}>
                        {jobLocationType}
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    isRequired
                    label="Location"
                    labelPlacement="outside"
                    name="jobLocation"
                    placeholder="Enter the job location."
                    value={jobPosting?.jobLocation}
                    onChange={(e) => {
                      setJobPosting({
                        ...jobPosting,
                        jobLocation: e.target.value,
                      });
                    }}
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return "Please enter a job description";
                      }
                      return errors.jobLocation;
                    }}
                  />
                  <Input
                    label="Notice Period Days"
                    labelPlacement="outside"
                    placeholder="0.00"
                    type="number"
                    name="noticePeriodDays"
                    isRequired
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return "Please enter a number greater than zero";
                      }
                      if (validationDetails.typeMismatch) {
                        return "Please enter a valid number";
                      }
                      return errors.noticePeriodDays;
                    }}
                    value={jobPosting?.noticePeriodDays?.toString()}
                    onChange={(e) => {
                      setJobPosting({
                        ...jobPosting,
                        noticePeriodDays: parseInt(e.target.value),
                      });
                    }}
                  />
                  <Button className="w-full" color="primary" type="submit">
                    <Save />
                    {props?.operationType === "CREATE" ? "Create" : "Save"}
                  </Button>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
