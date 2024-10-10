import { getUsersData } from "@/actions/get-users";
import RoleBasedContent from "@/components/role-based-content";

export default async function Home() {
  const user = await getUsersData();
  console.log("User ----- >", user);

  return (
    <>
      <RoleBasedContent />
    </>
  );
}
