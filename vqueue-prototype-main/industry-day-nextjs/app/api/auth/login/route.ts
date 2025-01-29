import { firebaseAuth } from "@/lib/services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "../../_firebase/users";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({
          message: "Email and Password are required.",
        }),
        {
          status: 404,
        }
      );
    }

    const exists = await getUserByEmail({ email });

    if (!exists) {
      return new NextResponse(
        JSON.stringify({
          error:
            "User not found. Contact System Administrator if you need to create an account.",
        }),
        {
          status: 404,
        }
      );
    }

    let res, user, token;

    try {
      res = await signInWithEmailAndPassword(firebaseAuth, email, password);
      user = res.user;
      token = await res.user.getIdToken();
    } catch (error) {
      res = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      user = res.user;
      token = await res.user.getIdToken();
    }

    // if (token && user) {
    //   cookies().set("accessToken", token);
    //   cookies().set("currentUser", JSON.stringify(user));
    // }

    await updateUser({
      id: exists.id,
      uid: exists.uid,
      linkedAuthId: user.uid,
    });

    return new NextResponse(
      JSON.stringify({
        message: "User signed in with Email and Password:",
        data: { user, token },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error signing in with Email and Password:",
        error: error,
      }),
      {
        status: 404,
      }
    );
  }
}
