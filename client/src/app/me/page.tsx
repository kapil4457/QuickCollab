"use client";

import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@mui/material";
import Tilt from "react-parallax-tilt";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CancelIcon from "@mui/icons-material/Cancel";

import ReactPlayer from "react-player";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import {
  addNewProjectReducer,
  addNewProjectReducerReset,
  deleteProject,
  deleteProjectReset,
  updateProject,
  updateProjectReset,
} from "@/redux/slices/projectSlice";
import cloudinaryUploader from "@/utils/cloudinary";
import { useRouter } from "next/navigation";
import {
  fetchMe,
  updateAvailability,
  updateAvailabilityReset,
  updateUserController,
  updateUserControllerReset,
} from "@/redux/slices/userSlice";

import { CONTENT_CREATOR, SERVICE_PROVIDER } from "@/utils/roles";
import { PageProps } from "../../../.next/types/app/layout";
import { Switch } from "@/components/ui/switch";
import { Delete, Edit, Launch } from "@mui/icons-material";
import Link from "next/link";

type FormDataProps = {
  title: string;
  description: string;
  images: FileList | null;
  videos: FileList | null;
  link: string;
};

type socialType = {
  title: string;
  link: string;
};

type updateUserProps = {
  name: string;
  avatar: any | null;
  about: string;
  servicesOffered: Array<string>;
  socials: Array<socialType>;
};

type jobValProps = {
  jobTitle: string;
  jobDescription: string;
  location: string;
  estimatedTime: number;
  minPay: number;
  maxPay: number;
};

