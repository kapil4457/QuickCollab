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
import OtherStats from "./components/OtherStats";
import JobStats from "./components/JobStats";

const Dashboard = () => {
  const jobHistory = useAppSelector(selectWorkHistory);
  const user = useAppSelector(selectLoggedInUser);
  return (
    <DashboardLayout>
      <>
        <div className="flex flex-col gap-2 h-full">
          <div className="flex gap-2 flex-col xl:flex-row h-full flex-1">
            <div className="flex w-full h-full flex-col gap-2 flex-1">
              <SelfDetails />
              {user?.userRole === AllRoles.TEAM_MEMBER && <CurrentJobDetails />}
            </div>
            <div className="w-full h-full flex-1">
              {user?.userRole !== AllRoles.CONTENT_CREATOR ? (
                <div className="flex w-full h-full flex-col gap-2 flex-1">
                  <TimeLine jobHistory={jobHistory} />
                  <OtherStats />
                </div>
              ) : (
                <>
                  <EmployeeStats />
                </>
              )}
            </div>
          </div>

          {user && user?.userRole === AllRoles.CONTENT_CREATOR && (
            <div>
              <JobStats />
            </div>
          )}
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
