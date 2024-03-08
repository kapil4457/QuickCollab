"use client";

import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { fetchUserDetails } from "@/redux/slices/profileSlice";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@mui/material";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PageProps } from "../../../../.next/types/app/layout";
import { CONTENT_CREATOR, SERVICE_PROVIDER } from "@/utils/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactPlayer from "react-player";
import { Chat, ChatBubble, Launch } from "@mui/icons-material";
import toast from "react-hot-toast";
import Link from "next/link";
import { applyToJob } from "@/redux/slices/jobSlice";
import { createConversation } from "@/redux/slices/chatSlice";

const page: FC<PageProps> = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const {
    message: createConversationMessage,
    success: createConversationSuccess,
  } = useAppSelector((state) => state.chatSlice.createConversation);
  const { user, loading } = useAppSelector((state) => state.profileSlice.value);
  const {
    user: self,
    isAuthenticated,
    loading: userLoader,
  } = useAppSelector((state) => state.userSlice.value);
  useEffect(() => {
    dispatch(fetchUserDetails(params.id));
  }, []);
  useEffect(() => {
    if (self && user && self?._id === user?._id) {
      router.push("/me");
    }
  }, [self, user]);

  const createConversationHandler = async () => {
    const info = {
      isGroup: false,
      name: user?.name,
      groupLogo: user?.avatar?._id,
      members: [user?._id],
    };

    dispatch(createConversation(info));
    router.push(`/chats/${params?.id}`);
  };
  useEffect(() => {
    if (isAuthenticated === false && userLoader === false) {
      toast.success("Please log-in to access this page.");
      router.push("/");
    }
  }, [isAuthenticated, userLoader]);

  return (
    <>
      <div
        className="mb-10 flex flex-col   mt-[4rem] h-full lg:mt-[7rem] lg:h-[calc(100vh-7rem)] lg:grid gap-6"
        style={{ gridTemplateColumns: "20%  75%" }}
      >
        <div className=" max-h-[calc(100vh-6rem)] left border-r-2 flex flex-col items-center pt-20 gap-10 w-full">
          <div className="flex flex-col gap-2">
            <Tilt tiltEnable tiltReverse transitionSpeed={200}>
              <Image
                src={user?.avatar?.url}
                alt={user?.name}
                height={200}
                width={200}
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
            {user &&
              user?.rating &&
              user?.role === SERVICE_PROVIDER &&
              user?.rating > 0 && (
                <div className="flex gap-2">
                  <Rating
                    name="user-rating"
                    value={user?.rating}
                    precision={0.1}
                    readOnly
                  />
                  ({user?.providerPreviousWork?.length})
                </div>
              )}
          </div>
          {user && user?.services && (
            <div className="tags w-full flex flex-col p-5 gap-2 ">
              <h3 className="w-full  text-xl">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {user?.services?.map((ele: string) => {
                  return <Badge>{ele}</Badge>;
                })}
              </div>
            </div>
          )}
          {user && user?.socialPlatform && user?.role === CONTENT_CREATOR && (
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
        <div className="right p-3 lg:p-0">
          <ScrollArea className="right h-full min-h-[calc(100vh-6rem)]">
            <div className="flex flex-col gap-14">
              <div className="about flex flex-col gap-3">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">About</h2>
                  {self?.role === CONTENT_CREATOR && (
                    <Button
                      variant={"secondary"}
                      className="cursor-pointer flex justify-between gap-3"
                      onClick={() => {
                        createConversationHandler();
                      }}
                    >
                      Chat <Chat className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                {user && user?.about && <p>{user?.about}</p>}
              </div>
              {user && user?.role === SERVICE_PROVIDER && (
                <div className="previousWork">
                  <h2 className="text-3xl font-bold">Work Samples</h2>
                  <div className="flex w-full justify-center items-center ">
                    <Table className="w-full lg:w-[70%] ">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead className="text-right flex justify-end">
                            Details
                          </TableHead>
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
                                          className="h-14 w-24"
                                          // width={45}
                                          // height={45}
                                          style={{
                                            borderRadius: "10px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        {ele?.projectTitle}
                                      </div>
                                    </TableCell>

                                    <TableCell className="text-right flex justify-end">
                                      <Dialog>
                                        <DialogTrigger>
                                          <Button className="flex gap-2 text-blue-500 hover:text-blue-700">
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
              {user && user?.role === CONTENT_CREATOR && (
                <>
                  <h2 className="text-3xl font-bold">Live Job Postings </h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>About Job</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user?.jobs
                        ?.filter((ele, key: number) => {
                          if (
                            key + 1 >= (pageNo - 1) * itemsPerPage &&
                            key + 1 <= pageNo * itemsPerPage
                          ) {
                            return ele;
                          }
                        })
                        ?.map((job, key) => (
                          <TableRow key={key} className="">
                            <TableCell className="sm:text-center md:text-left">
                              {job?.jobTitle}
                            </TableCell>
                            <TableCell>{job?.estimatedTime} months</TableCell>
                            <TableCell>{job?.location}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger>
                                  <Button>Details</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader className="flex flex-col gap-2">
                                    <DialogTitle>
                                      Job Description : {job?.jobTitle}
                                    </DialogTitle>
                                    <DialogDescription>
                                      <div className="w-full flex items-start justify-start">
                                        <b>Description : </b>
                                        {job?.jobDescription}
                                      </div>
                                      <div className="w-full flex items-start justify-start">
                                        <b>Location : </b>
                                        {job?.location}
                                      </div>
                                      <div className="w-full flex items-start justify-start">
                                        <b>Duration : </b>
                                        {job?.estimatedTime}
                                      </div>
                                      <div className="w-full flex items-start justify-start">
                                        <b>Pay Range : </b>
                                        {job?.minPay} - {job?.maxPay}
                                      </div>
                                      <div className="flex gap-2 w-full items-start justify-start">
                                        <b>Skills : </b>
                                        {job?.skills?.map((item) => (
                                          <Badge>{item}</Badge>
                                        ))}
                                      </div>
                                      <div className="w-full flex items-start justify-start">
                                        <b>Posted at : </b>
                                        {job?.createdAt?.substr(0, 10)}
                                      </div>
                                    </DialogDescription>

                                    <Button
                                      onClick={() => {
                                        dispatch(applyToJob(job?._id));
                                      }}
                                      disabled={
                                        job?.applicants?.includes(user?._id)
                                          ? true
                                          : false
                                      }
                                    >
                                      {job?.applicants?.includes(user?._id) ? (
                                        <>
                                          <CheckCircleOutlineIcon className="text-green-500" />
                                          You have already applied to this job.
                                        </>
                                      ) : (
                                        "Apply for Job"
                                      )}
                                    </Button>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem
                        className="cursor-pointer"
                        onClick={() => {
                          if (pageNo === 1) {
                            return;
                          }
                          setPageNo(pageNo - 1);
                        }}
                      >
                        <PaginationPrevious />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink>{pageNo}</PaginationLink>
                      </PaginationItem>

                      <PaginationItem
                        className="cursor-pointer"
                        onClick={() => {
                          if (
                            Math.ceil(user?.jobs?.length / itemsPerPage) >
                            pageNo
                          ) {
                            setPageNo(pageNo + 1);
                          }
                        }}
                      >
                        <PaginationNext />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default page;
