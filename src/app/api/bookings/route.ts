import {nylas} from "@/libs/nylas";
import {BookingModel} from "@/models/Booking";
import {EventTypeModel} from "@/models/EventType";
import {ProfileModel} from "@/models/Profile";
import {addMinutes} from "date-fns";
import mongoose from "mongoose";
import {NextRequest} from "next/server";
import {WhenType} from "nylas";

type JsonData = {
  guestName:string;
  guestEmail:string;
  guestNotes:string;
  username:string;
  bookingUri:string;
  bookingTime:string;
};

export async function POST(req: NextRequest) {
  const data:JsonData = await req.json();
  const {guestEmail, guestName, guestNotes, bookingTime} = data;
  await mongoose.connect(process.env.MONGODB_URI as string);
  const profileDoc = await ProfileModel.findOne({
    username: data.username,
  });
  if (!profileDoc) {
    return Response.json('invalid url', {status:404});
  }
  const etDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: data.bookingUri,
  });
  if (!etDoc) {
    return Response.json('invalid url', {status:404});
  }
  await BookingModel.create({
    guestName,
    guestNotes,
    guestEmail,
    when: bookingTime,
    eventTypeId: etDoc._id,
  });

  // create this event in calendar
  const grantId = profileDoc.grantId;
  const startDate = new Date(bookingTime)
  await nylas.events.create({
    identifier: grantId,
    requestBody: {
      title: etDoc.title,
      description: etDoc.description,
      when: {
        startTime: Math.round(startDate.getTime() / 1000),
        endTime: Math.round(addMinutes(startDate, etDoc.length).getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: 'Google Meet',
      },
      participants: [
        {
          name: guestName,
          email: guestEmail,
          status: 'yes',
        },
      ],
    },
    queryParams: {
      calendarId: etDoc.email,
    },
  });

  return Response.json(true, {status:201});
}