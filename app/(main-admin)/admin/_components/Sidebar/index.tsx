import React from "react";
import { Wrapper } from "./Wrapper";
import { Toggle } from "./toggle";
import { Navigation } from "./Navigation";

export const Sidebar = async () => {
  // const user: any = await currentUser();

  return (
    <Wrapper>
      <Toggle />
      <Navigation />
    </Wrapper>
  );
};
