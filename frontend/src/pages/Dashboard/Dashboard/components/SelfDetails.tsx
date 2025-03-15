import CustomAvatar from "@/components/CustomAvatar";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import React from "react";

const SocialMediaIcon = ({ platform }: { platform: string }) => {
  const icons: { [key: string]: string } = {
    YOUTUBE: "🔗",
    INSTAGRAM: "📸",
    FACEBOOK: "📘",
    TWITTER: "🐙",
  };
  return <span className="text-lg">{icons[platform] || "🌐"}</span>;
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-600 font-bold">{value || "N/A"}</span>
  </div>
);
const SelfDetails = () => {
  const user = useAppSelector(selectLoggedInUser);

  return (
    <Card className="border border-gray-300 shadow-md rounded-xl p-6 ">
      <CardHeader className="text-xl font-semibold border-b pb-3">
        Self Details
      </CardHeader>
      <CardBody className="space-y-5 mt-4">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <Image
              isBlurred
              alt="Profile Picture"
              className="rounded-full border border-gray-300 shadow-md"
              src={user?.profilePicture}
              width={80}
              height={80}
            />
          ) : (
            <CustomAvatar
              firstName={user?.firstName}
              lastName={user?.lastName}
            />
          )}
          <div>
            <p className="text-lg font-semibold ">
              {`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
            </p>
            <p className="text-sm text-gray-500">{user?.userRole || "N/A"}</p>
          </div>
        </div>

        {/* Grid Layout for Details */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <DetailItem label="User ID" value={user?.userId || ""} />
          <DetailItem label="Email ID" value={user?.emailId || ""} />
          <DetailItem
            label="Notice Period"
            value={`${user?.currentJobNoticePeriodDays || "N/A"} days`}
          />
        </div>

        {/* Social Media Handles Section */}
        <div className="mt-3">
          <span className="text-gray-600 font-medium">Social Media</span>
          {user?.socialMediaHandles && user?.socialMediaHandles?.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {user.socialMediaHandles.map((handle, index) => (
                <li key={index} className="flex items-center gap-2">
                  <SocialMediaIcon platform={handle.socialMediaPlatformName} />
                  <a
                    href={handle.socialMediaHandleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {handle.socialMediaPlatformName}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-1">N/A</p>
          )}
        </div>

        {/* About Me Section */}
        {user?.selfDescription && (
          <div className="mt-3">
            <span className="text-gray-600 font-medium">About Me</span>
            <p className="mt-1 text-gray-800">{user?.selfDescription}</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SelfDetails;
