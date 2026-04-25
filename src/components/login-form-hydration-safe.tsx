"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "@/components/login-form";

export function LoginFormHydrationSafe() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <LoginForm />;
}
