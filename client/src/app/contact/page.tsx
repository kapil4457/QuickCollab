"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { sendQueryEmail } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.userSlice.value
  );
  const { message, success } = useAppSelector(
    (state) => state.userSlice.sendQueryEmail
  );
  const [value, setValue] = useState({
    name: "",
    subject: "",
    message: "",
    email: "",
  });

  const submitHandler = async () => {
    if (value.name === "" || value.message === "" || value.email === "") {
      toast.error("Please fill in all the details.");
      return;
    }
    toast.loading("Submitting Query...", {
      duration: 3000,
    });
    dispatch(
      sendQueryEmail({
        subject: value.subject,
        body: value.message,
      })
    );
    setValue({
      name: user ? user?.name : "",
      message: "",
      email: user ? user?.email : "",
      subject: "",
    });
  };

  useEffect(() => {
    if (loading === false && isAuthenticated === false) {
      toast.error("Please login to access this page.");
      router.push("/");
    }
  }, [loading]);
  useEffect(() => {
    if (user) {
      setValue({
        name: user?.name,
        message: "",
        email: user?.email,
      });
    }
  }, [user]);
  useEffect(() => {
    if (success === true) {
      toast.success(message);
    }
    if (success === false) {
      toast.error(message);
    }
  }, [success]);
  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-center">
      <Tabs defaultValue="account" className="lg:w-[400px]">
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Got any questions? Contact us now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={value.name}
                  onChange={(e) => {
                    setValue({
                      ...value,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={value.subject}
                  onChange={(e) => {
                    setValue({
                      ...value,
                      subject: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={value.message}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    setValue({
                      ...value,
                      message: e.target.value,
                    });
                  }}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={submitHandler} className="w-full">
                Send
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
