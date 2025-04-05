import DefaultLayout from "@/layouts/DefaultLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Video } from "lucide-react";
import { Card } from "@heroui/card";
import { Link } from "@heroui/link";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center px-6 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold ">
            Welcome to <span className="text-blue-600">Quick Collab</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Your all-in-one platform for job hunting and seamless content
            distribution.
          </p>
          <Link href="/login">
            <Button className="mt-4 px-6 py-3 text-lg rounded-xl">
              Get Started
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 gap-12 mb-20">
          <Card className="p-8 rounded-2xl shadow-xl  hover:shadow-2xl transition duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold">Job Portal</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A smart, streamlined way for job seekers to apply and track
              applications. Content creators can easily post opportunities.
            </p>
            <Link href="/all-jobs" className="w-full">
              <Button variant="outline" className="w-full">
                Explore Jobs <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </Card>

          <Card className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <Video className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-semibold">Content Management</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Collaborate with your team to manage and upload content across
              platforms like YouTube and Twitter — all from one place.
            </p>
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Content <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-12">
          <h3 className="text-2xl font-semibold mb-2">
            Start your journey with Quick Collab today.
          </h3>
          <p className="text-gray-500 mb-4">
            Whether you're looking for opportunities or managing content — we’ve
            got you covered.
          </p>
          <Link href="/login">
            <Button className="px-6 py-3 text-lg rounded-xl">Join Now</Button>
          </Link>
        </section>
      </div>
    </DefaultLayout>
  );
}
