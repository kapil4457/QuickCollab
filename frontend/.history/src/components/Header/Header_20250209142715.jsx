import { useState } from "react";
import { Burger, Container, Group, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Header.module.css";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { NavLink } from "react-router";

const commonLinks = [
  { link: "/", label: "Home" },
  { link: "/contact-us", label: "Contact Us" },
];
const adminLinks = [
  { link: "/dashboard", label: "Dashboard" },
  { link: "/hire", label: "Hire" },
];
const userLinks = [{ link: "/jobs", label: "Jobs" }];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(commonLinks[0].link);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const adminItems = adminLinks.map((link) => (
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

  const userItems = userLinks.map((link) => (
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
          {isAdmin ? adminItems : userItems}
        </Group>
        <Group>
          {isAuthenticated ? (
            <NavLink
              key="Account"
              href="/me"
              className={classes.link}
              data-active={active === "/me" || undefined}
              onClick={(event) => {
                event.preventDefault();
                setActive("/me");
              }}
            >
              Account
            </NavLink>
          ) : (
            <Group visibleFrom="sm">
              <a href="/login?type=login">
                <Button variant="default">Log in</Button>
              </a>
              <a href="/login?type=register">
                <Button>Sign up</Button>
              </a>
            </Group>
          )}
          <ThemeToggle />
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
