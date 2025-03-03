import DefaultLayout from "@/layouts/DefaultLayout";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RegisterationMethod, RegistrationRole } from "@/utils/enums";
import {
  loginUserHandler,
  registerUserHandler,
} from "@/store/controllers/UserController";
import { useAppDispatch } from "@/store/hooks";
import showToast from "@/utils/showToast";

type FormErrors = {
  emailId?: string;
  password?: string;
  terms?: string;
  firstName?: string;
  lastName?: string;
  userRole?: string;
};
const Login = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let type = searchParams.get("type");
  const dispatch = useAppDispatch();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    const newErrors: FormErrors = {};
    if (data.emailId === "admin@gmail.com")
      newErrors.emailId = "Nice try! Choose a different email address";
    if (type === "register") {
      if (!data.terms) newErrors.terms = "Please accept the terms";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    let response;
    if (type == "login") {
      const body = {
        emailId: data.emailId,
        password: data.password,
      };
      response = await loginUserHandler(body, dispatch);
    } else {
      const body = {
        emailId: data.emailId,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        registerationMethod: RegisterationMethod.CREDENTIALS_LOGIN,
        userRole: data.userRole,
        profilePicture: "",
      };
      response = await registerUserHandler(body, dispatch);
    }
    showToast({
      color: response.success ? "success" : "danger",
      title: response.message,
    });

    if (response.success) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (type == null || (type !== "login" && type !== "register")) {
      navigate("/login?type=login");
    }
  }, []);

  return (
    <DefaultLayout>
      <Form
        className="w-full justify-center items-center space-y-4"
        validationErrors={errors}
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4">
          {type == "register" ? (
            <>
              <Input
                isRequired={type === "register"}
                label="First Name"
                labelPlacement="outside"
                name="firstName"
                placeholder="Enter your First Name"
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter your first name";
                  }
                  return errors.firstName;
                }}
              />
              <Input
                isRequired={type === "register"}
                label="Last Name"
                labelPlacement="outside"
                name="lastName"
                placeholder="Enter your Last Name"
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter your last name";
                  }
                  return errors.lastName;
                }}
              />
            </>
          ) : null}

          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="emailId"
            type="email"
            placeholder="Enter your email address"
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your email";
              }
              if (validationDetails.typeMismatch) {
                return "Please enter a valid email address";
              }
              return errors.emailId;
            }}
          />

          <Input
            isRequired
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your password";
              }
              return errors.password;
            }}
            type="password"
          />
          {type == "register" ? (
            <>
              <Select
                isRequired={type === "register"}
                label="User Role"
                labelPlacement="outside"
                name="userRole"
                placeholder="Select Role"
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please select a role to register as";
                  }
                  return errors.firstName;
                }}
              >
                <SelectItem key={RegistrationRole.CONTENT_CREATOR}>
                  {RegistrationRole.CONTENT_CREATOR}
                </SelectItem>
                <SelectItem key={RegistrationRole.JOB_SEEKER}>
                  {RegistrationRole.JOB_SEEKER}
                </SelectItem>
              </Select>
              <Checkbox
                isRequired={type === "register"}
                classNames={{
                  label: "text-small",
                }}
                isInvalid={!!errors.terms}
                name="terms"
                validationBehavior="aria"
                value="true"
                onValueChange={() =>
                  setErrors((prev) => ({ ...prev, terms: undefined }))
                }
              >
                I agree to the terms and conditions
              </Checkbox>

              {errors.terms && (
                <span className="text-danger text-small">{errors.terms}</span>
              )}
            </>
          ) : null}

          <span className="text-gray-400 text-small">
            {type === "login"
              ? "Don't have an account ?"
              : "Already have an account ?"}{" "}
            <strong
              className="cursor-pointer hover:underline"
              onClick={() =>
                setSearchParams({
                  type: type === "login" ? "register" : "login",
                })
              }
            >
              {type === "login" ? "Register here" : "Login here"}
            </strong>
          </span>

          <Button className="w-full" color="primary" type="submit">
            {type == "login" ? "Login" : "Register"}
          </Button>
        </div>
      </Form>
    </DefaultLayout>
  );
};

export default Login;
