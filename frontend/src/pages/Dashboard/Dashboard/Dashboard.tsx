import { useAppSelector } from "@/store/hooks";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  selectLoggedInUser,
  selectWorkHistory,
} from "@/store/slices/userSlice";
import { AllRoles } from "@/utils/enums";
import TimeLine from "./components/TimeLine";
import EmployeeStats from "./components/EmployeeStats";
import SelfDetails from "./components/SelfDetails";
import CurrentJobDetails from "./components/CurrentJobDetails";
import MyProjects from "./components/MyProjects";

const Dashboard = () => {
  const jobHistory = useAppSelector(selectWorkHistory);
  const user = useAppSelector(selectLoggedInUser);
  return (
    <DashboardLayout>
      <>
        {/* Common
      1. Self Details [Done]
      */}
        {/* Content Creator
    1. Total Expense in salary 
    2. Number of Employees chart per month
    3. Number of Employees in pie chart by isOnNoticePeriod
    4. Number of Job Openings sorted by the job status
    5. Number of media uploaded
    */}
        {/* 
    Team Member
    1. Current Job details [Done]
    2. Job History [Done]
    3. Personal Projects [Section created]
    4. Active Offers Pending
    5. Resign from Current Job
    6. 
    */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col xl:flex-row h-[80vh]">
            <div className="flex w-full flex-col gap-4">
              <SelfDetails />
              {user?.userRole === AllRoles.TEAM_MEMBER && <CurrentJobDetails />}
            </div>
            <div className="w-full h-full">
              {user?.userRole !== AllRoles.CONTENT_CREATOR ? (
                <TimeLine jobHistory={jobHistory} />
              ) : (
                <>
                  <EmployeeStats />
                </>
              )}
            </div>
          </div>
          {user && user?.userRole !== AllRoles.CONTENT_CREATOR && (
            <>
              <div>
                <MyProjects />
              </div>
            </>
          )}
        </div>
      </>
    </DashboardLayout>
  );
};

export default Dashboard;
