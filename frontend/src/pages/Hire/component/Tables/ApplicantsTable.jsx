import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Avatar,
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
import { NavLink } from "react-router";
import ApplicantProfileRedirectLogo from "./ApplicantProfileRedirectLogo";
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
  const query = search?.toLowerCase().trim();
  return data.filter((item) => {
    return keys(data[0]).some((key) => {
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
      if (payload?.reversed) {
        return b[sortBy]?.toString()?.localeCompare(a[sortBy]?.toString());
      }

      return a[sortBy]?.toString()?.localeCompare(b[sortBy]?.toString());
    }),
    payload?.search
  );
}

export function ApplicantsTable({ data }) {
  const columnNamesMappings = [
    {
      title: "Full Name",
      dataKey: "firstName",
    },
    {
      title: "Email Id",
      dataKey: "emailId",
    },
    {
      title: "About",
      dataKey: "userId",
    },
  ];
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event?.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData?.map((row) => {
    return (
      <Table.Tr key={row?.userId}>
        <Table.Td className="flex items-center justify-start gap-2">
          {row?.profilePicture != null && row?.profilePicture != "" ? (
            <Avatar
              src={row?.profilePicture}
              alt={`${row?.firstName} ${row?.lastName}`}
            />
          ) : (
            <Avatar
              key={`${row?.firstName} ${row?.lastName}`}
              name={`${row?.firstName} ${row?.lastName}`}
              color="initials"
              allowedInitialsColors={["blue", "red"]}
            />
          )}
          {row.firstName} {row.lastName}
        </Table.Td>
        <Table.Td>{row?.emailId}</Table.Td>
        <Table.Td className="flex justify-center  items-center">
          <NavLink to={`/user/${row?.userId}`}>
            <ApplicantProfileRedirectLogo />
          </NavLink>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea>
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-center items-center text-xl font-bold">
          Job Applicants
        </div>
        <div>
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
              {rows && rows?.length > 0 ? (
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
        </div>
      </div>
    </ScrollArea>
  );
}
