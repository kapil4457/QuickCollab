"use client";
import { fetchServiceProviders } from "@/redux/slices/serviceSlice";
import { useAppSelector } from "@/redux/store";
import { CONTENT_CREATOR } from "@/utils/roles";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
// import Table from "./Table";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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

// import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allJobs, applyToJob, applyToJobReset } from "@/redux/slices/jobSlice";

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
  range: {
    minPay: number;
    maxPaY: number;
  };
  location: string;
  estimatedTime: number;
};

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [pageNo, setPageNo] = useState(1);
  const [filters, setFilters] = useState({
    keywords: [],
    range: {
      minPay: 0,
      maxPaY: 0,
    },
    location: "",
    estimatedTime: 0,
  });
  const [filterText, setFilterText] = useState("");
  const { jobs } = useAppSelector((state) => state.jobSlice.allJobs);
  const {
    isAuthenticated,
    user,
    loading: userLoader,
  } = useAppSelector((state) => state.userSlice.value);
  const { message: applyToJobMessage, success: applyToJobSuccess } =
    useAppSelector((state) => state.jobSlice.applyToJob);

  const itemsPerPage = 10;

  const filterDropdownHelper = (e: string) => {
    switch (e) {
      case "experience-ascending":
        users?.sort((a, b) => b.experience - a.experience);
        break;
      case "experience-descending":
        users?.sort((a, b) => b.experience - a.experience);
        break;
      case "rating-high-to-low":
        users?.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low-to-low":
        users?.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    dispatch(allJobs());
  }, []);

  useEffect(() => {
    if (applyToJobSuccess === true) {
      toast.success(applyToJobMessage);
      dispatch(fetchMe());
      // dispatch(allJobs(filters))
    }
    if (applyToJobSuccess === false) {
      toast.error(applyToJobMessage);
    }
    dispatch(applyToJobReset());
  }, [applyToJobSuccess]);

  useEffect(() => {
    if (isAuthenticated === false && userLoader === false) {
      toast.success("Please log-in to access this page.");
      router.push("/");
    }
  }, [isAuthenticated]);
  return (
    <div className="h-[100vh] w-full mt-[15rem] flex justify-center">
      <div className="w-full flex flex-col gap-10 items-center pl-[5vw] pr-[5vw]">
        <div className="filters flex justify-between w-full">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
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
            <Button type="submit" onClick={() => dispatch(allJobs(filters))}>
              Apply Filter
            </Button>
          </div>
          <Select onValueChange={filterDropdownHelper}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="experience-ascending">
                  Experience (asc.)
                </SelectItem>
                <SelectItem value="experience-descending">
                  Experience (des.)
                </SelectItem>
                <SelectItem value="rating-high-to-low">
                  Rating (High-Low)
                </SelectItem>
                <SelectItem value="rating-low-to-low">
                  Rating (Low-High)
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>About Job</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs
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
                  <TableCell>{job?.jobTitle}</TableCell>
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
                            <div>
                              <b>Description : </b>
                              {job?.jobDescription}
                            </div>
                            <div>
                              <b>Location : </b>
                              {job?.location}
                            </div>
                            <div>
                              <b>Duration : </b>
                              {job?.estimatedTime}
                            </div>
                            <div>
                              <b>Pay Range : </b>
                              {job?.minPay} - {job?.maxPay}
                            </div>
                            <div className="flex gap-2">
                              <b>Skills : </b>
                              {job?.skills?.map((item) => (
                                <Badge>{item}</Badge>
                              ))}
                            </div>
                            <div>
                              <b>Posted at : </b>
                              {job?.createdAt?.substr(0, 10)}
                            </div>
                            <div className="flex gap-2 ">
                              <b>Posted by : </b>
                              <Link
                                href={`/user/${job?.jobCreatedBy}`}
                                className="flex gap-2 
                                items-center justify-center text-blue-500 hover:text-blue-700"
                              >
                                Profile
                                <OpenInNewIcon className="w-4 h-4" />
                              </Link>
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
                  <TableCell>
                    <Link
                      href={`/user/${job?.jobCreatedBy}`}
                      className="flex gap-2 items-center  text-blue-500 hover:text-blue-700"
                    >
                      Profile
                      <OpenInNewIcon className="w-4 h-4" />
                    </Link>
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
                setPageNo(pageNo + 1);
              }}
            >
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default page;
