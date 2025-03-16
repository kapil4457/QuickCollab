import { Avatar } from "@heroui/avatar";

const CustomAvatar = ({
  size = "sm",
  initials = "",
  firstName = "",
  lastName = "",
  src = "",
}: {
  size?: "sm" | "md" | "lg" | undefined;
  initials?: string;
  firstName?: string;
  lastName?: string;
  src?: string;
}) => {
  if (initials === "") {
    initials = firstName && firstName.length != 0 ? firstName[0] : "";
    initials += lastName && lastName.length != 0 ? lastName[0] : "";
  }
  return <Avatar isBordered size={size} name={initials} src={src} />;
};

export default CustomAvatar;
