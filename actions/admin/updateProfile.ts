"use server";

// Define the type for the profile update request
interface UpdateAdminProfileParams {
  adminId: string;
  name: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

// Server action to update the admin profile
export async function updateAdminProfile({
  adminId,
  name,
  email,
}: UpdateAdminProfileParams): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `https://boostcafe-backend.onrender.com/api/admin/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId, name, email }),
      }
    );

    const data = await response.json();
    console.log("🚀 ~ data:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to update admin profile.");
    }

    return {
      success: true,
      message: "Admin profile updated successfully!",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error updating admin profile:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
}
