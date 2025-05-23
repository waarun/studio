
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, type User, type UserMetadata, type UserInfo, type IdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { LogIn } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Allow shorter for dev password
});

// Hardcoded developer credentials
const DEV_ADMIN_EMAIL = "devadmin@eventide.com";
const DEV_USER_EMAIL = "devuser@eventide.com";
const DEV_PASSWORD = "devpassword"; // Same password for simplicity

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setMockAuth } = useAuth(); // Get setMockAuth from context

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Check for developer admin credentials
    if (values.email === DEV_ADMIN_EMAIL && values.password === DEV_PASSWORD) {
      const mockAdminUserObject: User = {
        uid: 'dev-admin-uid',
        email: DEV_ADMIN_EMAIL,
        displayName: 'Dev Admin (Local)',
        emailVerified: true,
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        } as UserMetadata,
        providerData: [
          {
            providerId: 'password',
            uid: 'dev-admin-uid',
            displayName: 'Dev Admin (Local)',
            email: DEV_ADMIN_EMAIL,
            phoneNumber: null,
            photoURL: null,
          }
        ] as UserInfo[],
        providerId: 'firebase',
        refreshToken: 'mock-refresh-token',
        tenantId: null,
        delete: async () => { console.log('Mock admin user delete called'); },
        getIdToken: async (forceRefresh?: boolean) => 'mock-id-token-admin',
        getIdTokenResult: async (forceRefresh?: boolean) => ({
          token: 'mock-id-token-admin',
          claims: { admin: true } as any, 
          authTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
          issuedAtTime: new Date().toISOString(),
          signInFactor: null,
          signInProvider: 'password',
        } as IdTokenResult),
        reload: async () => { console.log('Mock admin user reload called'); },
        toJSON: () => ({
          uid: 'dev-admin-uid',
          email: DEV_ADMIN_EMAIL,
          displayName: 'Dev Admin (Local)',
        }),
      };
      
      setMockAuth(mockAdminUserObject, true); // Set mock user as admin
      toast({ title: "Developer Admin Login Successful", description: "Logged in as local Dev Admin." });
      router.push("/admin"); 
      return; 
    }

    // Check for developer regular user credentials
    if (values.email === DEV_USER_EMAIL && values.password === DEV_PASSWORD) {
      const mockUserObject: User = {
        uid: 'dev-user-uid',
        email: DEV_USER_EMAIL,
        displayName: 'Dev User (Local)',
        emailVerified: true,
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        } as UserMetadata,
        providerData: [
          {
            providerId: 'password',
            uid: 'dev-user-uid',
            displayName: 'Dev User (Local)',
            email: DEV_USER_EMAIL,
            phoneNumber: null,
            photoURL: null,
          }
        ] as UserInfo[],
        providerId: 'firebase',
        refreshToken: 'mock-refresh-token-user',
        tenantId: null,
        delete: async () => { console.log('Mock user delete called'); },
        getIdToken: async (forceRefresh?: boolean) => 'mock-id-token-user',
        getIdTokenResult: async (forceRefresh?: boolean) => ({
          token: 'mock-id-token-user',
          claims: { admin: false } as any, // Regular user, so admin is false
          authTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
          issuedAtTime: new Date().toISOString(),
          signInFactor: null,
          signInProvider: 'password',
        } as IdTokenResult),
        reload: async () => { console.log('Mock user reload called'); },
        toJSON: () => ({
          uid: 'dev-user-uid',
          email: DEV_USER_EMAIL,
          displayName: 'Dev User (Local)',
        }),
      };
      
      setMockAuth(mockUserObject, false); // Set mock user as non-admin
      toast({ title: "Developer User Login Successful", description: "Logged in as local Dev User." });
      router.push("/dashboard"); // Redirect to dashboard for regular users
      return;
    }

    // Regular Firebase authentication
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      // Check if redirect query param exists
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } catch (error) {
      console.error("Login error: ", error);
      toast({
        title: "Login Failed",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials. Dev Logins:<br/>
          Admin: devadmin@eventide.com / devpassword<br/>
          User: devuser@eventide.com / devpassword
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing In..." : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Button variant="link" asChild className="p-0 h-auto text-primary">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
