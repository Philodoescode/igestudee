"use client"

import { useFormState, useFormStatus } from "react-dom"
import { registerStaff, type State } from "./actions"
import { Toaster, toast } from "sonner"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Registering..." : "Register User"}
    </Button>
  )
}

export default function RegisterStaffPage() {
  const initialState: State = { message: null, errors: {} }
  const [state, dispatch] = useFormState(registerStaff, initialState)

  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        toast.error(state.message)
      } else {
        toast.success(state.message)
      }
    }
  }, [state])

  return (
    <div className="space-y-6">
      <Toaster position="top-center" richColors />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Register Staff</h1>
        <p className="text-gray-600 mt-1">Create a new account for an Instructor.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New User Details</CardTitle>
          <CardDescription>Fill in the form below to create a new user profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
                {state.errors?.firstName && <p className="text-sm text-red-500">{state.errors.firstName[0]}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required />
                {state.errors?.lastName && <p className="text-sm text-red-500">{state.errors.lastName[0]}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required />
              {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && <p className="text-sm text-red-500">{state.errors.password[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" required defaultValue="instructor">
                  <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
                {state.errors?.role && <p className="text-sm text-red-500">{state.errors.role[0]}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {state.errors?.gender && <p className="text-sm text-red-500">{state.errors.gender[0]}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                {state.errors?.dateOfBirth && <p className="text-sm text-red-500">{state.errors.dateOfBirth[0]}</p>}
              </div>
              
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" />
              </div>
            </div>

            {state.errors?.server && <p className="text-sm font-medium text-red-500">{state.errors.server[0]}</p>}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}