import bcrypt from "bcryptjs";
import { AdminUser } from "../schemas/admin.schema";

export async function ensureSeedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    console.warn(
      "Admin bootstrap skipped: ADMIN_EMAIL and ADMIN_PASSWORD are not set.",
    );
    return;
  }

  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const firstName = process.env.ADMIN_FIRST_NAME?.trim() || "Lessora";
  const lastName = process.env.ADMIN_LAST_NAME?.trim() || "Admin";

  if (existingAdmin) {
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.firstName = firstName;
    existingAdmin.lastName = lastName;
    existingAdmin.isActive = true;
    await existingAdmin.save();
    console.log(`Admin bootstrap updated for ${adminEmail}`);
    return;
  }

  await AdminUser.create({
    email: adminEmail,
    username: adminEmail.split("@")[0],
    passwordHash,
    firstName,
    lastName,
    role: "admin",
  });

  console.log(`Admin bootstrap created for ${adminEmail}`);
}