const page: FC<PageProps> = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [tempSocials, setTempSocials] = useState({
    title: "",
    link: "",
  });
  const [isAvailable, setIsAvailable] = useState<boolean>();
  const [projectData, setProjectData] = useState<FormDataProps>({
    title: "",
    description: "",
    images: null,
    videos: null,
    link: "",
  });
  const [newTag, setNewTag] = useState("");

  const [jobVal, setJobVal] = useState<jobValProps>({
    jobTitle: "",
    jobDescription: "",
    location: "",
    estimatedTime: 0,
    maxPay: 0,
    minPay: 0,
  });

  const [updatedProjectData, setUpdatedProjectData] = useState({
    title: "",
    description: "",
    link: "",
    images: [],
    videos: [],
  });

  const [updateUser, setUpdatedUser] = useState<updateUserProps>({
    name: "",
    avatar: null,
    about: "",
    servicesOffered: [],
    socials: [],
  });

  const {
    success: updateUserDetailsSuccess,
    message: updateUserDetailsMessage,
  } = useAppSelector((state) => state.userSlice.updatedUser);

  const { message: updateMessage, success: updateSuccess } = useAppSelector(
    (state) => state.projectSlice.updateValue
  );
  const {
    user,
    isAuthenticated,
    loading: userLoader,
  } = useAppSelector((state) => state.userSlice.value);
  const {
    success: availabilityStatusSuccess,
    message: availabilityStatusMessage,
  } = useAppSelector((state) => state.userSlice.availabilityStatus);
  const {
    success,
    loading: projectLoader,
    message,
  } = useAppSelector((state) => state.projectSlice.value);

  const { message: deleteMessage, success: deleteSuccess } = useAppSelector(
    (state) => state.projectSlice.deleteValue
  );
  const addProject = async () => {
    toast.loading("Adding project.Do not reload or leave the page.", {
      duration: 3000,
    });
    if (projectData.title === "") {
      toast.error("Please enter a title.");
      return;
    }
    if (projectData.description === "") {
      toast.error("Please enter a description.");
      return;
    }
    if (projectData.images?.length === 0) {
      toast.error("Please enter some images realted to your project.");
      return;
    }

    let images = [];
    let videos = [];

    for (let ele of projectData?.images) {
      if (ele.size > 10485760) {
        toast.error(`File : ${ele.name} has a size greater than 10MB.`);
        continue;
      }
      const data = await cloudinaryUploader({
        ele,
        location: "projectImages",
        type: "image",
      });
      let image = {
        asset_id: data.asset_id,
        public_id: data.public_id,
        signature: data.signature,
        width: data.width,
        height: data.height,
        format: data.format,
        resource_type: data.resource_type,
        created_at: data.created_at,
        type: data.type,
        url: data.url,
        folder: data.folder,
      };
      images.push(image);
    }
    if (projectData.videos) {
      for (let ele of projectData.videos) {
        if (ele.size > 100000000) {
          toast.error(`File : ${ele.name} has a size greater than 100MB.`);
          continue;
        }
        const data = await cloudinaryUploader({
          ele,
          location: "projectVideos",
          type: "video",
        });

        let video = {
          asset_id: data.asset_id,
          public_id: data.public_id,
          signature: data.signature,
          width: data.width,
          resource_type: data.resource_type,
          height: data.height,
          format: data.format,
          created_at: data.created_at,
          type: data.type,
          url: data.url,
          folder: data.folder,
        };
        videos.push(video);
      }
    }

    const data = {
      projectTitle: projectData.title,
      projectDescription: projectData.description,
      projectImages: images,
      projectLink: projectData.link,
    };
    if (videos.length !== 0) {
      data.projectVideos = videos;
    }
    dispatch(addNewProjectReducer(data));
  };

  useEffect(() => {
    if (deleteSuccess === true) {
      toast.success(deleteMessage);
      dispatch(deleteProjectReset({}));
      dispatch(fetchMe());
    } else if (deleteSuccess === false) {
      toast.error(deleteMessage);
    }
  }, [deleteSuccess]);
  useEffect(() => {
    if (user) {
      setIsAvailable(user?.available);
    }
    if (!user || success === true) {
      dispatch(fetchMe());
    }
  }, [user]);
  useEffect(() => {
    if (success) {
      toast.success("Project Added successfully!!");
      dispatch(addNewProjectReducerReset({}));
    }
  }, [success]);

  useEffect(() => {
    if (availabilityStatusSuccess === true) {
      setIsAvailable(!isAvailable);
      toast.success(availabilityStatusMessage);
      dispatch(updateAvailabilityReset({}));
    }
  }, [availabilityStatusSuccess]);
  useEffect(() => {
    if (updateSuccess === true) {
      toast.success(updateMessage);
      dispatch(fetchMe());
      dispatch(updateProjectReset({}));
    } else if (updateSuccess === false) {
      toast.error(updateMessage);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (updateUserDetailsSuccess === true) {
      toast.success(updateUserDetailsMessage);
      dispatch(fetchMe());
    } else if (updateUserDetailsSuccess === false) {
      toast.error(updateUserDetailsMessage);
    }
    dispatch(updateUserControllerReset({}));
  }, [updateUserDetailsSuccess]);

  useEffect(() => {
    if (isAuthenticated === false && userLoader === false) {
      toast.success("Please log-in to access this page.");
      router.push("/");
    }
  }, [isAuthenticated]);
  return (
    <>
      <div
        className="mb-20 flex flex-col  mt-[4rem] lg:mt-[6rem] lg:h-[calc(100vh-6rem)] lg:grid gap-6"
        style={{ gridTemplateColumns: "20%  75%" }}
      >
        <div className="h-[100%] lg:max-h-[calc(100vh-6rem)] left border-r-2 flex flex-col items-center pt-20 gap-10 w-full">
          <div className="flex flex-col gap-2">
            <Tilt tiltEnable tiltReverse transitionSpeed={200}>
              <img
                src={
                  user?.avatar?.url ||
                  "https://res.cloudinary.com/dpeldzvz6/image/upload/v1706350898/projectImages/l6tlo0eqdpxwchsqgc8r.jpg"
                }
                alt={user?.name}
                // height={200}
                // width={200}
                className="w-[15rem] h-[15rem] shadow-customLightShadow dark:shadow-customDarkShadow"
                style={{
                  borderRadius: "100%",
                  // boxShadow: "0 0 20px 0 rgba(0,0,0,0.9)",
                }}
              />
            </Tilt>

            <h3 className="w-full text-3xl self-center flex justify-center items-center font-bold">
              {user?.name}
            </h3>
            {user && user?.rating && user?.role === SERVICE_PROVIDER && (
              <Rating
                value={user?.rating}
                precision={0.1}
                readOnly
                className="w-full items-center self-center justify-center"
              />
            )}
          </div>
          {user && user?.servicesOffered && user?.role === SERVICE_PROVIDER && (
            <div className="tags w-full flex flex-col p-5 gap-2 ">
              <h3 className="w-full  text-xl">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {user?.servicesOffered?.map((ele: string) => {
                  return (
                    <>
                      <Badge>{ele}</Badge>
                    </>
                  );
                })}
              </div>
            </div>
          )}
          {user && user?.socialPlatform && (
            <div className=" w-full flex flex-col p-5 gap-2 ">
              <h3 className="w-full  text-2xl">Socials</h3>
              <div className="w-full flex flex-wrap gap-2">
                {user?.socialPlatform?.map((ele) => {
                  return (
                    <Link href={ele?.link} target="_blank">
                      <Button variant={"link"} className="flex gap-1">
                        {ele?.title} <Launch className="w-4 h-4" />
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className=" flex flex-col gap-10 lg:gap-3 p-3 lg:p-0 gap">
          {user && user?.role === SERVICE_PROVIDER && (
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={isAvailable}
                  onCheckedChange={(val) => {
                    dispatch(updateAvailability({ status: val }));
                  }}
                />
                <Label htmlFor="availability">Available</Label>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"secondary"}>Add Project</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogDescription>
                      Add projects to your profile to showcase your talent.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="name"
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            title: e.target.value,
                          });
                        }}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            description: e.target.value,
                          });
                        }}
                        className="w-[14rem] lg:w-[22rem] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="images" className="text-right">
                        Images
                      </Label>
                      <input
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            images: e.target.files,
                          });
                        }}
                        multiple
                        id="images"
                        className="col-span-3"
                        type="file"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="video" className="text-right">
                        Video
                      </Label>
                      <input
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            videos: e.target.files,
                          });
                        }}
                        accept=".mp4"
                        id="video"
                        multiple
                        className="col-span-3"
                        type="file"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="link" className="text-right">
                        Project Link <br />
                        (if any)
                      </Label>
                      <Input
                        id="link"
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            link: e.target.value,
                          });
                        }}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addProject}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <ScrollArea className="right h-[100%] lg:max-h-[calc(100vh-6rem)] ">
            <div className="flex flex-col gap-14">
              <div className="about flex flex-col gap-5">
                <div className="flex justify-between w-full">
                  <div className="flex gap-5">
                    <h2 className="text-3xl font-bold">About</h2>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="flex gap-3"
                          onClick={() => {
                            setUpdatedUser({
                              about: user?.about,
                              avatar: user?.avatar,
                              name: user?.name,
                              servicesOffered: user?.servicesOffered,
                              socials: user?.socialPlatform,
                            });
                          }}
                        >
                          Edit Profile
                          <Edit className="w-5 h-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="w-full flex items-center justify-center ">
                            <div
                              className="relative"
                              style={{ borderRadius: "100%" }}
                            >
                              <img
                                src={
                                  updateUser?.avatar?.url ||
                                  "https://res.cloudinary.com/dpeldzvz6/image/upload/v1706350898/projectImages/l6tlo0eqdpxwchsqgc8r.jpg"
                                }
                                className="h-36 w-36 object-cover image "
                                style={{ borderRadius: "100%" }}
                              />
                              <div className="absolute image-cover">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png"
                                  className="h-full w-full"
                                  onChange={async (e) => {
                                    toast.loading(
                                      "Uploading image.Please wait...",
                                      {
                                        duration: 3000,
                                      }
                                    );
                                    const data = await cloudinaryUploader({
                                      ele: e.target.files[0] as File,
                                      location: "profile_pics",
                                      type: "image",
                                    });

                                    setUpdatedUser({
                                      ...updateUser,
                                      avatar: data,
                                    });
                                  }}
                                />
                                <Edit className="absolute h-11 w-11" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={updateUser?.name}
                              onChange={(e) => {
                                setUpdatedUser({
                                  ...updateUser,
                                  name: e.target.value,
                                });
                              }}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              About
                            </Label>
                            <Textarea
                              id="description"
                              value={updateUser?.about}
                              onChange={(e) => {
                                setUpdatedUser({
                                  ...updateUser,
                                  about: e.target.value,
                                });
                              }}
                              className="col-span-3"
                            />
                          </div>
                          {user && user?.role === SERVICE_PROVIDER && (
                            <div className="grid gap-4 justify-end grid-cols-4">
                              <Label htmlFor="tags" className="text-right">
                                Tags
                              </Label>

                              <div className="tags flex flex-col gap-3 col-span-3">
                                <Input
                                  id="tags"
                                  value={newTag}
                                  onChange={(e) => {
                                    setNewTag(e.target.value);
                                  }}
                                  className="w-full"
                                  onKeyDownCapture={(e) => {
                                    if (e.key === "Enter") {
                                      let newTags = [];
                                      updateUser?.servicesOffered?.map((l) => {
                                        newTags.push(l);
                                      });
                                      // let newTags =
                                      //   updateUser.servicesOffered as Array<string>;

                                      newTags.push(newTag);
                                      setUpdatedUser({
                                        ...updateUser,
                                        servicesOffered: newTags,
                                      });
                                    }
                                  }}
                                />

                                <div className="flex flex-wrap gap-2">
                                  {updateUser?.servicesOffered?.map(
                                    (item, key) => (
                                      <Badge key={key}>
                                        {item}
                                        <CancelIcon
                                          className="w-4 h-4 cursor-pointer"
                                          onClick={() => {
                                            let newTags =
                                              updateUser?.servicesOffered.filter(
                                                (ele) => {
                                                  if (ele !== item) {
                                                    return ele;
                                                  }
                                                }
                                              );

                                            setUpdatedUser({
                                              ...updateUser,
                                              servicesOffered: newTags,
                                            });
                                          }}
                                        />
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {user && (
                            <div className="flex flex-col gap-2">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="social-links"
                                  className="text-right"
                                >
                                  Socials
                                </Label>
                                <div
                                  id="social-links"
                                  className=" flex w-full col-span-3 gap-2"
                                >
                                  <Input
                                    id="social-links-title"
                                    placeholder="Title"
                                    onChange={(e) => {
                                      setTempSocials({
                                        ...tempSocials,
                                        title: e.target.value,
                                      });
                                    }}
                                  />
                                  <Input
                                    placeholder="Link"
                                    id="social-links-link"
                                    onChange={(e) => {
                                      setTempSocials({
                                        ...tempSocials,
                                        link: e.target.value,
                                      });
                                    }}
                                  />
                                  <Button
                                    onClick={() => {
                                      let newSocials = [];

                                      for (let item of updateUser.socials) {
                                        newSocials.push(item);
                                      }
                                      newSocials.push({
                                        title: tempSocials.title,
                                        link: tempSocials.link,
                                      });

                                      setUpdatedUser({
                                        ...updateUser,
                                        socials: newSocials,
                                      });
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {updateUser?.socials?.map((item, key) => (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge
                                          className="flex gap-2"
                                          onClick={() => {
                                            let newSocials = [];
                                            for (let ele of updateUser?.socials) {
                                              if (
                                                ele.link !== item.link ||
                                                ele.title !== item.title
                                              ) {
                                                newSocials.push(ele);
                                              }
                                            }

                                            setUpdatedUser({
                                              ...updateUser,
                                              socials: newSocials,
                                            });
                                          }}
                                        >
                                          {item?.title}
                                          <CancelIcon className="w-5 h-5 cursor-pointer" />
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{item?.link}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              dispatch(updateUserController(updateUser));
                            }}
                          >
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {user && user?.role && user?.role === CONTENT_CREATOR && (
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary">Create Job Alert</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Create Job</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="title" className="text-right">
                                Job Title
                              </Label>
                              <Input
                                id="title"
                                value={jobVal?.jobTitle}
                                onChange={(e) => {
                                  setJobVal({
                                    ...jobVal,
                                    jobTitle: e.target.value,
                                  });
                                }}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="job-description"
                                className="text-right"
                              >
                                Job Description.
                              </Label>
                              <Textarea
                                style={{ resize: "none" }}
                                id="job-description"
                                className="col-span-3"
                                value={jobVal?.jobDescription}
                                onChange={(e) => {
                                  setJobVal({
                                    ...jobVal,
                                    jobDescription: e.target.value,
                                  });
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="job-location"
                                className="text-right"
                              >
                                Job Location
                              </Label>
                              <Input
                                id="job-location"
                                className="col-span-3"
                                value={jobVal?.location}
                                onChange={(e) => {
                                  setJobVal({
                                    ...jobVal,
                                    location: e.target.value,
                                  });
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="job-estimated-time"
                                className="text-right"
                              >
                                Estimated time (in months)
                              </Label>
                              <Input
                                id="job-estimated-time"
                                className="col-span-3"
                                type="number"
                                value={jobVal?.estimatedTime}
                                onChange={(e) => {
                                  setJobVal({
                                    ...jobVal,
                                    estimatedTime: e.target.valueAsNumber,
                                  });
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="job-min-pay"
                                className="text-right"
                              >
                                Min. Pay (in Rupees)
                              </Label>
                              <Input
                                id="job-min-pay"
                                className="col-span-3"
                                type="number"
                                value={jobVal?.minPay}
                                onChange={(e) => {
                                  setJobVal({
                                    ...jobVal,
                                    minPay: e.target.valueAsNumber,
                                  });
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="job-max-pay"
                                className="text-right"
                              >
                                Max. Pay (in Rupees)
                              </Label>
                              <Input
                                id="job-max-pay"
                                className="col-span-3"
                                type="number"
                                value={jobVal?.maxPay}
                                onChange={(e) => {
                                  setJobVal({
                                    ...jobVal,
                                    maxPay: e.target.valueAsNumber,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => {
                                dispatch(createJob());
                              }}
                            >
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>

                {user && user?.about && <p>{user?.about}</p>}
              </div>
              {user && user?.role === SERVICE_PROVIDER && (
                <div className="previousWork flex flex-col gap-4">
                  <h2 className="text-3xl font-bold">Work Samples</h2>
                  <div className="flex w-full justify-center items-center ">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user &&
                          user?.providerPreviousWork?.map(
                            (ele, key: number) => {
                              let media = [];
                              for (let item of ele?.projectImages) {
                                media.push(item);
                              }
                              for (let item of ele?.projectVideos) {
                                media.push(item);
                              }
                              return (
                                <>
                                  <TableRow key={key} className="">
                                    <TableCell className="font-medium  ">
                                      <div className="flex items-center gap-5">
                                        <img
                                          alt="Project Picture"
                                          src={ele?.projectImages[0]?.url}
                                          style={{
                                            borderRadius: "10px",
                                            objectFit: "contain",
                                            height: "100%",
                                            width: "5rem",
                                          }}
                                        />
                                        <p
                                          style={{ display: "none" }}
                                          className="lg:!block"
                                        >
                                          {ele?.projectTitle}
                                        </p>
                                      </div>
                                    </TableCell>

                                    <TableCell>
                                      <Dialog>
                                        <DialogTrigger>
                                          <Button className="flex gap-2 text-blue-500 hover:text-blue-700 cursor-pointer">
                                            About
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle className="flex gap-3">
                                              {ele?.projectTitle}
                                              {ele?.projectLink && (
                                                <a
                                                  href={ele?.projectLink}
                                                  target="_blank"
                                                >
                                                  <Launch className="h-4 w-4 text-blue-600" />
                                                </a>
                                              )}
                                            </DialogTitle>
                                            <DialogDescription>
                                              {ele?.projectDescription}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="w-full flex justify-center items-center">
                                            <Carousel className="w-[80%] ">
                                              <CarouselContent>
                                                {media?.map((item, index) => {
                                                  return (
                                                    <CarouselItem key={index}>
                                                      <div className="p-1">
                                                        <Card>
                                                          <CardContent className="flex aspect-square items-center justify-center p-6">
                                                            {item?.resource_type ===
                                                              "image" && (
                                                              <>
                                                                <img
                                                                  src={item.url}
                                                                  alt={
                                                                    item?.resource_type
                                                                  }
                                                                  className="w-full h-full"
                                                                />
                                                              </>
                                                            )}
                                                            {item?.resource_type ===
                                                              "video" && (
                                                              <>
                                                                <ReactPlayer
                                                                  url={
                                                                    item?.url
                                                                  }
                                                                  playing={
                                                                    false
                                                                  }
                                                                  controls
                                                                  width={"100%"}
                                                                  height={
                                                                    "100%"
                                                                  }
                                                                />
                                                              </>
                                                            )}
                                                          </CardContent>
                                                        </Card>
                                                      </div>
                                                    </CarouselItem>
                                                  );
                                                })}
                                              </CarouselContent>
                                              <CarouselPrevious />
                                              <CarouselNext />
                                            </Carousel>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </TableCell>
                                    <TableCell className="h-full font-medium flex gap-x-3">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            className="cursor-pointer"
                                            onClick={() => {
                                              setUpdatedProjectData({
                                                ...updatedProjectData,
                                                link: ele?.projectLink,
                                                title: ele?.projectTitle,
                                                description:
                                                  ele?.projectDescription,
                                              });
                                            }}
                                          >
                                            <Edit />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Edit Project : {ele?.projectTitle}
                                            </DialogTitle>
                                          </DialogHeader>
                                          <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                              <Label
                                                htmlFor="title"
                                                className="text-right"
                                              >
                                                Title
                                              </Label>
                                              <Input
                                                id="title"
                                                value={
                                                  updatedProjectData?.title
                                                }
                                                className="col-span-3"
                                                onChange={(e) => {
                                                  setUpdatedProjectData({
                                                    ...updatedProjectData,
                                                    title: e.target.value,
                                                  });
                                                }}
                                              />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                              <Label
                                                htmlFor="description"
                                                className="text-right"
                                              >
                                                Description
                                              </Label>
                                              <Textarea
                                                id="description"
                                                value={
                                                  updatedProjectData?.description
                                                }
                                                onChange={(e) => {
                                                  setUpdatedProjectData({
                                                    ...updatedProjectData,
                                                    description: e.target.value,
                                                  });
                                                }}
                                                className="col-span-3"
                                              />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                              <Label
                                                htmlFor="link"
                                                className="text-right"
                                              >
                                                Link
                                              </Label>
                                              <Input
                                                id="link"
                                                value={updatedProjectData?.link}
                                                className="col-span-3"
                                                onChange={(e) => {
                                                  setUpdatedProjectData({
                                                    ...updatedProjectData,
                                                    link: e.target.value,
                                                  });
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              onClick={() =>
                                                dispatch(
                                                  updateProject({
                                                    projectLink:
                                                      updatedProjectData.link,
                                                    projectTitle:
                                                      updatedProjectData.title,
                                                    projectDescription:
                                                      updatedProjectData.description,
                                                    id: ele?._id,
                                                  })
                                                )
                                              }
                                            >
                                              Save changes
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>

                                      <Button
                                        className="cursor-pointer"
                                        variant={"destructive"}
                                        onClick={() => {
                                          dispatch(deleteProject(ele?._id));
                                          toast.loading("Deleting Project", {
                                            duration: 2000,
                                          });
                                        }}
                                      >
                                        <Delete />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </>
                              );
                            }
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default page;
