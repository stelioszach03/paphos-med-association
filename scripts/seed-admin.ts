import { db } from "../src/db/client";
import { users, adminUsers } from "../src/db/schema";
import { hash } from "oslo/password";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

async function seedAdmin() {
  const email = "sjzacha@gmail.com";
  const password = crypto.randomBytes(16).toString("base64");
  
  console.log("Seeding super admin user...");

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: string;

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
      console.log("User already exists, updating password...");
      
      // Update password
      const hashedPassword = await hash(password, {
        algorithm: "argon2id",
        strength: "strong",
      });
      
      await db
        .update(users)
        .set({ hashedPassword })
        .where(eq(users.id, userId));
    } else {
      // Create new user
      userId = generateId(15);
      const hashedPassword = await hash(password, {
        algorithm: "argon2id",
        strength: "strong",
      });

      await db.insert(users).values({
        id: userId,
        email,
        hashedPassword,
        fullName: "Super Admin",
      });
      
      console.log("Created new user");
    }

    // Check if admin role exists
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId))
      .limit(1);

    if (existingAdmin.length > 0) {
      // Update role to super_admin
      await db
        .update(adminUsers)
        .set({ role: "super_admin" })
        .where(eq(adminUsers.userId, userId));
      console.log("Updated existing admin role to super_admin");
    } else {
      // Create admin role
      await db.insert(adminUsers).values({
        userId,
        role: "super_admin",
      });
      console.log("Created super_admin role");
    }

    // Write credentials to file
    const outputDir = path.join(process.cwd(), ".seed-output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, "ADMIN_CREDENTIALS.txt");
    const content = `Super Admin Credentials
=====================
Email: ${email}
Password: ${password}

Please save these credentials securely and change the password after first login.
`;

    fs.writeFileSync(outputFile, content);
    console.log(`\nCredentials written to: ${outputFile}`);
    console.log("✓ Super admin seeded successfully!");

  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin().then(() => process.exit(0));