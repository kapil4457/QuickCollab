import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

import { Pagination } from "@heroui/pagination";
import { SVGProps, useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { dateFormatter } from "@/utils/generalUtils";
import {
  applyToJobHandler,
  getAllJobPostingsHandler,
} from "@/store/controllers/JobController";
import showToast from "@/utils/showToast";
import { AllRoles, JobStatus } from "@/utils/enums";
import { ContentCreatorJobPost } from "@/store/dtos/helper";
import { Card, CardBody, CardHeader } from "@heroui/card";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const SearchIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};
const AllJobs = ({
  listedJobs,
  userRole,
}: {
  listedJobs: ContentCreatorJobPost[];
  userRole: string;
}) => {
  if (!listedJobs || userRole === "") return;
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");

  const rowsCount = [5, 10, 15];
  const [rowsPerPage, setRowsPerPage] = useState(rowsCount[0]);
  const pages = Math.ceil((listedJobs?.length || 0) / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    let searchVal = filterValue.trim().toLocaleLowerCase();
    if (searchVal != "") {
      let filteredJobs = listedJobs?.filter((job) => {
        if (
          job.jobDescription.toLocaleLowerCase().includes(searchVal) ||
          job.jobName.toLocaleLowerCase().includes(searchVal) ||
          job.jobLocation.toLocaleLowerCase().includes(searchVal)
        ) {
          return job;
        }
      });
      return filteredJobs?.slice(start, end);
    }
    return listedJobs?.slice(start, end);
  }, [page, listedJobs, filterValue]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const getAllJobPostings = async () => {
    const { message, success } = await getAllJobPostingsHandler(dispatch);
    if (!success) {
      showToast({ title: message, color: "danger" });
    }
  };
  const applyToJob = async (jobId: string) => {
    const { success, message } = await applyToJobHandler(dispatch, jobId);
    if (success) {
      showToast({ title: message, color: "success" });
    } else {
      showToast({ title: message, color: "danger" });
    }
  };
  useEffect(() => {
    getAllJobPostings();
  }, []);

  return (
    <Card className="border border-gray-300 shadow-md  w-full rounded-xl p-6 h-full">
      <CardHeader className="text-xl font-semibold border-b pb-3 flex justify-between">
        Posted Jobs
      </CardHeader>
      <CardBody>
        <div className="p-4 flex flex-col gap-5">
          <div className="flex justify-between">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search here..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              Total {listedJobs?.length || 0} jobs posted
            </span>
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          </div>
          {listedJobs ? (
            <Table
              aria-label="Jobs Posted"
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="default"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
              classNames={{
                wrapper: "min-h-[222px]",
              }}
            >
              <TableHeader>
                <TableColumn key="jobId">Id</TableColumn>
                <TableColumn key="jobName">Title</TableColumn>
                <TableColumn key="jobDescription">Description</TableColumn>
                <TableColumn key="jobStatus">Status</TableColumn>
                <TableColumn key="openingsCount">Openings</TableColumn>
                <TableColumn key="jobLocationType">Location Type</TableColumn>
                <TableColumn key="jobLocation">Location</TableColumn>
                <TableColumn key="postedOn">Posted On</TableColumn>
                <TableColumn key="actions">Actions</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={"You have not posted any jobs yet."}
                items={items}
              >
                {(item) => {
                  return (
                    <TableRow key={item?.jobId}>
                      {(columnKey) => (
                        <TableCell className="max-w-[10rem] whitespace-normal break-words overflow-x-hidden overflow-y-auto">
                          {columnKey === "actions" ? (
                            <div className="relative flex justify-end items-center gap-2">
                              <Dropdown
                                isDisabled={item.jobStatus !== JobStatus.ACTIVE}
                                className="bg-background border-1 border-default-200"
                              >
                                <DropdownTrigger>
                                  <Button
                                    isIconOnly
                                    radius="full"
                                    size="lg"
                                    variant="light"
                                  >
                                    <VerticalDotsIcon className="text-default-400" />
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                  <DropdownItem
                                    key="apply"
                                    onPress={() =>
                                      applyToJob(item?.jobId?.toString())
                                    }
                                    isDisabled={
                                      userRole ===
                                      AllRoles.CONTENT_CREATOR.toString()
                                    }
                                  >
                                    Apply
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          ) : columnKey === "jobStatus" ? (
                            <Chip
                              color={
                                item?.jobStatus === "ACTIVE"
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {getKeyValue(item, columnKey)}
                            </Chip>
                          ) : columnKey === "postedOn" ? (
                            dateFormatter(getKeyValue(item, columnKey))
                          ) : (
                            getKeyValue(item, columnKey)
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                }}
              </TableBody>
            </Table>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
};

export default AllJobs;
