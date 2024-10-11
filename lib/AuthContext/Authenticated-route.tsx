import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Hello</div>; // You can replace this with a spinner or skeleton
  }

  return <>{children}</>;
}
