import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Button,
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import classes from "./TableSort.module.css";
import UserLogo from "../../../../assets/user.svg";
import EditIcon from "./EditIcon";
import UpdateJobForm from "../Forms/UpdateJobForm";
import PopUpBase from "../../../../components/PopUpBase/PopUpBase";
import { useSelector } from "react-redux";
function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes?.th}>
      <UnstyledButton onClick={onSort} className={classes?.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes?.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search?.toLowerCase()?.trim();
  return data?.filter((item) => {
    return keys(data[0])?.some((key) => {
      let itemKey = item[key] ? item[key].toString() : "";
      return itemKey?.toLowerCase()?.includes(query);
    });
  });
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload?.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy]?.toString()?.localeCompare(a[sortBy]);
      }

      return a[sortBy]?.toString()?.localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export function JobsTable({ setApplicants, setShowApplicants }) {
  const columnNamesMappings = [
    {
      title: "Title",
      dataKey: "jobName",
    },
    {
      title: "Description",
      dataKey: "jobDescription",
    },
    {
      title: "Openings",
      dataKey: "openingsCount",
    },
    {
      title: "Work Mode",
      dataKey: "jobLocationType",
    },
    {
      title: "Status",
      dataKey: "jobStatus",
    },
    {
      title: "Location",
      dataKey: "jobLocation",
    },
    {
      title: "Applicants",
      dataKey: "applicants",
    },
    {
      title: "Posted On",
      dataKey: "postedOn",
    },
    {
      title: "Actions",
      datakey: "actions",
    },
  ];
  const data = useSelector((state) => state.job.userListedJobs);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [showUpdateJobForm, setShowUpdateJobForm] = useState(false);
  const [updatedJobData, setUpdateJobData] = useState(null);
  const [updatedJobId, setUpdateJobId] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };
  const updateJob = async (job) => {
    const body = {
      jobName: job?.jobName,
      jobDescription: job?.jobDescription,
      openingsCount: job?.openingsCount,
      jobStatus: job?.jobStatus,
      jobLocationType: job?.jobLocationType,
      jobLocation: job?.jobLocation,
    };
    const jobId = job.jobId;
    setUpdateJobData(body);
    setUpdateJobId(jobId);
    setShowUpdateJobForm(true);
  };

  const rows = sortedData.map((row) => {
    return (
      <Table.Tr key={row?.jobId}>
        <Table.Td>{row?.jobName}</Table.Td>
        <Table.Td>
          {" "}
          <div className="overflow-y-auto break-words max-h-[5rem]">
            {row?.jobDescription}
          </div>
        </Table.Td>

        <Table.Td>{row?.openingsCount}</Table.Td>
        <Table.Td>{row?.jobLocationType}</Table.Td>
        <Table.Td>{row?.jobStatus}</Table.Td>
        <Table.Td>{row?.jobLocation}</Table.Td>
        <Table.Td>
          <Button
            variant="white"
            onClick={() => {
              setApplicants(row?.applicants);
              setShowApplicants(true);
            }}
          >
            <img src={UserLogo} alt="User" width={20} height={20} />
          </Button>
        </Table.Td>
        <Table.Td>{row?.postedOn.toString().substr(0, 10)}</Table.Td>
        <Table.Td>
          {" "}
          <Button
            variant="white"
            className="self-end"
            onClick={() => updateJob(row)}
          >
            <EditIcon />
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      {showUpdateJobForm ? (
        <PopUpBase setIsOpen={setShowUpdateJobForm} isDisabled={isDisabled}>
          <UpdateJobForm
            currentData={updatedJobData}
            jobId={updatedJobId}
            setIsOpen={setShowUpdateJobForm}
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
          />
        </PopUpBase>
      ) : null}
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
        >
          <Table.Tbody>
            <Table.Tr>
              {columnNamesMappings.map((columnName) => (
                <Th
                  sorted={sortBy === columnName?.dataKey}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting(columnName?.dataKey)}
                >
                  {columnName?.title}
                </Th>
              ))}
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columnNamesMappings?.length}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
