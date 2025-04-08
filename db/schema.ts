import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";

export const tutorSessionsTable = pgTable("tutor_sessions", {
  sessionId: varchar("session_id", { length: 36 }).primaryKey(),
  participantName: varchar("participant_name", { length: 255 }).notNull(),
  participantEmail: varchar("participant_email", { length: 255 }).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 36 })
    .references(() => tutorSessionsTable.sessionId, {
      onDelete: "cascade",
    })
    .notNull(),
  pageNumber: integer("page_number").notNull(),
  imageTitle: varchar("image_title", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userActionLogsTable = pgTable("user_action_logs", {
  id: serial("id").primaryKey(),
  ipAddr: varchar("ip_addr", { length: 45 }),
  userAgent: text("user_agent"),
  participantName: varchar("participant_name", { length: 255 }).notNull(),
  participantEmail: varchar("participant_email", { length: 255 }).notNull(),
  sessionId: varchar("session_id", { length: 36 })
    .references(() => tutorSessionsTable.sessionId, {
      onDelete: "cascade",
    })
    .notNull(),
  pageTitle: varchar("page_title", { length: 255 }).notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("timestamp").defaultNow(),
});
