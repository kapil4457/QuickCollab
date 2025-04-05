import CustomAvatar from "@/components/CustomAvatar";
import { ContentCreatorProfileDetailDTO } from "@/store/dtos/response/ContentCreatorProfileDetailDTO";
import { UserProfileDetailDTO } from "@/store/dtos/response/UserProfileDetailDTO";
import { AllRoles } from "@/utils/enums";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";

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
const UserDetails = ({
  user,
}: {
  user: ContentCreatorProfileDetailDTO | UserProfileDetailDTO | null;
}) => {
  if (!user) return;
  return (
    <>
      <Card className="border border-gray-300 shadow-md  w-full rounded-xl p-6 h-full">
        <CardHeader className="text-xl font-semibold border-b pb-3 flex justify-between">
          User Details{" "}
        </CardHeader>
        <CardBody className="space-y-5 mt-4">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-4">
            {user?.profilePicture ? (
              <Image
                isBlurred
                alt="Profile Picture"
                className=" border border-gray-300 shadow-md object-cover"
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
            <DetailItem label="About Me" value={user?.selfDescription || ""} />
            {user?.userRole === AllRoles.CONTENT_CREATOR && (
              <DetailItem
                label="Employee Count"
                value={user?.employeeCount.toString() || "0"}
              />
            )}
          </div>

          {/* Social Media Handles Section */}
          <div className="mt-3">
            <span className="text-gray-600 font-medium">Social Media</span>
            {user?.socialMediaHandles &&
            user?.socialMediaHandles?.length > 0 ? (
              <ul className="mt-2 space-y-1 flex flex-wrap gap-2 items-center ">
                {user.socialMediaHandles.map((handle, index) => (
                  <Button
                    size="md"
                    as={Link}
                    href={handle?.socialMediaHandleUrl}
                    key={index}
                    isIconOnly
                    className="flex items-center gap-2"
                    variant="shadow"
                  >
                    <img
                      src={
                        "/" +
                        SocialMediaIcon({
                          platform: handle.socialMediaPlatformName,
                        })
                      }
                      alt={handle.socialMediaPlatformName}
                    />
                  </Button>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-1">N/A</p>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default UserDetails;
