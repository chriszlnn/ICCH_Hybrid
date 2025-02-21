import { isRedirectError } from "next/dist/client/components/redirect-error";

type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

const executeAction = async <T>({
  actionFn,
  successMessage = "The action was successful",
}: Options<T>): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await actionFn(); // Capture the result

    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Let Next.js handle redirects
    }

    console.error("Action Error:", error);

    return {
      success: false,
      message: "An error occurred while executing the action",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export { executeAction };
