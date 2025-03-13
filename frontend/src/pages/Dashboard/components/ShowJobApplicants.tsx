import { createConversation } from "@/store/controllers/ConversationController";
import { ContentCreatorEmployee, OfferDetail } from "@/store/dtos/helper";
import { createConversationDTO } from "@/store/dtos/request/conversationCreateDTO";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IconSvgProps } from "@/types";
import showToast from "@/utils/showToast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
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
import {
  FileText,
  MessageSquareText,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import CreateOfferModal from "./CreateOfferModal";
import { selectPostedJobs } from "@/store/slices/userSlice";

type propsType = {
  applicants: ContentCreatorEmployee[] | null;
  jobId: string;
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
const ShowJobApplicants = forwardRef((props: propsType, ref) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const rowsCount = [5, 10, 15];
  const [rowsPerPage, setRowsPerPage] = useState(rowsCount[0]);
  const pages = Math.ceil((props?.applicants?.length || 0) / rowsPerPage);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currOfferDetail, setCurrOfferDetail] = useState<OfferDetail>({
    offerId: "",
    jobId: 0,
    jobTitle: "",
    offeredOn: new Date(),
    offerStatus: "PENDING",
    salary: 0,
    userId: "",
    userRole: "TEAM_MEMBER",
    validTill: new Date(),
  });
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));
  const jobs = useAppSelector(selectPostedJobs) || [];
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const isOfferedTo = (userId: string) => {
    let currJob = jobs.filter((job) => job.jobId === parseInt(props.jobId))[0];
    return (
      currJob.applicants.filter((applicant) => {
        if (applicant.userId === userId) return true;
      }).length > 0
    );
  };

  const showOfferDetailsModal = useRef();

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    let searchVal = filterValue.trim().toLocaleLowerCase();
    if (searchVal != "") {
      let filteredApplicants = props?.applicants?.filter((applicant) => {
        if (
          applicant.firstName.toLocaleLowerCase().includes(searchVal) ||
          applicant.lastName.toLocaleLowerCase().includes(searchVal) ||
          applicant.emailId.toLocaleLowerCase().includes(searchVal) ||
          applicant.selfDescription.toLocaleLowerCase().includes(searchVal)
        ) {
          return applicant;
        }
      });
      return filteredApplicants?.slice(start, end);
    }
    return props?.applicants?.slice(start, end);
  }, [page, props?.applicants, filterValue]);

  const createOfferDetail = (userId: string) => {
    setCurrOfferDetail({
      ...currOfferDetail,
      jobId: parseInt(props.jobId),
      userId: userId,
    });
    if (
      showOfferDetailsModal.current &&
      "openModal" in showOfferDetailsModal.current
    ) {
      (showOfferDetailsModal.current as { openModal: () => void }).openModal();
    }
  };
  const createConversationAndRedirect = async (userId: string) => {
    let members = new Array<string>();
    members.push(userId);
    const body: createConversationDTO = {
      groupName: "",
      isGroupChat: false,
      isTeamMemberConversation: false,
      membersIds: members,
    };
    const { message, success, conversationId } = await createConversation(
      dispatch,
      body
    );
    localStorage.setItem("openConversationId", conversationId);
    if (success) {
      showToast({ color: "success", title: message });
    }
    navigate("/my-conversations");
  };
  return (
    <>
      <CreateOfferModal
        operationType="create"
        ref={showOfferDetailsModal}
        body={currOfferDetail}
      />
      <Modal backdrop="blur" size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Job Applicants
              </ModalHeader>

              <ModalBody>
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
                    Total {props?.applicants?.length || 0} applicants
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
                    <TableColumn key="userId">User ID</TableColumn>
                    <TableColumn key="firstName">First Name</TableColumn>
                    <TableColumn key="lastName">Last Name</TableColumn>
                    <TableColumn key="profile">Profile</TableColumn>
                    <TableColumn key="message">Message</TableColumn>
                    <TableColumn key="sendOffer">Send Offer</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No applicants yet"} items={items}>
                    {(item) => {
                      return (
                        <TableRow key={item?.userId}>
                          {(columnKey) => (
                            <TableCell className="whitespace-normal break-words overflow-x-hidden overflow-y-auto">
                              {columnKey === "profile" ? (
                                <Button
                                  as={Link}
                                  size="md"
                                  isIconOnly
                                  href={`/profile/${item?.userId}`}
                                >
                                  <SquareArrowOutUpRight />
                                </Button>
                              ) : columnKey === "message" ? (
                                <Button
                                  size="md"
                                  isIconOnly
                                  onPress={() =>
                                    createConversationAndRedirect(item?.userId)
                                  }
                                >
                                  <MessageSquareText />
                                </Button>
                              ) : columnKey == "sendOffer" ? (
                                <Button
                                  size="md"
                                  isIconOnly
                                  isDisabled={isOfferedTo(item?.userId)}
                                  onPress={() =>
                                    createOfferDetail(item?.userId)
                                  }
                                >
                                  <FileText />
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});

export default ShowJobApplicants;
