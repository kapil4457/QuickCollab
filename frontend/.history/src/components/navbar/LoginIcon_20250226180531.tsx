import { link as linkStyles } from "@heroui/theme";

const LoginIcon = () => {
  return (
    <svg
      className={clsx(
        linkStyles({ color: "foreground" }),
        "data-[active=true]:text-primary data-[active=true]:font-medium font-semibold"
      )}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-login"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M21 12h-13l3 -3" />
      <path d="M11 15l-3 -3" />
    </svg>
  );
};

export default LoginIcon;
