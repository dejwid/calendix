export type FromTo = {
  from: string;
  to: string;
  active: boolean;
};

export type WeekdayName = 'monday' | 'tuesday'
  | 'wednesday' | 'thursday' | 'friday'
  | 'saturday' | 'sunday';

export type BookingTimes = {
  monday?: FromTo;
  tuesday?: FromTo;
  wednesday?: FromTo;
  thursday?: FromTo;
  friday?: FromTo;
  saturday?: FromTo;
  sunday?: FromTo;
};