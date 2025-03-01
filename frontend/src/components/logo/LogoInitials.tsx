import { Button } from "@heroui/button";
import "./Logo.css";
import { Link } from "@heroui/link";

const LogoInitials = () => {
  return (
    <Button
      as={Link}
      href="/"
      size="sm"
      variant="bordered"
      isIconOnly
      className={`logo-title text-lg p-4`}
    >
      QC
    </Button>
  );
};

export default LogoInitials;
