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

export function AuthenticationForm(props) {
  const [type, toggle] = useToggle(["login", "register"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { type: formType } = useParams();
  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      profilePicture: "",
      password: "",
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });
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

        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === "register" && (
              <>
                <TextInput
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
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
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
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />

            {type === "register" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
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
