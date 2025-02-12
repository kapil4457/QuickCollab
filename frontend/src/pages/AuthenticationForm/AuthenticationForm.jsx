import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { GoogleButton } from "./components/GoogleButton";
import { TwitterButton } from "./components/TwitterButton";
import { APPLICATION_NAME } from "../../constants/AppConstants";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  registerUserController,
  loginUserController,
} from "../../controller/UserController";
import { UserRolePicker } from "./components/UserRolePicker";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export function AuthenticationForm(props) {
  const navigate = useNavigate();
  const [type, toggle] = useToggle(["login", "register"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { type: formType } = useParams();

  const form = useForm({
    initialValues: {
      emailId: "",
      firstName: "",
      lastName: "",
      profilePicture: "",
      password: "",
      userRole: "",
      terms: false,
    },
  });
  const registerUserHandler = async () => {
    const body = {
      profilePicture:
        "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
      firstName: form.values.firstName,
      lastName: form.values.lastName,
      emailId: form.values.emailId,
      password: form.values.password,
      userRole: form.values.userRole,
      registerationMethod: "CREDENTIALS_LOGIN",
    };
    const { success, message } = await registerUserController(body);
    if (success) {
      toast.success(message);
      navigate("/");
    } else {
      toast.error(message);
    }
  };
  const loginUserHandler = async () => {
    const body = {
      emailId: form.values.emailId,
      password: form.values.password,
    };
    const response = await loginUserController(body);
    const { success, user, message } = response.data;
    if (success) {
      toast.success(message);
      navigate("/");
    } else {
      toast.error(message);
    }
  };
  useEffect(() => {
    if (formType != type) {
      toggle();
    }
  }, [formType]);

  return (
    <div className="w-[100vw]  justify-center  justify-items-center">
      <Paper className="w-[20%]" radius="md" p="sm" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to {APPLICATION_NAME}, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form
          onSubmit={form.onSubmit(() => {
            if (type === "register") {
              registerUserHandler();
            } else {
              loginUserHandler();
            }
          })}
        >
          <Stack>
            {type === "register" && (
              <>
                <TextInput
                  required
                  label="First Name"
                  style={{ textAlign: "left" }}
                  placeholder="Your First Name"
                  value={form.values.firstName}
                  onChange={(event) =>
                    form.setFieldValue("firstName", event.currentTarget.value)
                  }
                  radius="md"
                />
                <TextInput
                  required
                  label="Last Name"
                  style={{ textAlign: "left" }}
                  placeholder="Your Last Name"
                  value={form.values.lastName}
                  onChange={(event) =>
                    form.setFieldValue("lastName", event.currentTarget.value)
                  }
                  radius="md"
                />
              </>
            )}

            <TextInput
              required
              label="Email"
              style={{ textAlign: "left" }}
              placeholder="example@gmail.com"
              value={form.values.emailId}
              onChange={(event) =>
                form.setFieldValue("emailId", event.currentTarget.value)
              }
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              style={{ textAlign: "left" }}
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              radius="md"
            />

            {type === "register" && (
              <>
                <div className="flex flex-col gap-2">
                  <label
                    required
                    style={{
                      fontWeight: "500",
                      fontSize:
                        "var(--input-label-size, var(--mantine-font-size-sm))",
                    }}
                  >
                    Join as
                    <span
                      class="m_78a94662 mantine-InputWrapper-required mantine-TextInput-required"
                      aria-hidden="true"
                    >
                      {" "}
                      *
                    </span>
                  </label>
                  <UserRolePicker form={form} />
                </div>
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              </>
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                if (type == "register") {
                  newSearchParams.set("type", "login");
                } else {
                  newSearchParams.set("type", "register");
                }
                setSearchParams(newSearchParams);
                toggle();
              }}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
