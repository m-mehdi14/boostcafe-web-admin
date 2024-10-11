"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
// import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import React from "react";
import { LuArrowLeftFromLine, LuArrowRightFromLine } from "react-icons/lu";

export const Toggle = () => {
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);

  const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
      {collapsed && (
        <div className=" w-full hidden lg:flex items-center justify-center pt-4 mb-4">
          <Hint label={label} side="right" asChild>
            <Button
              onClick={onExpand}
              variant={"ghost"}
              className=" h-auto p-2"
            >
              <LuArrowRightFromLine className=" h-4 w-4" />
            </Button>
          </Hint>
        </div>
      )}
      {!collapsed && (
        <div className=" p-3 pl-6 mb-2 hidden lg:flex items-center w-full">
          <p className=" font-semibold ">Boost Cafe</p>
          <Hint label={label} side="right" asChild>
            <Button
              onClick={onCollapse}
              variant={"ghost"}
              className=" h-auto p-2 ml-auto"
            >
              <LuArrowLeftFromLine className=" h-4 w-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
};
