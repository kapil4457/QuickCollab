import React, { useEffect, useState } from "react";
import { JobsTable } from "./component/Tables/JobsTable";
import { getSelfListedJobs } from "../../controller/JobController";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { updateUserListedJobs } from "../../store/slices/jobSlice";
import { Button } from "@mantine/core";
import PopUpBase from "../../components/PopUpBase/PopUpBase";
import { ApplicantsTable } from "./component/Tables/ApplicantsTable";
import CreateJobForm from "./component/Forms/CreateJobForm";

const Hire = () => {
  const [applicants, setApplicants] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);

  const [showCreateJob, setShowCreateJob] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const listedJobs = useSelector((state) => state.job.userListedJobs);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.user.jwtToken);
  const getUserListedJobs = async () => {
    try {
      const response = await getSelfListedJobs(jwtToken);
      const { jobs, message, success } = response.data;
      if (success) {
        dispatch(updateUserListedJobs({ userListedJobs: jobs }));
        useSelector((state) => state.job.userListedJobs);
      } else {
        toast.error(message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      navigate("/");
    }
  };
  useEffect(() => {
    if (listedJobs.length == 0) {
      getUserListedJobs();
    }
  }, []);

  return (
    <div className="w-full pl-[10%] pr-[10%] flex flex-col gap-5">
      {showCreateJob ? (
        <PopUpBase setIsOpen={setShowCreateJob} isDisabled={isDisabled}>
          <CreateJobForm
            setShowCreateJob={setShowCreateJob}
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
            setIsOpen={setShowCreateJob}
          />
        </PopUpBase>
      ) : null}
      {showApplicants ? (
        <PopUpBase setIsOpen={setShowApplicants}>
          <ApplicantsTable data={applicants} />
        </PopUpBase>
      ) : null}
      {/* Button to create new Job postings */}
      <Button className="self-end" onClick={() => setShowCreateJob(true)}>
        Create Job +
      </Button>
      {/* List of already listed job postings */}
      <JobsTable
        data={listedJobs}
        setApplicants={setApplicants}
        setShowApplicants={setShowApplicants}
      />
    </div>
  );
};

export default Hire;
