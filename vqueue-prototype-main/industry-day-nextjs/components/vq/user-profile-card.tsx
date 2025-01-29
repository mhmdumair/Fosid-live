"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
// import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { IUser } from "@/lib/models/interfaces/IUser";
import { toast } from "../ui/use-toast";
import Spinner from "./spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";

const UserProfileCard = () => {
  // const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser>();
  const router = useRouter();

  // Create refs for the form inputs
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phone1Ref = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show loading screen for 2 seconds

    const currentUser = getCookie("currentUser");
    currentUser && fetchUser(currentUser);

    return () => clearTimeout(timer);
  }, []);

  const fetchUser = async (currentUser: any) => {
    if (currentUser !== undefined || currentUser !== "undefined") {
      const c = JSON.parse(currentUser);
      const res = await fetch("/api/users/user/linked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: c.uid }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        toast({
          title: "Error fetching user",
          description: "Failed to fetch user",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "GET" });

    if (res.ok) {
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      router.push("/login");
    } else {
      toast({
        title: "Logout failed",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (
      nameRef.current &&
      emailRef.current &&
      phone1Ref.current &&
      phone2Ref.current
    ) {
      const updatedUser = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone1: phone1Ref.current.value,
        phone2: phone2Ref.current.value,
      };
      // Call API or handle the updated user data here
      console.log(updatedUser);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Spinner />
          <div>Getting user data. Please wait patiently.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-8 sm:p-16">
      {user === null || user === undefined ? (
        <>
          <div className="mb-4 border border-red-500 rounded-lg p-4">
            <h2 className="text-3xl font-bold">You&apos;re not logged in!</h2>
            <p className=" text-vq-failure font-medium text-sm mt-2">
              The system can be accessed by authenticated users only.
            </p>
          </div>
          <Button
            className="bg-stone-800 hover:bg-slate-700"
            onClick={() => router.push("/login")}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Login
          </Button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold">
                {user?.name || "User profile"}
              </h2>
              <p className=" text-vq-darkRose text-sm">
                {user?.role || "User role"}
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger className="bg-blue-500 hover:bg-blue-300 px-4 rounded-md font-medium text-white">
                  <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                  Edit
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                      Update you user profile details here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="name"
                        className="font-semibold text-sm text-slate-500"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        defaultValue={user?.name}
                        ref={nameRef}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="role"
                        className="font-semibold text-sm text-slate-500"
                      >
                        Role
                      </label>
                      <Input id="role" defaultValue={user?.role} disabled />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="font-semibold text-sm text-slate-500"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        defaultValue={user?.email}
                        ref={emailRef}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="phone1"
                        className="font-semibold text-sm text-slate-500"
                      >
                        Phone Number 1
                      </label>
                      <Input
                        id="phone1"
                        defaultValue={user?.phone1}
                        ref={phone1Ref}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="phone2"
                        className="font-semibold text-sm text-slate-500"
                      >
                        Phone Number 2
                      </label>
                      <Input
                        id="phone2"
                        defaultValue={user?.phone2}
                        ref={phone2Ref}
                      />
                    </div>
                    <div className="w-full flex gap-2">
                      <DialogClose asChild>
                        <Button
                          onClick={handleSave}
                          className="bg-slate-200 hover:bg-slate-300 w-full text-stone-800"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-300 w-full"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                className="bg-stone-800 hover:bg-slate-700"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <ul className="w-full grid bg-white p-5 rounded-lg">
            <li className="grid grid-cols-2 F font-semibold">
              <span>Email</span>
              <span className="text-left text-vq-darkRose">{user?.email}</span>
            </li>
            <li className="grid grid-cols-2 F font-semibold">
              <span>Phone Number 1</span>
              <span className="text-left text-vq-darkRose">{user?.phone1}</span>
            </li>
            <li className="grid grid-cols-2 F font-semibold">
              <span>Phone Number 2</span>
              <span className="text-left text-vq-darkRose">{user?.phone2}</span>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default UserProfileCard;
