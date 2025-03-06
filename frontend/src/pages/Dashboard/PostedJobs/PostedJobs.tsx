import { useAppSelector } from "@/store/hooks";
import { selectPostedJobs } from "@/store/slices/userSlice";
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
import { SVGProps, useCallback, useMemo, useRef, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { AddEditPostedJobModal } from "../components/AddEditPostedJobModal";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { createJobDTO } from "@/store/dtos/request/createJobDTO";
import { dateFormatter } from "@/utils/generalUtils";
import { User } from "lucide-react";
import { ContentCreatorEmployee } from "@/store/dtos/helper";
import ShowJobApplicants from "../components/ShowJobApplicants";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const PlusIcon = ({
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
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
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
export const ChevronDownIcon = ({
  strokeWidth = 1.5,
  ...otherProps
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
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
const PostedJobs = () => {
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [operationType, setOperationType] = useState<"UPDATE" | "CREATE">(
    "CREATE"
  );
  const [currentJob, setCurrentJob] = useState<createJobDTO | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string>("");

  const [currentJobApplicants, setCurrentJobApplicants] = useState<
    ContentCreatorEmployee[] | null
  >(null);
  const postedJobs = useAppSelector(selectPostedJobs);
  const rowsCount = [5, 10, 15];
  const [rowsPerPage, setRowsPerPage] = useState(rowsCount[0]);
  const pages = Math.ceil((postedJobs?.length || 0) / rowsPerPage);

  const addEditJobPostingModalRef = useRef();
  const showApplicantsModalRef = useRef();

  const handleCreateJob = () => {
    setOperationType("CREATE");
    if (
      addEditJobPostingModalRef.current &&
      "openModal" in addEditJobPostingModalRef.current
    ) {
      (
        addEditJobPostingModalRef.current as { openModal: () => void }
      ).openModal();
    }
  };
  const handleUpdateJob = () => {
    setOperationType("UPDATE");
    if (
      addEditJobPostingModalRef.current &&
      "openModal" in addEditJobPostingModalRef.current
    ) {
      (
        addEditJobPostingModalRef.current as { openModal: () => void }
      ).openModal();
    }
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    let searchVal = filterValue.trim().toLocaleLowerCase();
    if (searchVal != "") {
      let filteredJobs = postedJobs?.filter((job) => {
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
    return postedJobs?.slice(start, end);
  }, [page, postedJobs, filterValue]);

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

  const openApplicantsList = async (applicants: ContentCreatorEmployee[]) => {
    // console.log("currentApplicants : ", applicants);
    setCurrentJobApplicants(applicants);
    if (
      showApplicantsModalRef.current &&
      "openModal" in showApplicantsModalRef.current
    ) {
      (showApplicantsModalRef.current as { openModal: () => void }).openModal();
    }
  };

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return (
    <DashboardLayout>
      <AddEditPostedJobModal
        operationType={operationType}
        job={currentJob}
        jobId={currentJobId}
        ref={addEditJobPostingModalRef}
      />
      <ShowJobApplicants
        applicants={currentJobApplicants}
        ref={showApplicantsModalRef}
      />
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
          <div>
            <Button onPress={handleCreateJob}>
              Create New <PlusIcon />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {postedJobs?.length || 0} jobs posted
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
        {postedJobs ? (
          <Table
            aria-label="Jobs Posted By me"
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
              <TableColumn key="openingsCount">Notice Poeriod</TableColumn>
              <TableColumn key="jobLocationType">Location Type</TableColumn>
              <TableColumn key="jobLocation">Location</TableColumn>
              <TableColumn key="applicants">Applicants</TableColumn>
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
                            <Dropdown className="bg-background border-1 border-default-200">
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  radius="full"
                                  size="sm"
                                  variant="light"
                                >
                                  <VerticalDotsIcon className="text-default-400" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu>
                                <DropdownItem
                                  key="edit"
                                  onPress={() => {
                                    console.log("editing");
                                    setCurrentJobId(item?.jobId.toString());
                                    setCurrentJob({
                                      jobDescription: item?.jobDescription,
                                      jobLocation: item?.jobLocation,
                                      jobLocationType: item?.jobLocationType,
                                      jobName: item?.jobName,
                                      jobStatus: item?.jobStatus,
                                      noticePeriodDays: item?.noticePeriodDays,
                                      openingsCount: item?.openingsCount,
                                    });
                                    handleUpdateJob();
                                  }}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem key="delete">Delete</DropdownItem>
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
                        ) : columnKey === "applicants" ? (
                          <Button
                            onPress={() => openApplicantsList(item.applicants)}
                          >
                            <User />
                          </Button>
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
    </DashboardLayout>
  );
};

export default PostedJobs;
