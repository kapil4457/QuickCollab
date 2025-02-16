import { useState } from "react";
import { Burger, Container, Group, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Header.module.css";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { NavLink } from "react-router";
import Logo from "../logo/Logo";
import { useSelector } from "react-redux";
import { Avatar } from "@mantine/core";
import LogoutIcon from "../LogoutIcon";
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
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  const [isContentCreator, setIsContentCreator] = useState(
    isAuthenticated && user?.userRole === "CONTENT_CREATOR"
  );
  const commonItems = commonLinks.map((link) => (
    <NavLink
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        setActive(link.link);
      }}
    >
      {link.label}
    </NavLink>
  ));

  const adminItems = adminLinks.map((link) => (
    <NavLink
      to={link.link}
      key={link.label}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        setActive(link.link);
      }}
    >
      {link.label}
    </NavLink>
  ));

  const userItems = userLinks.map((link) => (
    <NavLink
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        setActive(link.link);
      }}
    >
      {link.label}
    </NavLink>
  ));

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <Logo />
        <Group gap={5} visibleFrom="xs">
          {commonItems}
          {isContentCreator ? adminItems : userItems}
        </Group>
        <Group>
          {isAuthenticated ? (
            <>
              <NavLink
                key="Account"
                className={`${classes.link} flex! gap-1   items-center! justify-center! self-center! `}
                to="/me"
              >
                {user?.profilePicture != null && user?.profilePicture != "" ? (
                  <Avatar
                    src={user?.profilePicture}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                ) : (
                  <Avatar
                    key={`${user?.firstName} ${user?.lastName}`}
                    name={`${user?.firstName} ${user?.lastName}`}
                    color="initials"
                    allowedInitialsColors={["blue", "red"]}
                  />
                )}

                <span>{`${user?.firstName} ${user?.lastName}`}</span>
              </NavLink>

              <NavLink key="Logout" className={classes.outerLink} to="/logout">
                <Button variant="default">
                  <LogoutIcon />
                </Button>
              </NavLink>
            </>
          ) : (
            <Group visibleFrom="sm">
              <NavLink to="/login?type=login">
                <Button variant="default">Log in</Button>
              </NavLink>
              <NavLink to="/login?type=register">
                <Button>Sign up</Button>
              </NavLink>
            </Group>
          )}
          <ThemeToggle />
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
