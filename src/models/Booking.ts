import mongoose, {model, models, Schema} from "mongoose";

interface IBooking extends mongoose.Document {
  guestName: string;
  guestEmail: string;
  guestNotes: string;
  when: Date;
  eventTypeId: string;
};

const BookingSchema = new Schema<IBooking>({
  guestName: String,
  guestEmail: String,
  guestNotes: String,
  when: Date,
  eventTypeId: String,
});

export const BookingModel = models?.Booking || model<IBooking>('Booking', BookingSchema);