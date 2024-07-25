import EventTypeForm from "@/app/components/EventTypeForm";
import {session} from "@/libs/session";
import {EventTypeModel} from "@/models/EventType";
import {ProfileModel} from "@/models/Profile";
import mongoose from "mongoose";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditEventTypePage({params}: PageProps) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = await session().get('email');
  const eventTypeDoc = await EventTypeModel.findOne({_id: params.id});
  const profileDoc = await ProfileModel.findOne({email});
  if (!eventTypeDoc) {
    return '404';
  }
  return (
    <div>
      <EventTypeForm
        username={profileDoc.username || ''}
        doc={JSON.parse(JSON.stringify(eventTypeDoc))} />
    </div>
  );
}