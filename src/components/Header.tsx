"use client";
import React, { use, useEffect, useState } from "react";
import { Sun, Moon, LineChart } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import Link from "next/link";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [sign,setSign] =useState(false);
  const [mounted, setMounted] = useState(false);

  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/signup";
  }

  const handleSignup=()=>{
    window.location.href = "/signup";
  }

  useEffect(() => {
    if(localStorage.getItem("token") !== null){
      setSign(true);
    }
    else{
      setSign(false);
    }
    
    setMounted(true);
  }, []);

  return (
    <div className="sticky top-0 bg-inherit min-h-[7vh] flex justify-between items-center">
      <Link href={"/"}>
        <div className="flex items-center gap-2 md:gap-3 md:ml-6 p-2">
          <div suppressHydrationWarning={true} className="relative flex items-center mr-2 space-x-1">
            <LineChart className="w-8 h-8 text-green-500" />
            <div className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="" style={{ fontSize: "clamp(15px,4vw,24px)" }}>
              Expense Tracker
            </h1>
            <p className="ml-5" style={{ fontSize: "clamp(7px,1vw,17px)" }}>
              Track your expenses effortlessly
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-1 md:gap-3 mr-2 md:mr-6">
        <div>
          {/* <Link href={"/signup"}> */}
            {sign ? (<Button variant={"outline"} onClick={handleLogout} className="max-sm:text-xs">
              <AnimatedShinyText shimmerWidth={100}>Logout</AnimatedShinyText>
            </Button>):
            (<Button variant={"outline"} onClick={handleSignup} className="max-sm:text-xs">
              <AnimatedShinyText shimmerWidth={100}>Signup</AnimatedShinyText>
            </Button>)
            
            }
          {/* </Link> */}
        </div>
        <div>
          {mounted && (
            <Button
              variant={"outline"}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
