import { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Header.module.css";

const commonLinks = [
  { link: "/", label: "Home" },
  //   { link: "/dashboard", label: "Dashboard" },
  //   { link: "/jobs", label: "Jobs" },
  //   { link: "/hire", label: "Hire" },
  { link: "/contact-us", label: "Contact Us" },
  //   { link: "/me", label: "Account" },
];
const adminLinks = [
  { link: "/dashboard", label: "Dashboard" },
  { link: "/hire", label: "Hire" },
  { link: "/me", label: "Account" },
];
const userLinks = [
  { link: "/jobs", label: "Jobs" },
  { link: "/contact-us", label: "Contact Us" },
  { link: "/me", label: "Account" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const commonItems = commonLinks.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  const adminItems = commonLinks.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  const userItems = commonLinks.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <MantineLogo size={28} />
        <Group gap={5} visibleFrom="xs">
          {commonItems}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
