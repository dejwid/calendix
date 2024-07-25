"use client";
import {weekdaysNames, weekdaysShortNames} from "@/libs/shared";
import {BookingTimes, WeekdayName} from "@/libs/types";
import axios from "axios";
import {clsx} from "clsx";
import {
  addDays, addMinutes,
  addMonths, endOfDay,
  format,
  getDay, isAfter,
  isBefore,
  isEqual,
  isFuture,
  isLastDayOfMonth,
  isToday, startOfDay,
  subMonths
} from "date-fns";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Link from "next/link";
import {TimeSlot} from "nylas";
import {useEffect, useState} from "react";
import {BounceLoader, PulseLoader} from "react-spinners";

export default function TimePicker({
  bookingTimes,
  length,
  meetingUri,
  username,
}:{
  bookingTimes:BookingTimes
  length:number;
  meetingUri:string;
  username:string;
}) {
  const currentDate = new Date();
  const [activeMonthDate, setActiveMonthDate] = useState(currentDate);
  const [activeMonthIndex, setActiveMonthIndex] = useState(activeMonthDate.getMonth());
  const [activeYear, setActiveYear] = useState(activeMonthDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<null|Date>(null);
  const [busySlots, setBusySlots] = useState<TimeSlot[]>([]);
  const [busySlotsLoaded, setBusySlotsLoaded] = useState(false);

  useEffect(() => {
    if (selectedDay) {
      setBusySlots([]);
      setBusySlotsLoaded(false);
      const params = new URLSearchParams();
      params.set('username', username);
      params.set('from', startOfDay(selectedDay).toISOString());
      params.set('to', endOfDay(selectedDay).toISOString());
      axios
        .get(`/api/busy?`+params.toString())
        .then(response => {
          setBusySlots(response.data);
          setBusySlotsLoaded(true);
        });
    }
  }, [selectedDay]);

  function withinBusySlots(time: Date) {
    const bookingFrom = time;
    const bookingTo = addMinutes(new Date(time), length);

    for (let busySlot of busySlots) {
      const busyFrom = new Date(parseInt(busySlot.startTime) * 1000);
      const busyTo = new Date(parseInt(busySlot.endTime) * 1000);
      if (isAfter(bookingTo, busyFrom) && isBefore(bookingTo, busyTo)) {
        return true;
      }
      if (isAfter(bookingFrom, busyFrom) && isBefore(bookingFrom, busyTo)) {
        return true;
      }
      if (isEqual(bookingFrom, busyFrom)) {
        return true;
      }
      if (isEqual(bookingTo, busyTo)) {
        return true;
      }
    }

    return false;
  }

  const firstDayOfCurrentMonth = new Date(activeYear, activeMonthIndex, 1);
  const firstDayOfCurrentMonthWeekdayIndex = getDay(firstDayOfCurrentMonth);
  const emptyDaysCount = firstDayOfCurrentMonthWeekdayIndex === 0
    ? 6
    : firstDayOfCurrentMonthWeekdayIndex - 1;
  const emptyDaysArr = (new Array(emptyDaysCount)).fill('', 0, emptyDaysCount);
  const daysNumbers = [firstDayOfCurrentMonth];
  do {
    const lastAddedDay = daysNumbers[daysNumbers.length - 1];
    daysNumbers.push(addDays(lastAddedDay, 1));
  } while (!isLastDayOfMonth(daysNumbers[daysNumbers.length - 1]));

  let selectedDayConfig = null;
  const bookingHours = [];
  if (selectedDay) {
    const weekdayNameIndex = format(selectedDay, "EEEE").toLowerCase() as WeekdayName;
    selectedDayConfig = bookingTimes?.[weekdayNameIndex];
    if (selectedDayConfig) {
      const [hoursFrom,minutesFrom] = selectedDayConfig.from.split(':');
      const selectedDayFrom = new Date(selectedDay);
      selectedDayFrom.setHours(parseInt(hoursFrom));
      selectedDayFrom.setMinutes(parseInt(minutesFrom));
      const selectedDayTo = new Date(selectedDay);
      const [hoursTo,minutesTo] = selectedDayConfig.to.split(':');
      selectedDayTo.setHours(parseInt(hoursTo));
      selectedDayTo.setMinutes(parseInt(minutesTo));
      let a = selectedDayFrom;
      do {
        if (!withinBusySlots(a)) {
          bookingHours.push(a);
        }
        a = addMinutes(a, 30);
      } while(isBefore(addMinutes(a, length), selectedDayTo));
    }
  }

  function prevMonth() {
    setActiveMonthDate(prev => {
      const newActiveMonthDate = subMonths(prev, 1);
      setActiveMonthIndex(newActiveMonthDate.getMonth());
      setActiveYear(newActiveMonthDate.getFullYear());
      return newActiveMonthDate;
    });
  }

  function nextMonth() {
    setActiveMonthDate(prev => {
      const newActiveMonthDate = addMonths(prev, 1);
      setActiveMonthIndex(newActiveMonthDate.getMonth());
      setActiveYear(newActiveMonthDate.getFullYear());
      return newActiveMonthDate;
    });
  }

  function handleDayClick(day:Date) {
    setSelectedDay(day);
  }


  return (
    <div className="flex">
      <div className="p-8">
        <div className="flex items-center">
          <span className="grow">
            {format(new Date(activeYear, activeMonthIndex, 1), "MMMM")} {activeYear}
          </span>
          <button onClick={prevMonth}>
            <ChevronLeft/>
          </button>
          <button onClick={nextMonth}>
            <ChevronRight/>
          </button>
        </div>
        <div className="inline-grid gap-2 grid-cols-7 mt-2">
          {weekdaysShortNames.map((weekdayShortName) => (
            <div
              key={weekdayShortName}
              className="text-center uppercase text-sm text-gray-500 font-bold">
              {weekdayShortName}
            </div>
          ))}
          {emptyDaysArr.map((empty, emptyIndex) => (
            <div key={emptyIndex} />
          ))}
          {daysNumbers.map(n => {
            const weekdayNameIndex = format(n, "EEEE").toLowerCase() as WeekdayName;
            const weekdayConfig = bookingTimes?.[weekdayNameIndex];
            const isActiveInBookingTimes = weekdayConfig?.active;
            const canBeBooked = isFuture(n) && isActiveInBookingTimes;
            const isSelected = selectedDay && isEqual(n, selectedDay);
            return (
              <div
                key={n.toISOString()}
                className="text-center text-sm text-gray-400 font-bold ">
                <button
                  disabled={!canBeBooked}
                  onClick={() => handleDayClick(n)}
                  className={clsx(
                    "w-8 h-8 rounded-full inline-flex items-center justify-center",
                    canBeBooked && !isSelected ? "bg-blue-100 text-blue-700" : "",
                    isToday(n) && !isSelected ? "bg-gray-200 text-gray-500" : '',
                    isSelected ? "bg-blue-500 text-white" : "",
                  )}
                >
                  {format(n, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {selectedDay && (
        <div className="pt-8 pl-2 overflow-auto pr-8 w-48">
          <p className="text-left text-sm">
            {format(selectedDay, "EEEE, MMMM d")}
          </p>
          <div className="grid gap-2 mt-2 max-h-52 ">
            {!busySlotsLoaded && (
              <div className="flex justify-center py-4">
                <PulseLoader color="#3B82F6" />
              </div>
            )}
            {busySlotsLoaded && bookingHours.map(bookingTime => (
              <div key={bookingTime.toISOString()}>
                <Link
                  href={`/${username}/${meetingUri}/${bookingTime.toISOString()}`}
                  className="w-full block border-2 rounded-lg border-blue-600 text-blue-600 font-semibold">
                  {format(bookingTime, 'HH:mm')}
                </Link>
              </div>
            ))}
            <div className="mb-8">&nbsp;</div>
          </div>
        </div>
      )}
    </div>
  );
}