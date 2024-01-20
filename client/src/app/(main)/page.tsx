"use client";
// import { useEffect, useState } from "react";
// import { TypeAnimation } from "react-type-animation";
// import Typewriter from "typewriter-effect";

import ReactRotatingText from "react-rotating-text";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [display, setDisplay] = useState("block");
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 55) {
        setDisplay("none");
      } else {
        setDisplay("block");
      }
    });
  }, []);
  const customerReviews = [
    {
      image:
        "https://hackernoon.imgix.net/images/bfqrt3x6hAVgXkezEqVTPC5AAFA2-t4o3l9h.jpeg?w=1200&q=75&auto=format",
      name: "Vivek Gupta",
      role: "CEO",
      company: "Gupta technologies",
      description:
        "Got to meet and hire very talented people from this platform.Hiring people was a smooth process.",
    },
    {
      image:
        "https://www.therockysafari.com/wp-content/uploads/2022/12/lensa-34.jpg",
      name: "Yash Kumar",
      role: "Freelancer",
      description:
        "Got a lot of opportunities on this platform.The process was totally hasslefree",
    },
    {
      image:
        "https://assets-global.website-files.com/636b968ac38dd1495ec4edcd/63c97b939cc8cf696370fa59_james-bond_AI%20Avatar%20Dyvo.webp",
      name: "Ritik Seth",
      role: "Founder",
      company: "Banaras Mithai",
      description:
        "Got connected with talented people who helped me take my business to the nexxt level.",
    },
    {
      image:
        "https://assets-global.website-files.com/636b968ac38dd1495ec4edcd/63ce5755b45e867c12c9b3cb_socials_profile.webp",
      name: "Rohit Rai",
      role: "Freelancer",
      description:
        "Got a gig on the very first day I joined this platform and also got paid timely.",
    },
    {
      image:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b5ea054b-f85a-411e-a1bb-f9f2eac45818/dfrk3pf-d44101a8-86a5-4882-82d3-e9638f191e02.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I1ZWEwNTRiLWY4NWEtNDExZS1hMWJiLWY5ZjJlYWM0NTgxOFwvZGZyazNwZi1kNDQxMDFhOC04NmE1LTQ4ODItODJkMy1lOTYzOGYxOTFlMDIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dFSRSRsjx8rj39Oc_dAqjbJL0E8Q9RJZuh4ZM4XSh0c",
      name: "Naruto",
      role: "Hokage",
      company: "Hidden Leaf village",
      description:
        "Got to hire a lot  of talented Anbu for my village on this platform.",
    },
  ];

  const features = [
    {
      title: "Connect ideas with developers.",
      description:
        "Got an idea? Connect with people you need to make it a reality.",
      image: "/idea-developer.jpeg",
    },
    {
      title: "Protection against frauds.",
      description:
        "In doubt , whether the person is real or not? We make sure that you connect with geniune people.",
      image: "/fraud-protection.jpeg",
    },
    {
      title: "Connect with like-minded people.",
      description:
        "Connect with people with same thinking as yours and take yourself to the next level.",
      image: "/like-minded.jpeg",
    },
  ];
  return (
    <>
      <div
        id="first-section"
        className="flex h-[100vh] flex-col justify-center items-center text-5xl lg:gap-3 relative"
      >
        <div
          style={{ fontWeight: 500, textAlign: "center" }}
          className="flex lg:text-5xl md:text-4xl text-3xl w-full self-center items-center justify-center"
        >
          One stop solution to{" "}
        </div>
        {/* <TypeAnimation
          sequence={[
            "FIND JOBS",
            1500,
            "HIRE TALENT",
            1500,
            "LEVEL UP",
            1500,
            () => {
              console.log("Sequence completed");
            },
          ]}
          wrapper="div"
          cursor={true}
          repeat={Infinity}
          style={{ fontWeight: "700", color: "orange" }}
          className="flex lg:text-8xl md:text-7xl text-5xl w-full self-center items-center justify-center"
        /> */}

        <span
          className="text-violet-600 dark:text-orange-500 flex lg:text-8xl md:text-7xl text-5xl  self-center items-center justify-center"
          style={{ fontWeight: 700 }}
        >
          <ReactRotatingText items={["FIND JOBS", "HIRE TALENT", "LEVEL UP"]} />
        </span>
        {/* <KeyboardDoubleArrowDownIcon
          className="absolute bottom-[1rem]"
          style={{ width: "2rem", height: "2rem" }}
        /> */}
        <div
          style={{ display: display }}
          className="absolute bottom-[4rem] translate-x-[-50%] translate-y-[-50%] box"
        >
          <span
            className="block w-[17px] h-[17px]  rotate-[45deg] m-[-10px] border-b-[2px] border-r-[2px] border-black dark:border-white"
            style={{
              animation: "animate 2s infinite",
            }}
          ></span>
          <span
            className="block w-[17px] h-[17px] rotate-[45deg] m-[-10px] border-b-[2px] border-r-[2px]  border-black dark:border-white "
            style={{
              animation: "animate 2s infinite",
              animationDelay: "-0.2s",
            }}
          ></span>
          <span
            className="block w-[17px] h-[17px] rotate-[45deg] m-[-10px] border-b-[2px] border-r-[2px]  border-black dark:border-white"
            style={{
              animation: "animate 2s infinite",
              animationDelay: "-0.4s",
            }}
          ></span>
        </div>
      </div>
      <div
        id="section-section"
        className="flex h-[100%] flex-col justify-evenly items-center text-5xl lg:gap-6"
      >
        <div className="flex w-full items-center justify-evenly flex-col  mt-12  gap-16 lg:gap-24">
          <h1
            className=" flex w-full text-center justify-center items-center text-4xl lg:text-5xl"
            style={{ fontWeight: 600 }}
          >
            Platform Features
          </h1>
          <div className="flex w-full items-center justify-evenly flex-col gap-4 lg:flex-row lg:gap-0 ">
            {features.map((ele, index) => (
              <Card
                // sx={{ maxWidth: 345 }}
                className=" h-[22rem] w-[90vw] md:w-[400px] md:h-[20rem] lg:w-[400px]  lg:h-[32rem] "
                key={index}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={ele.image}
                  alt={ele.title}
                  className="h-48 lg:h-96 !object-cover"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {ele.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ele.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center justify-evenly flex-col  mt-12 gap-16 lg:gap-24 ">
          <h1
            className=" flex w-full text-center justify-center items-center text-4xl lg:text-5xl"
            style={{ fontWeight: 600 }}
          >
            Customer Reviews
          </h1>

          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-[90vw]"
          >
            <CarouselContent className="-ml-1">
              {customerReviews.map((ele, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 basis-1/1 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <Card className=" w-[90vw] h-52 lg:w-[345px] p-4 gap-2">
                      <div className="flex gap-5">
                        <CardMedia
                          component="img"
                          image={ele.image}
                          alt={ele.name}
                          style={{
                            height: "4.5rem",
                            width: "4.5rem",
                            borderRadius: "100%",
                            objectFit: "cover",
                            boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                          }}
                        />
                        <div className="flex flex-col gap-0">
                          <span className="text-2xl">{ele.name}</span>
                          <span className="text-[15px] text-gray-600 font-bold">
                            {ele.role}
                          </span>
                          <span className="text-[13px] text-gray-500">
                            {ele.company}
                          </span>
                        </div>
                      </div>
                      <CardContent>
                        <Typography variant="body1" color="text.secondary">
                          {ele.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
      <div
        id="third-section"
        className="w-full mt-24 flex items-center justify-center"
      >
        <div
          className="bg-slate-700  w-[60%] flex justify-center items-center flex-col h-52 gap-9 dark:bg-slate-100"
          style={{ borderRadius: "15px" }}
        >
          <h1 className="text-6xl font-extrabold text-white font-serif dark:text-slate-700">
            Got any Questions ?
          </h1>
          <Button
            variant={"contact_us"}
            className="w-[10rem] h-[3rem] text-gray-50 text-xl"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </>
  );
}
