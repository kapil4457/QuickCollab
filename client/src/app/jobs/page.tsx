"use client";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
// import Table from "./Table";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import CancelIcon from "@mui/icons-material/Cancel";
import { Separator } from "@/components/ui/separator";

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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
import {
  allJobs,
  applyToJob,
  applyToJobReset,
  sortJobs,
} from "@/redux/slices/jobSlice";

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
    maxPay: number;
  };
  location: Array<string>;
  estimatedTime: number;
};

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [pageNo, setPageNo] = useState(1);
  const [filters, setFilters] = useState<filterTypeProps>({
    keywords: [],
    range: {
      minPay: 0,
      maxPay: 0,
    },
    location: [],
    estimatedTime: 0,
  });
  const [filterText, setFilterText] = useState("");
  const [newLocation, setNewLocation] = useState("");
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
    dispatch(sortJobs({ type: e }));
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
                Project Duration (in months.) : {filters.estimatedTime}{" "}
              </Label>
              <Slider
                id="project-duration"
                className="w-[full]"
                defaultValue={[0]}
                onValueChange={(val) => {
                  setFilters({
                    ...filters,
                    estimatedTime: val[0],
                  });
                }}
                max={100}
                step={1}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="project-range">Budget Range</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Minimum budget"
                  type="number"
                  value={filters?.range?.minPay}
                  onChange={(e) => {
                    if (e.target.valueAsNumber > filters?.range?.maxPay) {
                      toast.error(
                        "Minimum value can not be greater than maximum value."
                      );
                      setFilters({
                        ...filters,
                        range: {
                          maxPay: filters.range.maxPay,
                          minPay: 0,
                        },
                      });
                      return;
                    }
                    setFilters({
                      ...filters,
                      range: {
                        maxPay: filters.range.maxPay,
                        minPay: e.target.valueAsNumber,
                      },
                    });
                  }}
                />
                <Input
                  placeholder="Maximum budget"
                  type="number"
                  value={filters?.range?.maxPay}
                  onChange={(e) => {
                    if (e.target.valueAsNumber < filters?.range?.minPay) {
                      toast.error(
                        "Maximum value can not be greater than Minimum value."
                      );
                      setFilters({
                        ...filters,
                        range: {
                          minPay: 0,
                          maxPay: 0,
                        },
                      });
                      return;
                    }
                    setFilters({
                      ...filters,
                      range: {
                        minPay: filters.range.minPay,
                        maxPay: e.target.valueAsNumber,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="project-location">Location Preference.</Label>
              <Input
                type="text"
                value={newLocation}
                id="project-location"
                onChange={(e) => {
                  setNewLocation(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (newLocation === "") {
                      toast.error("Please enter a valid location.");
                      return;
                    }
                    let newLocations = [];
                    for (let ele of filters?.location) {
                      newLocations.push(ele);
                    }
                    newLocations.push(newLocation);
                    setFilters({
                      ...filters,
                      location: newLocations,
                    });
                    setNewLocation("");
                  }
                }}
                placeholder="Enter preferred location."
              />
              <div>
                {filters?.location?.map((ele, key) => {
                  return (
                    <Badge
                      key={key}
                      onClick={() => {
                        let newLocations = filters?.location?.filter((item) => {
                          if (item !== ele) {
                            return item;
                          }
                        });
                        setFilters({
                          ...filters,
                          location: newLocations,
                        });
                      }}
                    >
                      {ele} <CancelIcon className="w-4 h-4" />
                    </Badge>
                  );
                })}
              </div>
            </div>
            <Button type="submit" onClick={() => dispatch(allJobs(filters))}>
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
                  <SelectItem value="salary-ascending">
                    Salary (High to Low)
                  </SelectItem>
                  <SelectItem value="salary-descending">
                    Salary (Low to High)
                  </SelectItem>
                  <SelectItem value="duration-high-to-low">
                    Duration (High-Low)
                  </SelectItem>
                  <SelectItem value="duration-low-to-low">
                    Duration (Low-High)
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
                      Project Duration (in months.) : {filters.estimatedTime}{" "}
                    </Label>
                    <Slider
                      id="project-duration"
                      className="w-[full]"
                      defaultValue={[0]}
                      onValueChange={(val) => {
                        setFilters({
                          ...filters,
                          estimatedTime: val[0],
                        });
                      }}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="project-range">Budget Range</Label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Minimum budget"
                        type="number"
                        value={filters?.range?.minPay}
                        onChange={(e) => {
                          if (e.target.valueAsNumber > filters?.range?.maxPay) {
                            toast.error(
                              "Minimum value can not be greater than maximum value."
                            );
                            setFilters({
                              ...filters,
                              range: {
                                maxPay: filters.range.maxPay,
                                minPay: 0,
                              },
                            });
                            return;
                          }
                          setFilters({
                            ...filters,
                            range: {
                              maxPay: filters.range.maxPay,
                              minPay: e.target.valueAsNumber,
                            },
                          });
                        }}
                      />
                      <Input
                        placeholder="Maximum budget"
                        type="number"
                        value={filters?.range?.maxPay}
                        onChange={(e) => {
                          if (e.target.valueAsNumber < filters?.range?.minPay) {
                            toast.error(
                              "Maximum value can not be greater than Minimum value."
                            );
                            setFilters({
                              ...filters,
                              range: {
                                minPay: 0,
                                maxPay: 0,
                              },
                            });
                            return;
                          }
                          setFilters({
                            ...filters,
                            range: {
                              minPay: filters.range.minPay,
                              maxPay: e.target.valueAsNumber,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="project-location">
                      Location Preference.
                    </Label>
                    <Input
                      type="text"
                      value={newLocation}
                      id="project-location"
                      onChange={(e) => {
                        setNewLocation(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (newLocation === "") {
                            toast.error("Please enter a valid location.");
                            return;
                          }
                          let newLocations = [];
                          for (let ele of filters?.location) {
                            newLocations.push(ele);
                          }
                          newLocations.push(newLocation);
                          setFilters({
                            ...filters,
                            location: newLocations,
                          });
                          setNewLocation("");
                        }
                      }}
                      placeholder="Enter preferred location."
                    />
                    <div>
                      {filters?.location?.map((ele, key) => {
                        return (
                          <Badge
                            key={key}
                            onClick={() => {
                              let newLocations = filters?.location?.filter(
                                (item) => {
                                  if (item !== ele) {
                                    return item;
                                  }
                                }
                              );
                              setFilters({
                                ...filters,
                                location: newLocations,
                              });
                            }}
                          >
                            {ele} <CancelIcon className="w-4 h-4" />
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    onClick={() => dispatch(allJobs(filters))}
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
                              <div className="flex gap-2 w-full items-start justify-start">
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
                  if (jobs && Math.ceil(jobs?.length / itemsPerPage) > pageNo) {
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
