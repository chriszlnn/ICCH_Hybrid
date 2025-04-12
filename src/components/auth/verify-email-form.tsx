"use client"

import { useEffect, useState, useCallback } from "react"
import CardWrapper from "../auth-ui/card-wrapper"
import { FormSuccess } from "../auth-ui/form-success"
import { FormError } from "../auth-ui/form-error"
import { newVerification } from "@/lib/actions/new-verification"

const VerifyEmailForm = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [token, setToken] = useState<string | null>(null);
    
    // Get search params in an effect to avoid hydration issues
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get("token");
        setToken(tokenParam);
    }, []);

    const onSubmit = useCallback(() => {
        if (success || error) {
            return
        }

        if(!token) {
            setError("No token provided")
            return
        }

        newVerification(token).then((data) => {
            if (data.success) {
                setSuccess(data.success)
            } 
            if (data.error) {
                setError(data.error)
            }
        }).catch((error) => {
            console.error(error)
            setError("An unexpected error occurred")
        })
    }, [token, success, error])
  
    useEffect(() => {
        if (token) {
            onSubmit();
        }
    }, [token, onSubmit]);

  return (
    <div className="min-h-screen flex items-center justify-center max-w-2xl mx-auto">
    
    <CardWrapper
      headerLabel="Confirming your email address"
      title="Confirming now..."
      backButtonHref="/sign-in"
      backButtonLabel="Back to login" 
      
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <p>Loading</p>}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
    </div>
   
  )
}

export default VerifyEmailForm