import CustomAvatar from "@/components/CustomAvatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectConfiguredProviders,
  selectLoggedInUser,
} from "@/store/slices/userSlice";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Edit } from "lucide-react";
import React, { useEffect, useRef } from "react";
import EditSelfDetailsModal from "./EditSelfDetailsModal";
import { Link } from "@heroui/link";
import { AllRoles, ProviderName } from "@/utils/enums";
import { siteConfig } from "@/config/site";
import { useGoogleLogin } from "@react-oauth/google";
import { addProviderHandler } from "@/store/controllers/ProviderController";
import { AddProviderDTO } from "@/store/dtos/request/AddProviderDTO";
import showToast from "@/utils/showToast";
import { useSearchParams } from "react-router-dom";
// import FacebookLogin from "@greatsumini/react-facebook-login";

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
const SelfDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAppSelector(selectLoggedInUser);
  const dispatch = useAppDispatch();
  const editSelfDetailsModalRef = useRef();
  const configuredProviders = useAppSelector(selectConfiguredProviders);
  const openEditSelfDetails = () => {
    if (
      editSelfDetailsModalRef.current &&
      "openModal" in editSelfDetailsModalRef.current
    ) {
      (
        editSelfDetailsModalRef.current as { openModal: () => void }
      ).openModal();
    }
  };

  const youtubeLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let addProviderDTO: AddProviderDTO = {
        accessCode: tokenResponse.code,
        name: ProviderName.YOUTUBE,
      };
      const { message, success } = await addProviderHandler(
        dispatch,
        addProviderDTO
      );
      if (success) {
        showToast({ title: message, color: "success" });
      } else {
        showToast({ title: message, color: "danger" });
      }
    },
    flow: "auth-code",
    include_granted_scopes: true,
    ux_mode: "popup",
    scope:
      "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload",
  });

  const twitterLoginSetup = async () => {
    localStorage.setItem("twitterLogin", "true");
    const clientId = import.meta.env.VITE_X_CLIENT_ID;
    const applicationUrl = import.meta.env.VITE_FRONTEND_URL;
    const state = import.meta.env.VITE_X_STATE;
    const code_challenge = import.meta.env.VITE_X_CODE_CHALLENGE;
    const code_challenge_method = import.meta.env.VITE_X_CODE_CHALLENGE_METHOD;
    const scope = import.meta.env.VITE_X_SCOPE;
    const loginUrl = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${applicationUrl}/dashboard&scope=${scope}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}`;
    window.location.href = loginUrl;
  };

  const twitterLogin = async () => {
    if (localStorage.getItem("twitterLogin") === "true") {
      localStorage.removeItem("twitterLogin");
      const accessToken = searchParams.get("code");
      const state = searchParams.get("state");
      console.log("accessToken : ", accessToken);
      console.log("state : ", state);
      if (!accessToken) {
        showToast({
          title: "Failed to authenticate with Twitter",
          color: "danger",
        });
        return;
      }
      searchParams.delete("code");
      searchParams.delete("state");
      setSearchParams(searchParams);

      let addProviderDTO: AddProviderDTO = {
        accessCode: accessToken,
        name: ProviderName.TWITTER,
      };
      const { message, success } = await addProviderHandler(
        dispatch,
        addProviderDTO
      );
      if (success) {
        showToast({ title: message, color: "success" });
      } else {
        showToast({ title: message, color: "danger" });
      }
    }
  };

  useEffect(() => {
    twitterLogin();
  }, []);
  return (
    <>
      <EditSelfDetailsModal ref={editSelfDetailsModalRef} />
      <Card className="border border-gray-300 shadow-md  w-full rounded-xl p-6 h-full">
        <CardHeader className="text-xl font-semibold border-b pb-3 flex justify-between">
          Self Details{" "}
          <Button isIconOnly onPress={openEditSelfDetails}>
            <Edit />
          </Button>
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
            <DetailItem label="Email ID" value={user?.emailId || ""} />
            <DetailItem label="About Me" value={user?.selfDescription || ""} />
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
                      src={SocialMediaIcon({
                        platform: handle.socialMediaPlatformName,
                      })}
                      alt={handle.socialMediaPlatformName}
                    />
                  </Button>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-1">N/A</p>
            )}
          </div>
          {user?.userRole === AllRoles.CONTENT_CREATOR && (
            <div className="mt-3 flex flex-col gap-2">
              <span className="text-gray-600 font-medium">Providers</span>
              <div className="flex gap-2 flex-wrap">
                {siteConfig.providers.map((configProvider) => {
                  return (
                    <Button
                      isIconOnly
                      onPress={() => {
                        switch (configProvider.id) {
                          case "yt":
                            youtubeLogin();
                            break;
                          case "x":
                            twitterLoginSetup();
                            break;
                          default:
                            return;
                        }
                      }}
                      isDisabled={
                        configuredProviders?.filter(
                          (provider) =>
                            provider.providerName === configProvider.platform
                        ).length > 0
                      }
                    >
                      <img
                        src={configProvider?.icon}
                        alt={configProvider?.name}
                      />
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default SelfDetails;
