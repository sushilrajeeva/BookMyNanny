import React, { useState } from "react";
import ParentSignUp from "./ParentSignUp";
import NannySignUp from "./NannySignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignUp = () => {
  const [tabValue, setTabValue] = useState("parent");

  return (
    <div className="mt-16 p-6">
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="justify-left mb-4">
          <TabsTrigger value="parent">Parent Sign Up</TabsTrigger>
          <TabsTrigger value="nanny">Nanny Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="parent">
          <ParentSignUp />
        </TabsContent>
        <TabsContent value="nanny">
          <NannySignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignUp;
