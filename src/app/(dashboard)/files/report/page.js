"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function Report() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formData = {
    refno: searchParams.get("refno"),
    title: searchParams.get("title"),
    classification: searchParams.get("classification"),
    type: searchParams.get("type"),
    sender_office: searchParams.get("sender_office"),
    sender_person: searchParams.get("sender_person"),
    sender_email: searchParams.get("sender_email"),
    sender_phone: searchParams.get("sender_phone"),
  };

  return (
    <>
      <div>report</div>
      <div>
        {formData.refno} - {formData.title}
      </div>
    </>
  );
}
