"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to math practice as the default page
    router.replace("/math-practice");
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontSize: "18px"
    }}>
      <p>Loading Math Practice... 🔢</p>
    </div>
  );
}
