import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Group, Menu, UnstyledButton } from "@mantine/core";
import classes from "./css/UserRolePicker.module.css";

const userRoles = [
  { label: "Content Creator", value: "CONTENT_CREATOR" },
  { label: "Job Seeker", value: "JOB_SEEKER" },
];

export function UserRolePicker({ form }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(userRoles[0]);
  const items = userRoles.map((role) => (
    <Menu.Item
      onClick={() => {
        setSelected(role);
        form.setFieldValue("userRole", event.currentTarget.value);
      }}
      key={role.value}
    >
      {role.label}
    </Menu.Item>
  ));

  return (
    <div className="w-full">
      <Menu
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        radius="md"
        withinPortal
        width={"target"}
      >
        <Menu.Target>
          <UnstyledButton
            className={classes.control}
            style={{
              width: "100%",
              height: "100%",
              padding: "0.5rem",
            }}
            data-expanded={opened || undefined}
          >
            <span className={classes.label}>{selected.label}</span>
            <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
    </div>
  );
}
