"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const Hero = () => {
  return (
    <div>
      <div className="text-5xl font-semibold">
        Indian National Rupee REVOLUTION{" "}
        <span className="text-blue-500">(?)</span>
      </div>
      <div className="text-2xl font-medium flex justify-center items-center text-slate-600 pt-4">
        The future of INR is here, and it's decentralized.
      </div>
      <div className="text-2xl font-medium flex justify-center items-center text-blue-400 pt-4">
        Start today at a rate of stupid 1% tax given to Govt.
      </div>
      <div className="flex justify-center items-center pt-4">
        <Button
          onClick={() => {
            signIn("google");
          }}
          className="border-spacing-4 border-cyan-600 border-solid bg-slate-300 rounded-xl"
        >
          Login with Google{" "}
        </Button>
      </div>
    </div>
  );
};

export default Hero;
