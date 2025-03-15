import DashboardLayout from "@/layouts/DashboardLayout";
import { createConversation } from "@/store/controllers/ConversationController";
import { ContentCreatorEmployee } from "@/store/dtos/helper";
import { createConversationDTO } from "@/store/dtos/request/conversationCreateDTO";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectMyEmployees } from "@/store/slices/userSlice";
import showToast from "@/utils/showToast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
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
import { MessageSquareText, SquareArrowOutUpRight } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../components/ShowJobApplicants";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { VerticalDotsIcon } from "../PostedJobs/PostedJobs";
import UpdateSalaryModal from "../components/UpdateSalaryModal";

const MyEmployees = () => {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [currentEmployee, setCurrentEmployee] =
    useState<ContentCreatorEmployee | null>(null);
  const myEmployees = useAppSelector(selectMyEmployees);
  const rowsCount = [5, 10, 15];
  const [rowsPerPage, setRowsPerPage] = useState(rowsCount[0]);
  const pages = Math.ceil((myEmployees?.length || 0) / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    let searchVal = filterValue.trim().toLocaleLowerCase();
    if (searchVal != "") {
      let filteredEmployees = myEmployees?.filter((employee) => {
        if (
          employee.emailId.toLocaleLowerCase().includes(searchVal) ||
          employee.firstName.toLocaleLowerCase().includes(searchVal) ||
          employee.lastName.toLocaleLowerCase().includes(searchVal) ||
          employee.userRole.toLocaleLowerCase().includes(searchVal) ||
          employee.userId.toLocaleLowerCase().includes(searchVal)
        ) {
          return employee;
        }
      });
      return filteredEmployees?.slice(start, end);
    }
    return myEmployees?.slice(start, end);
  }, [page, myEmployees, filterValue]);
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const updateEmployeeSalaryModal = useRef();

  const createConversationAndRedirect = async (userId: string) => {
    let members = new Array<string>();
    members.push(userId);
    const body: createConversationDTO = {
      groupName: "",
      isGroupChat: false,
      isTeamMemberConversation: true,
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
  const openUpdateEmployeeSalaryModal = () => {
    if (
      updateEmployeeSalaryModal.current &&
      "openModal" in updateEmployeeSalaryModal.current
    ) {
      (
        updateEmployeeSalaryModal.current as { openModal: () => void }
      ).openModal();
    }
  };
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-3">
        <UpdateSalaryModal
          ref={updateEmployeeSalaryModal}
          employee={currentEmployee}
        />
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
            Total {myEmployees.length || 0} employee
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
            <TableColumn key="emailId">Email Id</TableColumn>
            <TableColumn key="isServingNoticePeriod">
              Serving Notice Period
            </TableColumn>
            <TableColumn key="noticePeriodEndDate">
              Notice Period End Date
            </TableColumn>
            <TableColumn key="profile">Profile</TableColumn>
            <TableColumn key="message">Message</TableColumn>
            <TableColumn key="actions">Actions</TableColumn>
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
                      ) : columnKey === "actions" ? (
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
                                  setCurrentEmployee(item);
                                  openUpdateEmployeeSalaryModal();
                                }}
                              >
                                Update Salary
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
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

export default MyEmployees;
