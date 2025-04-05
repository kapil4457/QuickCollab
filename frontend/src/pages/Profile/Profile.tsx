import DefaultLayout from "@/layouts/DefaultLayout";
import { getUserProfileDetailsById } from "@/store/controllers/UserController";
import { ContentCreatorProfileDetailDTO } from "@/store/dtos/response/ContentCreatorProfileDetailDTO";
import { UserProfileDetailDTO } from "@/store/dtos/response/UserProfileDetailDTO";
import { useAppDispatch } from "@/store/hooks";
import showToast from "@/utils/showToast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserDetails from "./components/UserDetails";
import AllJobs from "./components/AllJobs";
import { AllRoles } from "@/utils/enums";
import CurrentJobDetails from "./components/CurrentJobDetails";
import JobHistoryTimeline from "./components/JobHistory";
import PersonalProjects from "./components/PesonalProjects";

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const [userDetails, setUserDetails] = useState<
    ContentCreatorProfileDetailDTO | UserProfileDetailDTO | null
  >(null);
  const getUserDetails = async (userId: string) => {
    const { message, success, user } = await getUserProfileDetailsById(
      userId,
      dispatch
    );

    if (success) {
      setUserDetails(user);
    } else {
      showToast({
        color: "danger",
        title: message,
      });
    }
  };
  useEffect(() => {
    if (userId) {
      getUserDetails(userId);
    }
    console.log(userId);
  }, [userId]);
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4 mb-[3rem]">
        <UserDetails user={userDetails} />
        {userDetails?.userRole === AllRoles.CONTENT_CREATOR && (
          <AllJobs
            listedJobs={userDetails?.jobsPosted || []}
            userRole={userDetails?.userRole?.toString() || ""}
          />
        )}
        {userDetails?.userRole === AllRoles.TEAM_MEMBER && (
          <CurrentJobDetails
            isServingNoticePeriod={userDetails?.isServingNoticePeriod}
            currentJobDetails={userDetails?.currentJobDetails}
            noticePeriodInDays={userDetails?.currentJobNoticePeriodDays}
            noticePeriodEndDate={userDetails?.noticePeriodEndDate}
          />
        )}
        {userDetails?.userRole &&
          userDetails?.userRole !== AllRoles.CONTENT_CREATOR && (
            <>
              <JobHistoryTimeline
                currJobDetails={userDetails?.currentJobDetails}
                jobHistory={userDetails?.jobHistory}
              />
              <PersonalProjects projects={userDetails?.personalProjects} />
            </>
          )}
      </div>
    </DefaultLayout>
  );
};

export default Profile;
