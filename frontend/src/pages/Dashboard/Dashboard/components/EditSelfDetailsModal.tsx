import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import React, {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ValidationError } from "@react-types/shared";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { SocialMediaHandle } from "@/store/dtos/helper";
import CustomAvatar from "@/components/CustomAvatar";
import { EditIcon, Pencil } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { PlusIcon } from "../../PostedJobs/PostedJobs";
import { SocialMediaHandleType } from "@/utils/enums";
import { Label } from "@/components/ui/label";
import showToast from "@/utils/showToast";
import { updateSelfDetailsHandler } from "@/store/controllers/UserController";
type FormErrors = {
  firstName?: string;
  lastName?: string;
  selfDescription?: string;
  socialMediaHandles?: string;
  profilePicture?: string;
};
export type UserSelfDetails = {
  firstName: string;
  lastName: string;
  selfDescription: string;
  socialMediaHandles: Array<SocialMediaHandle>;
  profilePicture: null | File;
};
const EditSelfDetailsModal = forwardRef((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useAppSelector(selectLoggedInUser);
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const [newSocialMediaHandle, setNewSocialMediaHandle] =
    useState<SocialMediaHandle>({
      socialMediaHandleUrl: "",
      socialMediaPlatformName: "",
    });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelfDetails({
        ...selfDetails,
        profilePicture: file,
      });
      const objectUrl = URL.createObjectURL(file);
      console.log(objectUrl);
      setPreviewUrl(objectUrl);
    }
  };

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));
  const [selfDetails, setSelfDetails] = useState<UserSelfDetails>({
    firstName: "",
    lastName: "",
    selfDescription: "",
    socialMediaHandles: [],
    profilePicture: null,
  });
  const remainingSocialMediaHandles = useMemo(() => {
    let allPlatforms = [
      SocialMediaHandleType.FACEBOOK,
      SocialMediaHandleType.INSTAGRAM,
      SocialMediaHandleType.TWITTER,
      SocialMediaHandleType.YOUTUBE,
    ];
    allPlatforms = allPlatforms.filter((platform) => {
      let len = selfDetails.socialMediaHandles.filter(
        (handle) => handle.socialMediaPlatformName === platform
      ).length;

      return len === 0;
    });
    return allPlatforms;
  }, [selfDetails]);

  const handleAvatarClick = () => {
    if (profilePictureInputRef.current) {
      profilePictureInputRef.current.click();
    }
  };
  const updateSelfDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { message, success } = await updateSelfDetailsHandler(
      selfDetails,
      dispatch
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

    onClose();
  };

  useEffect(() => {
    if (user) {
      setSelfDetails({
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePicture: null,
        selfDescription: user?.selfDescription,
        socialMediaHandles: user?.socialMediaHandles,
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Update Self Details
        </ModalHeader>

        <ModalBody>
          <Form
            className="w-full justify-center items-center flex flex-col gap-4 pb-4"
            validationErrors={errors as Record<string, ValidationError>}
            onSubmit={updateSelfDetails}
          >
            <div className="relative group">
              <div className="cursor-pointer" onClick={handleAvatarClick}>
                <CustomAvatar
                  src={previewUrl ? previewUrl : user?.profilePicture}
                  size="lg"
                  firstName={selfDetails?.firstName}
                  lastName={selfDetails?.lastName}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 rounded-full group-hover:opacity-100 transition-opacity duration-300">
                  <Pencil />
                </div>
              </div>
              <Input
                className="hidden"
                ref={profilePictureInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <Input
              isRequired
              label="First Name"
              labelPlacement="outside"
              name="firstName"
              placeholder="Enter your first name."
              value={selfDetails?.firstName}
              onChange={(e) => {
                setSelfDetails({
                  ...selfDetails,
                  firstName: e.target.value,
                });
              }}
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return "Please enter your first name";
                }
                return errors.firstName;
              }}
            />
            <Input
              isRequired
              label="Last Name"
              labelPlacement="outside"
              name="lastName"
              placeholder="Enter your last name."
              value={selfDetails?.lastName}
              onChange={(e) => {
                setSelfDetails({
                  ...selfDetails,
                  lastName: e.target.value,
                });
              }}
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return "Please enter your last name";
                }
                return errors.firstName;
              }}
            />
            <Textarea
              maxLength={200}
              label="About Me"
              labelPlacement="outside"
              name="selfDescription"
              placeholder="Enter something about yourself."
              value={selfDetails?.selfDescription}
              onChange={(e) => {
                setSelfDetails({
                  ...selfDetails,
                  selfDescription: e.target.value,
                });
              }}
            />
            <div className="w-full flex flex-col gap-2">
              <Label> Select a Social Media Platform</Label>
              <div className="flex gap-2 w-full">
                <Select
                  placeholder="Social Media Platform"
                  name="socialMediaPlatform"
                  labelPlacement="outside"
                  value={newSocialMediaHandle?.socialMediaPlatformName}
                  onChange={(e) => {
                    setNewSocialMediaHandle({
                      ...newSocialMediaHandle,
                      socialMediaPlatformName: e.target.value,
                    });
                  }}
                >
                  {remainingSocialMediaHandles.map((socialMediaHandle) => (
                    <SelectItem key={socialMediaHandle}>
                      {socialMediaHandle}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  placeholder="Enter our social media url"
                  value={newSocialMediaHandle.socialMediaHandleUrl}
                  onChange={(e) =>
                    setNewSocialMediaHandle({
                      ...newSocialMediaHandle,
                      socialMediaHandleUrl: e.target.value,
                    })
                  }
                />

                <Button
                  isDisabled={
                    newSocialMediaHandle.socialMediaHandleUrl === "" ||
                    newSocialMediaHandle.socialMediaPlatformName === ""
                  }
                  onPress={() => {
                    if (
                      newSocialMediaHandle.socialMediaHandleUrl != "" &&
                      newSocialMediaHandle.socialMediaPlatformName != ""
                    ) {
                      let newSocialMediaHandles = [
                        ...selfDetails.socialMediaHandles,
                        newSocialMediaHandle,
                      ];

                      setSelfDetails({
                        ...selfDetails,
                        socialMediaHandles: newSocialMediaHandles,
                      });
                      setNewSocialMediaHandle({
                        socialMediaHandleUrl: "",
                        socialMediaPlatformName: "",
                      });
                    } else {
                      showToast({
                        color: "danger",
                        title:
                          "Please select a social media handle name and enter your profile URL as well",
                      });
                    }
                  }}
                >
                  Add <PlusIcon />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selfDetails?.socialMediaHandles?.map(
                  (socialMediaHandle, index) => (
                    <Chip
                      key={index}
                      variant="flat"
                      onClose={() => {
                        let socialMediaHandles =
                          selfDetails.socialMediaHandles.filter(
                            (media) =>
                              media.socialMediaPlatformName !==
                              socialMediaHandle.socialMediaPlatformName
                          );
                        setSelfDetails({
                          ...selfDetails,
                          socialMediaHandles: socialMediaHandles,
                        });
                      }}
                    >
                      <Link href={socialMediaHandle?.socialMediaHandleUrl}>
                        {socialMediaHandle?.socialMediaPlatformName}
                      </Link>
                    </Chip>
                  )
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Update
            </Button>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default EditSelfDetailsModal;
