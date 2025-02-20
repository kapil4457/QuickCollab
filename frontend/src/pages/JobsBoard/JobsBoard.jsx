import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllJobs } from "../../controller/JobController";

const JobsBoard = () => {
  let allJobs = useSelector((state) => state.job.allJobs);
  const jwtToken = useSelector((state) => state.user.jwtToken);
  const getAllJobsHandler = async () => {
    const response = await getAllJobs(jwtToken);
    console.log(response);
  };
  useEffect(() => {
    getAllJobsHandler();
  }, []);
  return <div>JobsBoard</div>;
};

export default JobsBoard;
