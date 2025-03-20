import CustomAvatar from "@/components/CustomAvatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectIsServingNoticePeriod,
  selectLoggedInUser,
  selectOffersRecieved,
} from "@/store/slices/userSlice";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Edit } from "lucide-react";
import React, { useRef } from "react";
import EditSelfDetailsModal from "./EditSelfDetailsModal";
import { Link } from "@heroui/link";
import showToast from "@/utils/showToast";
import { updateResignationStatusHandler } from "@/store/controllers/JobController";
const SocialMediaIcon = ({ platform }: { platform: string }) => {
  const icons: {
    [key: string]: string;
  } = {
    YOUTUBE: "youtube.svg",
    INSTAGRAM: "instagram.svg",
    FACEBOOK: "facebook.svg",
    TWITTER: "twitter.svg",
  };
  return icons[platform];
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col max-h-[7rem]">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-600 font-bold max-h-[5rem] overflow-auto break-words">
      {value || "N/A"}
    </span>
  </div>
);
// /api/updateResignationStatus

const OtherStats = () => {
  const offersReceived = useAppSelector(selectOffersRecieved);
  const editSelfDetailsModalRef = useRef();
  const dispatch = useAppDispatch();
  const isServingNoticePeriod = useAppSelector(selectIsServingNoticePeriod);
  const updateResignationStatus = async () => {
    const { success, message } = await updateResignationStatusHandler(
      dispatch,
      !isServingNoticePeriod
    );
    if (success) {
      showToast({
        color: "success",
        title: message,
      });
    } else {
      showToast({
        color: "danger",
        title: message,
      });
    }
  };
  return (
    <>
      <EditSelfDetailsModal ref={editSelfDetailsModalRef} />
      <Card className="border border-gray-300 shadow-md  flex-1 w-full  rounded-xl p-6  min-h-[15rem] overflow-auto ">
        <CardHeader className="text-xl font-semibold border-b pb-3 flex justify-between">
          Other Stats
          <Button onPress={updateResignationStatus}>
            {isServingNoticePeriod ? "Withdraw Resignation" : "Resign"}
          </Button>
        </CardHeader>
        <CardBody className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <DetailItem
              label="Active Offers"
              value={offersReceived?.length?.toString() || "0"}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default OtherStats;
