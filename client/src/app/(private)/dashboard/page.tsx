"use client";

import UserContract from "@/components/dashboard/user-contract";
import { useState } from "react";

export default function Dashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  return (
    <div className="">
      <UserContract />
    </div>
  );
}
