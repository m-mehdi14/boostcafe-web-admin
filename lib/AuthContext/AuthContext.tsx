/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Define user roles
type UserRole = "admin" | "restaurantAdmin";

// Define restaurant admin fields
interface RestaurantAdminDetails {
  address: string;
  adminId: string;
  createdAt: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  status: string;
}

// Extend FirebaseUser to include additional fields from Firestore
//@ts-ignore
interface ExtendedUser extends FirebaseUser {
  role?: UserRole | null;
  name?: string;
  email?: string;
  fcmToken?: string;
  accountVerify?: string;
  restaurantDetails?: RestaurantAdminDetails | null; // For restaurant admin-specific details
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

// Fetch admin data from the "users" collection
const fetchAdminData = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};

// Fetch restaurant admin details from the "restaurants" collection
const fetchRestaurantAdminDetails = async (
  adminId: string
): Promise<RestaurantAdminDetails | null> => {
  const q = query(
    collection(db, "restaurants"),
    where("adminId", "==", adminId)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const restaurantData = querySnapshot.docs[0].data();
    // Return only the required fields
    return {
      address: restaurantData.address,
      adminId: restaurantData.adminId,
      createdAt: restaurantData.createdAt,
      email: restaurantData.email,
      name: restaurantData.name,
      phone: restaurantData.phone,
      role: restaurantData.role,
      status: restaurantData.status,
    };
  }
  return null;
};

// Extend the user object with additional fields
const getExtendedUser = (
  currentUser: FirebaseUser,
  role: UserRole | null,
  name?: string,
  email?: string,
  fcmToken?: string,
  accountVerify?: string,
  restaurantDetails?: RestaurantAdminDetails | null
): ExtendedUser => ({
  ...currentUser,
  role,
  name,
  email,
  fcmToken,
  accountVerify,
  restaurantDetails,
});

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

        let role: UserRole | null = null;
        let name: string | undefined;
        let email: string | undefined;
        let fcmToken: string | undefined;
        let accountVerify: string | undefined;
        let restaurantDetails: RestaurantAdminDetails | null = null;

        // First, try fetching admin data from the "users" collection
        const adminData = await fetchAdminData(currentUser.uid);
        if (adminData) {
          role = "admin";
          name = adminData.name;
          email = adminData.email;
          fcmToken = adminData.fcmToken;
          accountVerify = adminData.accountVerify;
        } else {
          // If not found in "users", try fetching restaurant admin details
          const restaurantData = await fetchRestaurantAdminDetails(
            currentUser.uid
          );
          if (restaurantData) {
            role = "restaurantAdmin";
            name = restaurantData.name;
            email = restaurantData.email;
            restaurantDetails = restaurantData;
          } else {
            console.warn(
              "User not found in both 'users' and 'restaurants' collections."
            );
          }
        }

        // Set the extended user object
        const extendedUser = getExtendedUser(
          currentUser,
          role,
          name,
          email,
          fcmToken,
          accountVerify,
          restaurantDetails
        );
        setUser(extendedUser);
      } else {
        // Handle logout
        Cookies.remove("session");
        setUser(null);
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("session");
    setUser(null);
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
