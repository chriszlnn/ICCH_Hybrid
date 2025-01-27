import { executeAction } from "./executeAction"
import { prisma } from "./prisma"
import { schema } from "./schema"

const signUp = async (formData:FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email")
      const password = formData.get("password")
      const role = formData.get("role") as string || "CLIENT"; 
      const validatedData = schema.parse({ email, password });
      await prisma.user.create({
        data:{
            email: validatedData.email.toLowerCase(),
            password: validatedData.password,   
            role: role,
            
        }

      })
    },
  });
};
export { signUp };