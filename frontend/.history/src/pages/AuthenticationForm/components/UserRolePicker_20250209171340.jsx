import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Group, Image, Menu, UnstyledButton } from "@mantine/core";
import classes from "./LanguagePicker.module.css";

const userRoles = [
  { label: "Content Creator", value: "CONTENT_CREATOR" },
  { label: "Job Seeker", value: "JOB_SEEKER" },
];

export function UserRolePicker(form) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(data[0]);
  const items = userRoles.map((role) => (
    <Menu.Item onClick={() => setSelected(role)} key={role.value}>
      {role.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={classes.control}
          data-expanded={opened || undefined}
        >
          <Group gap="xs">
            <Image src={selected.image} width={22} height={22} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
