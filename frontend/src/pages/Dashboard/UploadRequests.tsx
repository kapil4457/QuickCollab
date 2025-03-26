import DashboardLayout from "@/layouts/DashboardLayout";
import { useAppSelector } from "@/store/hooks";
import {
  selectAllUploadRequests,
  selectLoggedInUser,
} from "@/store/slices/userSlice";
import { AllRoles } from "@/utils/enums";
import { Button } from "@heroui/button";
import React, { useRef, useState } from "react";
import { PlusIcon } from "./PostedJobs/PostedJobs";
import UploadRequestCard from "./components/UploadRequestCard";
import AddEditUploadRequest from "./components/AddEditUploadRequest";
import { UploadRequestDTO } from "@/store/dtos/request/UploadRequestDTO";

const UploadRequests = () => {
  const user = useAppSelector(selectLoggedInUser);
  const uploadRequests =
    user?.userRole !== AllRoles.CONTENT_CREATOR
      ? useAppSelector(selectAllUploadRequests)
      : [];

  const [uploadRequest, setUploadRequest] = useState<UploadRequestDTO>({
    description: "",
    media: null,
    mediaType: "",
    mediaUrl: "",
    tags: [],
    title: "",
    uploadRequestStatus: "",
    uploadTo: [],
    uploadTypeMapping: null,
  });
  const addEditUploadRequestModalRef = useRef();
  const openAddEditUploadRequestModal = () => {
    if (
      addEditUploadRequestModalRef.current &&
      "openModal" in addEditUploadRequestModalRef.current
    ) {
      (
        addEditUploadRequestModalRef.current as { openModal: () => void }
      ).openModal();
    }
  };
  return (
    <DashboardLayout>
      <>
        <AddEditUploadRequest
          ref={addEditUploadRequestModalRef}
          operationType="CREATE"
          uploadRequest={uploadRequest}
        />
        {user?.userRole === AllRoles.TEAM_MEMBER && (
          <div className="w-full flex justify-end items-center">
            <Button onPress={openAddEditUploadRequestModal}>
              Create <PlusIcon />
            </Button>
          </div>
        )}

        {user?.userRole !== AllRoles.JOB_SEEKER && (
          <div>
            {uploadRequests?.map((request, key) => {
              return <UploadRequestCard request={request} />;
            })}
          </div>
        )}
      </>
    </DashboardLayout>
  );
};

export default UploadRequests;
