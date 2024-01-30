"use client";

import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { fetchUserDetails } from "@/redux/slices/profileSlice";
import Loader from "@/components/Loader/Loader";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@mui/material";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageProps } from "../../../../.next/types/app/layout";
import { CONTENT_CREATOR, SERVICE_PROVIDER } from "@/utils/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactPlayer from "react-player";
import { Chat, ChatBubble, Launch } from "@mui/icons-material";
import toast from "react-hot-toast";

const page: FC<PageProps> = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
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

  useEffect(() => {
    if (isAuthenticated === false && userLoader === false) {
      toast.success("Please log-in to access this page.");
      router.push("/");
    }
  }, [isAuthenticated, userLoader]);

  return (
    <>
      <div
        className="mb-10 flex flex-col  mt-[4rem] lg:mt-[6rem] lg:h-[calc(100vh-6rem)] lg:grid gap-6"
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
            {user && user?.rating && (
              <Rating
                value={user?.rating}
                precision={0.1}
                readOnly
                className="w-full items-center self-center justify-center"
              />
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
        </div>
        <div className="right p-3 lg:p-0">
          <ScrollArea className="right max-h-[calc(100vh-6rem)]">
            <div className="flex flex-col gap-14">
              <div className="about flex flex-col gap-3">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">About</h2>
                  {self?.role === CONTENT_CREATOR && (
                    <Button
                      variant={"secondary"}
                      className="cursor-pointer flex justify-between gap-3"
                      onClick={() => {
                        router.push(`/chats/${params?.id}`);
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
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default page;
