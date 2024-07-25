import TimePicker from "@/app/components/TimePicker";
import {EventTypeModel} from "@/models/EventType";
import {ProfileModel} from "@/models/Profile";
import {Clock, Info} from "lucide-react";
import mongoose from "mongoose";

type PageProps = {
  params:{
    username:string;
    "booking-uri":string;
  };
};
export default async function BookingPage(props: PageProps) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const profileDoc = await ProfileModel.findOne({
    username: props.params.username,
  });
  if (!profileDoc) {
    return '404';
  }
  const etDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: props.params?.['booking-uri'],
  });
  if (!etDoc) {
    return '404';
  }
  return (
    <TimePicker
      username={props.params.username}
      meetingUri={etDoc.uri}
      length={etDoc.length}
      bookingTimes={JSON.parse(JSON.stringify(etDoc.bookingTimes))}
    />
  );
}