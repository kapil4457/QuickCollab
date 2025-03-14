import DashboardLayout from "@/layouts/DashboardLayout";
import { useAppSelector } from "@/store/hooks";
import { selectAllJobsOffered } from "@/store/slices/userSlice";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { VerticalDotsIcon } from "../PostedJobs/PostedJobs";
import { useCallback, useMemo, useRef, useState } from "react";
import { Chip } from "@heroui/chip";
import { dateFormatter } from "@/utils/generalUtils";
import { Input } from "@heroui/input";
import { OfferDetail } from "@/store/dtos/helper";
import CreateOfferModal from "../components/CreateOfferModal";

const JobsOffered = () => {
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [currOffer, setCurrOffer] = useState<OfferDetail | null>(null);
  const jobsOffered = useAppSelector(selectAllJobsOffered);
  const rowsCount = [5, 10, 15];
  const [rowsPerPage, setRowsPerPage] = useState(rowsCount[0]);
  const pages = Math.ceil((jobsOffered?.length || 0) / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    let searchVal = filterValue.trim().toLocaleLowerCase();
    if (searchVal != "") {
      let filteredOffers = jobsOffered?.filter((offer) => {
        if (
          offer.jobId.toString().toLocaleLowerCase().includes(searchVal) ||
          offer.jobTitle.toLocaleLowerCase().includes(searchVal) ||
          offer.offerId.toLocaleLowerCase().includes(searchVal) ||
          offer.offerStatus.toLocaleLowerCase().includes(searchVal) ||
          offer.salary.toString().toLocaleLowerCase().includes(searchVal) ||
          offer.userId.toLocaleLowerCase().includes(searchVal) ||
          offer.userRole.toLocaleLowerCase().includes(searchVal)
        ) {
          return offer;
        }
      });
      return filteredOffers?.slice(start, end);
    }
    return jobsOffered?.slice(start, end);
  }, [page, jobsOffered, filterValue]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const showOfferDetailsModal = useRef();

  const updateOfferDetails = () => {
    if (
      showOfferDetailsModal.current &&
      "openModal" in showOfferDetailsModal.current
    ) {
      (showOfferDetailsModal.current as { openModal: () => void }).openModal();
    }
  };

  return (
    <DashboardLayout>
      <CreateOfferModal
        operationType="update"
        ref={showOfferDetailsModal}
        body={currOffer}
      />
      <div className="flex flex-col gap-[1rem]">
        <div className="flex flex-col gap-1">
          <Input
            className="w-[20rem]"
            placeholder="Search here..."
            defaultValue={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
            }}
          />
          <div className="flex justify-between items-center gap-1">
            <span className="text-default-400 text-small">
              Total {jobsOffered?.length || 0} offers sent
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
        </div>
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
            <TableColumn key="offerId">Offer Id</TableColumn>
            <TableColumn key="userId">User Id</TableColumn>
            <TableColumn key="jobId">Job Id</TableColumn>
            <TableColumn key="jobTitle">Job Title</TableColumn>
            <TableColumn key="salary">Offered Salary</TableColumn>
            <TableColumn key="userRole">Role Offered</TableColumn>
            <TableColumn key="offeredOn">Offered On</TableColumn>
            <TableColumn key="validTill">Valid Till</TableColumn>
            <TableColumn key="offerStatus">Offer Status</TableColumn>
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
                                  setCurrOffer(item);
                                  updateOfferDetails();
                                }}
                              >
                                Update Offer
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      ) : columnKey === "offerStatus" ? (
                        <Chip
                          color={
                            item?.offerStatus === "ACCEPTED"
                              ? "success"
                              : item?.offerStatus === "DECLINED" ||
                                  item?.offerStatus === "REVOKED" ||
                                  item?.offerStatus === "EXPIRED"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {getKeyValue(item, columnKey)}
                        </Chip>
                      ) : columnKey === "offeredOn" ||
                        columnKey === "validTill" ? (
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
      </div>
    </DashboardLayout>
  );
};

export default JobsOffered;
