import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const DEFAULT_EMAIL = "admin@mealnet.in";
const DEFAULT_PASSWORD = "admin123";

/** One-time (or reset) superadmin setup for production after Neon is connected. */
export async function POST(request: Request) {
  const secret = process.env.BOOTSTRAP_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "BOOTSTRAP_SECRET is not configured on the server" },
      { status: 503 }
    );
  }

  const provided = request.headers.get("x-bootstrap-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const email = process.env.SUPERADMIN_EMAIL?.trim() || DEFAULT_EMAIL;
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    const existing = await prisma.user.findFirst({
      where: { role: "SUPERADMIN" },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          email,
          password: hashedPassword,
          status: "APPROVED",
          approvedAt: new Date(),
        },
      });
      return NextResponse.json({
        message: "Superadmin credentials updated",
        email,
      });
    }

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        role: "SUPERADMIN",
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Superadmin created", email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bootstrap error:", error);
    return NextResponse.json(
      {
        error: "Database setup failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
