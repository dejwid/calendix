'use server'
import DashboardNav from "@/app/components/DashboardNav";
import {session} from "@/libs/session";
import {EventTypeModel} from "@/models/EventType";
import {ProfileModel} from "@/models/Profile";
import {Plus} from "lucide-react";
import mongoose from "mongoose";
import Link from "next/link";

export default async function EventTypesPage() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = await session().get('email');
  const eventTypes = await EventTypeModel.find({email});
  const profile = await ProfileModel.findOne({email});
  return (
    <div>
      <div className="mt-4 border border-b-0 rounded-xl overflow-hidden mb-4">
        {eventTypes.map(et => (
          <div
            key={et.id}
            className="block p-2 border-b">
            <Link href={'/dashboard/event-types/edit/'+et.id}>
              {et.title}
            </Link>
            <span className="text-gray-400 ml-4 text-sm">
              {process.env.NEXT_PUBLIC_URL}/{profile.username}/{et.uri}
            </span>
          </div>
        ))}
      </div>
      <Link className="btn-gray"
            href="/dashboard/event-types/new">
        <Plus size={16} />
        New event type
      </Link>
    </div>
  );
}