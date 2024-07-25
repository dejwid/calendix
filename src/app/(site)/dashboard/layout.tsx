import DashboardNav from "@/app/components/DashboardNav";
import {session} from "@/libs/session";
import {ProfileModel} from "@/models/Profile";
import mongoose from "mongoose";
import {ReactNode} from "react";

export default async function DashboardLayout({children}:{children:ReactNode}) {
  const email = await session().get('email');
  if (!email) {
    return 'not logged in';
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
  const profileDoc = await ProfileModel.findOne({email});
  return (
    <div>
      <DashboardNav username={profileDoc?.username || ''} />
      {children}
    </div>
  );
}