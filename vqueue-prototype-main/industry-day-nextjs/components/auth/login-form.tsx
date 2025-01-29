"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { firebaseAuth, googleAuthProvider } from "@/lib/services/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { setCookie } from "cookies-next";
import { Separator } from "@/components/ui/separator";

// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setAccessToken, setUser } from "@/lib/redux/features/users/user.slice";

export default function LoginForm() {
  const [isClient, setIsClient] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const router = useRouter();
  // const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // returns null if user not found
  const verifyUserExists = async (email: string) => {
    const res = await fetch("/api/users/user/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const { user } = await res.json();
    return user;
  };

  // Function to fetch room details by roomName
  const fetchRoomByRoomName = async (roomName: string) => {
    const res = await fetch("/api/rooms/room/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: roomName }),
    });
    const { room } = await res.json();
    return room;
  };

  const handleGoogleSignIn = async () => {
    try {
      let res, user, token;

      res = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      token = credential!.accessToken;
      user = res.user;

      if (token && user && user.email) {
        const exists = await verifyUserExists(user.email);

        if (exists === null) {
          await signOut(firebaseAuth);
          throw new Error(
            "A user is not linked with this Google account. Contact a system administrator."
          );
        }

        const updatedUserRes = await fetch("/api/users/user", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: exists.id, linkedAuthId: user.uid }),
        });
        const updatedUser = await updatedUserRes.json();

        if (updatedUser.error) {
          await signOut(firebaseAuth);
          throw new Error(updatedUser.error);
        }

        setCookie("accessToken", token);
        setCookie("currentUser", user);

        // Check if user is a roomAdmin
        if (exists.role === 'roomAdmin') {
          const roomDetails = await fetchRoomByRoomName(exists.roomName);
          if (roomDetails) {
            router.push(`/agent/room/${roomDetails.roomId}`);
          } else {
            router.push("/panels");
          }
        } else {
          router.push("/panels");
        }

        toast({
          title: "Login Successful",
          description: "You have successfully logged in. Welcome!",
        });
      }

      console.log("User signed in with Google:");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an issue signing in with Google. Please try again.",
      });
    }
  };

  const handleEmailPasswordLogin = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email) {
      setEmailError("Email is required");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }

    if (!email || !password) {
      return; // Stop if there are errors
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const loginRes = await res.json();

      // check login response
      if (loginRes.error) {
        throw new Error(loginRes.error);
      }

      // dispatch(setUser(loginRes.user));
      // dispatch(setAccessToken(loginRes.token));

      if (loginRes.data.token && loginRes.data.user) {
        setCookie("accessToken", loginRes.data.token);
        setCookie("currentUser", loginRes.data.user);

        // Check if user is a roomAdmin
        const verifiedUser = await verifyUserExists(email);
        if (verifiedUser.role === 'roomAdmin') {
          const roomDetails = await fetchRoomByRoomName(verifiedUser.roomName);
          if (roomDetails) {
            router.push(`/agent/room/${roomDetails.roomId}`);
          } else {
            router.push("/room-map");
          }
        } else {
          router.push("/dashboard");
        }

        toast({
          title: "Login Successful",
          description: "You have successfully logged in. Welcome!",
        });
      }

    } catch (error: any) {
      console.error(
        "Error signing in with Email and Password:",
        JSON.stringify(error)
      );
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You have entered incorrect credentials. Try Again!",
      });
    }
  };

  const handleInputChange = () => {
    if (emailRef.current && emailError) {
      setEmailError(""); // Clear email error
    }
    if (passwordRef.current && passwordError) {
      setPasswordError(""); // Clear password error
    }
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="w-full p-5 sm:w-96">
      <div className="w-full flex flex-col gap-5">
        <h1 className="text-center text-2xl font-semibold text-vq-secondary">
          Login
        </h1>

        <div className="flex flex-col gap-2">
          <Input
            ref={emailRef}
            type="email"
            placeholder="Email"
            className={`border-vq-pearl py-6 text-base active:scale-105 hover:shadow-xl hover:shadow-vq-pearl ${
              emailError ? "border-red-500" : ""
            }`}
            onChange={handleInputChange}
          />
          {emailError && (
            <span className="text-red-500 text-sm">{emailError}</span>
          )}

          <Input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className={`border-vq-pearl py-6 text-base active:scale-105 hover:shadow-xl hover:shadow-vq-pearl ${
              passwordError ? "border-red-500" : ""
            }`}
            onChange={handleInputChange}
          />
          {passwordError && (
            <span className="text-red-500 text-sm">{passwordError}</span>
          )}

          {/* <Link
            href="#"
            className="w-full text-sm hover:text-vq-failure font-medium text-vq-secondary no-underline"
          >
            Have trouble signing in?
          </Link> */}
        </div>

        <div className="flex flex-col gap-5">
          <div className="w-full flex justify-center">
            <Button
              className="w-full text-base py-5 hover:bg-blue-300 bg-stone-800 shadow-2xl"
              onClick={handleEmailPasswordLogin}
            >
              Login
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              className="w-full text-base py-5 bg-blue-500 hover:bg-blue-300 text-white"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          </div>
          
          <Separator />

          <Link
            href="/panels"
            className="w-full text-sm hover:text-blue-500 font-medium text-stone-800 no-underline text-center"
          >
            Sign in as guest
          </Link>
        </div>
      </div>
    </div>
  );
}
