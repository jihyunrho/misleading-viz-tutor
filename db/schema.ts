import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";

export const tutorSessionsTable = pgTable("tutor_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(), // sessionId
  participantName: varchar("participant_name", { length: 255 }).notNull(),
  participantEmail: varchar("participant_email", { length: 255 }).notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  currentPageNumber: integer("current_page_number").default(0),
});

export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 36 })
    .references(() => tutorSessionsTable.id)
    .notNull(),
  pageNumber: integer("page_number").notNull(),
  imageTitle: varchar("image_title", { length: 255 }).notNull(),
  imagePath: varchar("image_src", { length: 255 }).notNull(),
  lastInstruction: text("last_instruction").notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at"),
});

export const userLogsTable = pgTable("user_logs", {
  id: serial("id").primaryKey(),
  userIpAddr: varchar("user_ip_addr", { length: 45 }).notNull(),
  userAgent: text("user_agent").notNull(),
  sessionId: varchar("session_id", { length: 36 })
    .references(() => tutorSessionsTable.id)
    .notNull(),
  pageNumber: integer("page_number").notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("timestamp"),
});
