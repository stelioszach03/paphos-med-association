import {
  pgTable, serial, text, timestamp, uuid, integer, primaryKey
} from "drizzle-orm/pg-core";

/** Lucia auth (email/password) */
export const users = pgTable("users", {
  id: text("id").primaryKey(),           // Lucia user id (string)
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password"),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull()
});

/** Admins & content */
export const adminUsers = pgTable("admin_users", {
  userId: text("user_id").primaryKey(),                  // FK to users.id
  role: text("role").notNull(),                          // 'admin' | 'super_admin'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title"),
  slug: text("slug").unique(),
  summary: text("summary"),
  content: text("content"),
  lang: text("lang").default("el"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  createdBy: text("created_by"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title"),
  slug: text("slug").unique(),
  summary: text("summary"),
  content: text("content"),
  lang: text("lang").default("el"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  createdBy: text("created_by"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title"),
  slug: text("slug").unique(),
  description: text("description"),
  location: text("location"),
  startAt: timestamp("start_at", { withTimezone: true }),
  endAt: timestamp("end_at", { withTimezone: true }),
  lang: text("lang").default("el"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  registryNo: text("registry_no"),
  notes: text("notes"),
  status: text("status").default("submitted"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const doctors = pgTable("doctors", {
  id: text("id").primaryKey(), // link to users.id
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  registryNo: text("registry_no"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const walletPasses = pgTable("wallet_passes", {
  userId: text("user_id").notNull(),
  platform: text("platform").notNull(), // 'apple' | 'google'
  status: text("status").default("issued"), // 'issued'|'revoked'|'error'
  token: text("token"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow()
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.platform] }) }));

export const zoomMeetings = pgTable("zoom_meetings", {
  id: text("id").primaryKey(),
  topic: text("topic").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  durationMinutes: integer("duration_minutes"),
  joinUrl: text("join_url"),
  hostUrl: text("host_url"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const zoomAttendees = pgTable("zoom_attendees", {
  meetingId: text("meeting_id").notNull(),
  userId: text("user_id").notNull()
}, (t) => ({ pk: primaryKey({ columns: [t.meetingId, t.userId] }) }));

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  subject: text("subject"),
  from: text("from"),
  to: text("to"),
  snippet: text("snippet"),
  html: text("html"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  at: timestamp("at", { withTimezone: true }).defaultNow(),
  actor: text("actor"),
  action: text("action"),
  entity: text("entity"),
  entityId: text("entity_id"),
  meta: text("meta")
});