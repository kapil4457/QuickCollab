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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type UserType = {
  avatar: any;
  name: string;
  experience: number;
  providerPreviousWork: any;
  rating: any;
  _id: string;
};

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [pageNo, setPageNo] = useState(1);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterText, setFilterText] = useState("");
  const { users, loading }: { users: UserType[]; loading: boolean } =
    useAppSelector((state) => state.serviceSlice.value);
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.userSlice.value
  );
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
    dispatch(fetchServiceProviders(filterTags));
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
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
                  setFilterTags([...filterTags, filterText]);
                  setFilterText("");
                }
              }}
            />
            <Button
              type="submit"
              onClick={() => dispatch(fetchServiceProviders(filterTags))}
            >
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
        <div className="filter-tags flex gap-2 w-full">
          {filterTags?.map((tag, key) => (
            <Badge key={key} className="flex gap-2">
              {tag}
              <CancelIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  let newFilters = filterTags.filter((ele) => {
                    if (ele !== tag) {
                      return ele;
                    }
                  });

                  setFilterTags(newFilters);
                }}
              />
            </Badge>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Experience in years</TableHead>
              <TableHead className="text-right">About</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              ?.filter((ele, key: number) => {
                if (
                  key + 1 >= (pageNo - 1) * itemsPerPage &&
                  key + 1 <= pageNo * itemsPerPage
                ) {
                  return ele;
                }
              })
              ?.map((user, key) => (
                <TableRow key={key} className="">
                  <TableCell className="font-medium  ">
                    <div className="flex items-center gap-5">
                      <Image
                        alt="Picture of the service provider"
                        src={user?.avatar?.url}
                        width={45}
                        height={45}
                        style={{ borderRadius: "10px", objectFit: "contain" }}
                      />
                      {user?.name}
                    </div>
                  </TableCell>
                  <TableCell className="flex  items-center gap-2">
                    <Rating
                      name="user-rating"
                      value={user?.rating}
                      precision={0.1}
                      readOnly
                    />
                    ({user?.providerPreviousWork?.length})
                  </TableCell>
                  <TableCell>{user?.experience}</TableCell>
                  <TableCell className="text-right flex justify-end">
                    <Link
                      href={`/user/${user?._id}`}
                      className="flex gap-2 text-blue-500 hover:text-blue-700"
                    >
                      Profile
                      <OpenInNewIcon />
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
