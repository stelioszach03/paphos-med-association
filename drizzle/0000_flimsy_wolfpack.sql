CREATE TABLE "admin_users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"slug" text,
	"summary" text,
	"content" text,
	"lang" text DEFAULT 'el',
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "announcements_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"full_name" text,
	"email" text,
	"phone" text,
	"registry_no" text,
	"notes" text,
	"status" text DEFAULT 'submitted',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"slug" text,
	"summary" text,
	"content" text,
	"lang" text DEFAULT 'el',
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now(),
	"actor" text,
	"action" text,
	"entity" text,
	"entity_id" text,
	"meta" text
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text,
	"email" text,
	"phone" text,
	"registry_no" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" text,
	"from" text,
	"to" text,
	"snippet" text,
	"html" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"slug" text,
	"description" text,
	"location" text,
	"start_at" timestamp with time zone,
	"end_at" timestamp with time zone,
	"lang" text DEFAULT 'el',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text,
	"full_name" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallet_passes" (
	"user_id" text NOT NULL,
	"platform" text NOT NULL,
	"status" text DEFAULT 'issued',
	"token" text,
	"issued_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "wallet_passes_user_id_platform_pk" PRIMARY KEY("user_id","platform")
);
--> statement-breakpoint
CREATE TABLE "zoom_attendees" (
	"meeting_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "zoom_attendees_meeting_id_user_id_pk" PRIMARY KEY("meeting_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "zoom_meetings" (
	"id" text PRIMARY KEY NOT NULL,
	"topic" text NOT NULL,
	"starts_at" timestamp with time zone,
	"duration_minutes" integer,
	"join_url" text,
	"host_url" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now()
);
