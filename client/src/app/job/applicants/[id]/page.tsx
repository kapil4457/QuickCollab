"use client";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
// import Table from "./Table";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import CancelIcon from "@mui/icons-material/Cancel";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchJobApplicants, sortApplicants } from "@/redux/slices/jobSlice";
import { PageProps } from "../../../../../.next/types/app/layout";
import { Rating } from "@mui/material";
import { createConversation } from "@/redux/slices/chatSlice";

type UserType = {
  avatar: any;
  name: string;
  experience: number;
  providerPreviousWork: any;
  rating: any;
  _id: string;
};
type filterTypeProps = {
  keywords: Array<string>;
  rating: number;
};

const page: FC<PageProps> = ({ params }) => {
  const dispatch = useDispatch();
  const JobId = params.id;
  const router = useRouter();
  const [pageNo, setPageNo] = useState(1);
  const [filters, setFilters] = useState<filterTypeProps>({
    keywords: [],
    rating: 0,
  });

  const [filterText, setFilterText] = useState("");
  const { applicants, jobCreator } = useAppSelector(
    (state) => state.jobSlice.currentJobApplicants
  );
  const {
    isAuthenticated,
    user,
    loading: userLoader,
  } = useAppSelector((state) => state.userSlice.value);

  const itemsPerPage = 10;

  const filterDropdownHelper = (e: string) => {
    dispatch(sortApplicants({ type: e }));
  };
  const chatHandler = (applicantId: string) => {
    // Set this value in the redux store
    // add to the conversations list
    let members = [];
    members.push(applicantId);
    const info = {
      isGroup: false,
      members: members,
    };
    dispatch(createConversation(info));
    // redirect to chats page
    router.push("/chats");
  };

  useEffect(() => {
    if (isAuthenticated && applicants && jobCreator) {
      if (jobCreator !== user?._id) {
        toast.error("You are not allowed to access this page.");
      }
    }
  }, [isAuthenticated, applicants]);
  useEffect(() => {
    if (isAuthenticated === false && userLoader === false) {
      toast.success("Please log-in to access this page.");
      router.push("/");
    }
    if (isAuthenticated === true && userLoader === false && JobId) {
      dispatch(fetchJobApplicants({ id: JobId }));
    }
  }, [isAuthenticated, JobId]);

  return (
    <div className="min-h-[100vh] w-full mt-[12rem] flex justify-center">
      <div className="min-h-full w-full lg:grid lg:grid-cols-10  gap-10 items-center pl-[5vw] pr-[5vw]">
        <div className="border-r-2 pr-8 h-full filters col-span-2  flex-col  gap-5 w-full hidden lg:!flex">
          <Label className="text-xl">Filters</Label>
          <Separator />

          <div className="flex flex-col  gap-10 w-full">
            <div className="flex flex-col w-full  items-center space-x-2 gap-4">
              <Label htmlFor="project-tags" className="w-full">
                Tags/Keywords
              </Label>
              <Input
                type="text"
                id="project-tags"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search keywords"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (filterText === "") {
                      toast.error("Tag cannot be empty !!");
                      return;
                    }
                    let newKeywords = filters.keywords as Array<string>;
                    newKeywords.push(filterText);
                    setFilters({
                      ...filters,
                      keywords: newKeywords as Array<string>,
                    });
                    // setFilterTags([...filterTags, filterText]);
                    setFilterText("");
                  }
                }}
              />
              <div className="filter-tags flex-wrap flex gap-2 w-full">
                {filters.keywords?.map((tag, key) => (
                  <Badge key={key} className="flex gap-2">
                    {tag}
                    <CancelIcon
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => {
                        let newFilters = filters.keywords.filter((ele) => {
                          if (ele !== tag) {
                            return ele;
                          }
                        });

                        setFilters({ ...filters, keywords: newFilters });
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="project-duration">
                Rating : {filters.rating}{" "}
              </Label>
              <Slider
                id="project-duration"
                className="w-[full]"
                defaultValue={[0]}
                onValueChange={(val) => {
                  setFilters({
                    ...filters,
                    rating: val[0],
                  });
                }}
                max={5}
                step={0.1}
              />
            </div>

            <Button
              type="submit"
              onClick={() =>
                dispatch(fetchJobApplicants({ filters, id: JobId }))
              }
            >
              Apply Filter
            </Button>
          </div>
        </div>

        <div className=" h-full  lg:col-span-7 table-cont w-full flex flex-col gap-10">
          <div className="flex w-full gap-5 items-end justify-end">
            <Select onValueChange={filterDropdownHelper}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="rating-ascending">
                    Rating (Low to High)
                  </SelectItem>
                  <SelectItem value="rating-descending">
                    Rating (High to Low)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="flex lg:!hidden">Filters</Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col gap-5">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <Separator />
                </SheetHeader>
                <div className="flex flex-col  gap-10 w-full">
                  <div className="flex flex-col w-full  items-center space-x-2 gap-4">
                    <Label htmlFor="project-tags" className="w-full">
                      Tags/Keywords
                    </Label>
                    <Input
                      type="text"
                      id="project-tags"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      placeholder="Search keywords"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (filterText === "") {
                            toast.error("Tag cannot be empty !!");
                            return;
                          }
                          let newKeywords = filters.keywords as Array<string>;
                          newKeywords.push(filterText);
                          setFilters({
                            ...filters,
                            keywords: newKeywords as Array<string>,
                          });
                          // setFilterTags([...filterTags, filterText]);
                          setFilterText("");
                        }
                      }}
                    />
                    <div className="filter-tags flex-wrap flex gap-2 w-full">
                      {filters.keywords?.map((tag, key) => (
                        <Badge key={key} className="flex gap-2">
                          {tag}
                          <CancelIcon
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => {
                              let newFilters = filters.keywords.filter(
                                (ele) => {
                                  if (ele !== tag) {
                                    return ele;
                                  }
                                }
                              );

                              setFilters({ ...filters, keywords: newFilters });
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Label htmlFor="project-duration">
                      Rating : {filters.range}{" "}
                    </Label>
                    <Slider
                      id="project-duration"
                      className="w-[full]"
                      defaultValue={[0]}
                      onValueChange={(val) => {
                        setFilters({
                          ...filters,
                          range: val[0],
                        });
                      }}
                      max={5}
                      step={0.1}
                    />
                  </div>

                  <Button
                    type="submit"
                    onClick={() => dispatch(fetchJobApplicants(filters, JobId))}
                  >
                    Apply Filter
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>About</TableHead>
                <TableHead>Chat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants &&
                applicants
                  ?.filter((ele, key: number) => {
                    if (
                      key + 1 >= (pageNo - 1) * itemsPerPage &&
                      key + 1 <= pageNo * itemsPerPage
                    ) {
                      return ele;
                    }
                  })
                  ?.map((applicant, key) => (
                    <TableRow key={key} className="">
                      <TableCell className="flex gap-2 items-center flex-col md:flex-row">
                        <img
                          className="h-14 w-14 object-cover"
                          style={{ borderRadius: "10px" }}
                          src={applicant?.avatar?.url}
                          alt="applicant-image"
                        />
                        {applicant?.name}
                      </TableCell>
                      <TableCell>
                        <Rating
                          precision={0.1}
                          value={applicant?.rating}
                          readOnly
                        />
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/user/${applicant?._id}`}
                          className="flex gap-2 items-center  text-blue-500 hover:text-blue-700"
                        >
                          Profile
                          <OpenInNewIcon className="w-4 h-4" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={"link"}
                          onClick={() => chatHandler(applicant?._id)}
                          className="flex gap-2 items-center  text-blue-500 hover:text-blue-700"
                        >
                          Chat
                          <OpenInNewIcon className="w-4 h-4" />
                        </Button>
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
                    applicants &&
                    Math.ceil(applicants?.length / itemsPerPage) > pageNo
                  ) {
                    setPageNo(pageNo + 1);
                  }
                }}
              >
                <PaginationNext />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default page;
