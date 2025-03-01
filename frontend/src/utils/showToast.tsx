import { addToast } from "@heroui/toast";

const showToast = ({
  title,
  color = "success",
}: {
  title: string;
  color: any;
}) => {
  addToast({
    hideIcon: true,
    title,
    color,
    classNames: {
      closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
    },
    closeIcon: (
      <svg
        fill="none"
        height="32"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="32"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
  });
};

export default showToast;
