import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  updateUser,
} from "../../_firebase/users";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id == null) {
      return new NextResponse(
        JSON.stringify({ error: "User ID cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const user = await getUser({ uid: id });
    return new NextResponse(JSON.stringify({ user }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "User not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      role,
      phone1,
      phone2,
      regNo,
      group,
      level,
      companyName,
      roomName,
    } = await request.json();

    let newUser;

    if (!role) {
      return new NextResponse(JSON.stringify({ error: "Role is required" }), {
        status: 400,
      });
    }

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    if (!name) {
      return new NextResponse(JSON.stringify({ error: "Name is required" }), {
        status: 400,
      });
    }

    if (role === "student") {
      if (!regNo) {
        return new NextResponse(
          JSON.stringify({ error: "RegNo is required for students" }),
          { status: 400 }
        );
      }
      if (!group) {
        return new NextResponse(
          JSON.stringify({ error: "Student group is required for students" }),
          { status: 400 }
        );
      }
      if (!level) {
        return new NextResponse(
          JSON.stringify({ error: "Student level is required for students" }),
          { status: 400 }
        );
      }

      newUser = await createUser({
        name,
        email,
        role,
        phone1,
        phone2,
        regNo,
        group,
        level,
      });

      return new NextResponse(JSON.stringify({ user: newUser }), {
        status: 201,
      });
    }

    if (role === "companyAdmin") {
      if (!companyName) {
        return new NextResponse(
          JSON.stringify({
            error: "Company name is required for company admins",
          }),
          { status: 400 }
        );
      }

      newUser = await createUser({
        name,
        email,
        role,
        phone1,
        phone2,
        companyName,
      });

      return new NextResponse(JSON.stringify({ user: newUser }), {
        status: 201,
      });
    }

    if (role === "roomAdmin") {
      if (!roomName) {
        return new NextResponse(
          JSON.stringify({ error: "Room name is required for room admins" }),
          { status: 400 }
        );
      }

      newUser = await createUser({
        name,
        email,
        role,
        phone1,
        phone2,
        roomName,
      });

      return new NextResponse(JSON.stringify({ user: newUser }), {
        status: 201,
      });
    }

    if (role === "admin") {
      newUser = await createUser({
        name,
        email,
        role,
        phone1,
        phone2,
      });

      return new NextResponse(JSON.stringify({ user: newUser }), {
        status: 201,
      });
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "User could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { uid, ...rest } = await request.json();

    if (!uid) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      );
    }

    const updatedUser = await updateUser({ uid, ...rest });

    return new NextResponse(JSON.stringify({ user: updatedUser }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "User could not be updated",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      );
    }

    await deleteUser(id);

    return new NextResponse(
      JSON.stringify({ message: "User deleted successfully", uid: id }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "User could not be deleted",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
