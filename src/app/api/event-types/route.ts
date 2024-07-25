import {session} from "@/libs/session";
import {EventTypeModel} from "@/models/EventType";
import mongoose from "mongoose";
import {revalidatePath} from "next/cache";
import {NextRequest} from "next/server";

function uriFromTitle(title: string): string {
  return title.toLowerCase().replaceAll(/[^a-z0-9]/g, '-');
}

export async function POST(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const data = await req.json();
  data.uri = uriFromTitle(data.title);
  const email = await session().get('email');
  if (email) {
    const eventTypeDoc = await EventTypeModel.create({email, ...data});
    revalidatePath('/dashboard/event-types');
    return Response.json(eventTypeDoc);
  }
  return Response.json(false);
}

export async function PUT(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const data = await req.json();
  data.uri = uriFromTitle(data.title);
  const email = await session().get('email');
  const id = data.id;
  if (email && id) {
    const eventTypeDoc = await EventTypeModel.updateOne(
      {email, _id: id},
      data,
    );
    revalidatePath('/dashboard/event-types');
    return Response.json(eventTypeDoc);
  }
  return Response.json(false);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  await mongoose.connect(process.env.MONGODB_URI as string);
  await EventTypeModel.deleteOne({_id: id});
  return Response.json(true);
}






