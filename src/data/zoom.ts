import { db } from "@/db/client";
import { zoomMeetings, zoomAttendees } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

export async function getUserMeetings(userId: string) {
  const result = await db
    .select({
      id: zoomMeetings.id,
      topic: zoomMeetings.topic,
      joinUrl: zoomMeetings.joinUrl,
      startsAt: zoomMeetings.startsAt
    })
    .from(zoomAttendees)
    .innerJoin(zoomMeetings, eq(zoomAttendees.meetingId, zoomMeetings.id))
    .where(eq(zoomAttendees.userId, userId));
  
  return result;
}

export async function getUpcomingMeetingsCount() {
  const result = await db
    .select()
    .from(zoomMeetings)
    .where(gt(zoomMeetings.startsAt, new Date()));
  
  return result.length;
}