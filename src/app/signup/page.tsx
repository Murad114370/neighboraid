"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const user = Object.fromEntries(formData.entries()) as {
      name: string
      image: string
      email: string
      password: string
    }

    // Password Validation: Uppercase, Lowercase, and at least 6 characters
    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }
    if (!/[A-Z]/.test(user.password)) {
      toast.error("Password must contain at least one uppercase letter.")
      return
    }
    if (!/[a-z]/.test(user.password)) {
      toast.error("Password must contain at least one lowercase letter.")
      return
    }

    setLoading(true)

    const { data, error } = await authClient.signUp.email({
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.")
      return
    }

    if (data) {
      toast.success("Account created successfully!")
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    }
  }

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/40 px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <Card className="border-sky-200/80 dark:border-sky-800/50 shadow-xl shadow-sky-500/10 backdrop-blur-sm bg-white/95 dark:bg-slate-900/90">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400 shadow-inner">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create an Account
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Join NeighborAid and start making an impact in your community
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleEmailSignUp}>
              <FieldGroup className="space-y-4">
                {/* Social Sign Up */}
                <Field className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="w-full border-sky-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 dark:border-sky-800 dark:hover:bg-sky-950/60 dark:hover:text-sky-300 transition-all cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-white dark:*:data-[slot=field-separator-content]:bg-slate-900 text-xs uppercase text-slate-400">
                  Or register with email
                </FieldSeparator>

                {/* Name Field */}
                <Field>
                  <FieldLabel
                    htmlFor="name"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Full Name
                  </FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Murad Ibne Hashem"
                      required
                      className="pl-10 border-sky-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 dark:border-slate-700"
                    />
                  </div>
                </Field>

                {/* Email Field */}
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="pl-10 border-sky-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 dark:border-slate-700"
                    />
                  </div>
                </Field>

                {/* Photo URL Field */}
                <Field>
                  <FieldLabel
                    htmlFor="image"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Photo URL
                  </FieldLabel>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
                    <Input
                      id="image"
                      type="url"
                      name="image"
                      placeholder="https://example.com/avatar.jpg"
                      required
                      className="pl-10 border-sky-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 dark:border-slate-700"
                    />
                  </div>
                </Field>

                {/* Password Field */}
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="pl-10 pr-10 border-sky-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FieldDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Must be at least 6 characters with 1 uppercase and 1 lowercase letter.
                  </FieldDescription>
                </Field>

                {/* Submit & Login Redirect */}
                <Field className="pt-2 space-y-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>

                  <FieldDescription className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 underline underline-offset-4"
                    >
                      Login here
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center text-xs text-slate-500 dark:text-slate-400">
          By creating an account, you agree to our{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-sky-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-sky-600">
            Privacy Policy
          </Link>
          .
        </FieldDescription>
      </div>
    </div>
  )
}