import {
  Anchor,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  PasswordInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import { JobLocationPicker } from "./JobLocationPicker";
import { createJob, updateJob } from "../../../../controller/JobController";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUserListedJobs } from "../../../../store/slices/jobSlice";

/*
      {
      jobName,
      jobDescription,
      jobStatus,
      openingsCount,
      jobLocationType,
      jobLocation,
    }

    {
    jobName: "",
    jobDescription: "",
    openingsCount: 1,
    jobStatus: "REMOTE",
    jobLocationType: "",
    jobLocation: "",
  }
      */
const UpdateJobForm = ({
  isDisabled,
  setIsDisabled,
  setIsOpen,
  currentData,
  jobId,
}) => {
  const jwtToken = useSelector((state) => state.user.jwtToken);
  const dispatch = useDispatch();
  const [jobDetails, setJobDetails] = useState(currentData);
  const updateJobHandler = async () => {
    try {
      setIsDisabled(true);
      const response = await updateJob(jobDetails, jwtToken, jobId);
      const { jobs, success, message } = response.data;
      if (success) {
        dispatch(updateUserListedJobs({ userListedJobs: jobs }));
        toast.success(message);
      } else {
        toast.error(message);
      }

      console.log(response);
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message);
    } finally {
      setIsDisabled(false);
      setIsOpen(false);
    }
  };
  return (
    <div className="w-full pl-[10rem] pr-[10rem] flex gap-2 flex-col">
      <TextInput
        label="Job Title"
        placeholder="Video Editor"
        required
        value={jobDetails?.jobName}
        onChange={(e) =>
          setJobDetails({ ...jobDetails, jobName: e?.target?.value })
        }
        disabled={isDisabled}
      />
      <Textarea
        label="Job Description"
        required
        placeholder="Enter Job Description here"
        value={jobDetails?.jobDescription}
        onChange={(e) =>
          setJobDetails({ ...jobDetails, jobDescription: e?.target?.value })
        }
        disabled={isDisabled}
      />
      <NumberInput
        label="Openings Count"
        required
        value={jobDetails?.openingsCount}
        onChange={(e) => setJobDetails({ ...jobDetails, openingsCount: e })}
        disabled={isDisabled}
      />
      <div className="flex flex-col gap-2">
        <label
          required
          style={{
            fontWeight: "500",
            fontSize: "var(--input-label-size, var(--mantine-font-size-sm))",
          }}
        >
          Job location type
          <span
            class="m_78a94662 mantine-InputWrapper-required mantine-TextInput-required"
            aria-hidden="true"
          >
            {" "}
            *
          </span>
        </label>
        <JobLocationPicker
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          isDisabled={isDisabled}
        />
      </div>
      <Textarea
        label="Job Location"
        required
        placeholder="India"
        value={jobDetails?.jobLocation}
        onChange={(e) =>
          setJobDetails({ ...jobDetails, jobLocation: e?.target?.value })
        }
        disabled={isDisabled}
      />
      <Button
        disabled={isDisabled}
        fullWidth
        mt="xl"
        onClick={updateJobHandler}
      >
        Update
      </Button>
    </div>
  );
};

export default UpdateJobForm;
