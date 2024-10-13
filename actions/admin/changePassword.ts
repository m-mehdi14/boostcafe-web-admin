"use server";

// Define the type for the password change request
interface ChangeAdminPasswordParams {
  adminId: string;
  newPassword: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

// Server action to change the admin password
export async function changeAdminPassword({
  adminId,
  newPassword,
}: ChangeAdminPasswordParams): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `https://boostcafe-backend.onrender.com/api/admin/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId, newPassword }),
      }
    );

    const data = await response.json();
    console.log("🚀 ~ data:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to change admin password.");
    }

    return {
      success: true,
      message: "Password changed successfully!",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error changing password:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
}
