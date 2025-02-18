import { useEffect, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Group, Menu, UnstyledButton } from "@mantine/core";
import classes from "./css/Picker.module.css";
import {
  jobLocationTypes,
  jobStatuses,
} from "../../../../constants/JobConstants";
export function JobLocationPicker({ jobDetails, setJobDetails, isDisabled }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(jobStatuses[0]);
  const items = jobLocationTypes.map((locationType) => {
    return (
      <Menu.Item
        onClick={() => {
          setSelected(locationType);
          setJobDetails({ ...jobDetails, jobLocationType: locationType });
        }}
        key={locationType}
        className="w-full z-[3]"
      >
        {locationType}
      </Menu.Item>
    );
  });

  useEffect(() => {
    setJobDetails({ ...jobDetails, jobLocationType: jobLocationTypes[0] });
  }, []);

  return (
    <div className="w-full">
      <Menu
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        radius="md"
        withinPortal
        width={"target"}
        disabled={isDisabled}
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
            <span className={classes.label}>{selected}</span>
            <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
    </div>
  );
}
