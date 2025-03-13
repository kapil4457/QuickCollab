import DashboardLayout from "@/layouts/DashboardLayout";
import { useAppSelector } from "@/store/hooks";
import { selectAllJobsOffered } from "@/store/slices/userSlice";

const JobsOffered = () => {
  const jobsOffered = useAppSelector(selectAllJobsOffered);
  console.log("jobsOffered", jobsOffered);
  return <DashboardLayout> </DashboardLayout>;
};

export default JobsOffered;
