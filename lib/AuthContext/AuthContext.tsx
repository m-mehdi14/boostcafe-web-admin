// context/AuthContext.tsx
"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import Cookies from "js-cookie";
import { app, db } from "../firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

// Define user roles
type UserRole = "admin" | "restaurantAdmin";

// Extend FirebaseUser to include role
interface ExtendedUser extends FirebaseUser {
  role?: UserRole | null;
}

// Define types for the context
interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  handleLogout: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Get router for navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const token = await currentUser.getIdToken();

        // Set the session cookie
        Cookies.set("session", token, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });

        // Fetch role from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        let role: UserRole | null = null; // Default role is null

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("🚀 ~ unsubscribe ~ userData:", userData);
          role = userData.role as UserRole;

          // Ensure role is one of the allowed roles
          if (role !== "admin" && role !== "restaurantAdmin") {
            role = null;
          }
        } else {
          // Handle case where user document does not exist
          console.warn("User document does not exist in Firestore");
          // Optionally, you might want to redirect or handle this scenario
        }

        // Extend currentUser with role
        const extendedUser: ExtendedUser = { ...currentUser, role };

        setUser(extendedUser);
      } else {
        // Handle logout
        Cookies.remove("session");
        setUser(null);
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("session");
    setUser(null);
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
