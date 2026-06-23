import { apiClient } from "@/lib/apiClient";
import {
  DayDetails,
  MonthlyCalendar,
  TodayCalendar,
  WeeklyCalendar,
} from "@/types";

export const calendarService = {
  getToday(): Promise<TodayCalendar> {
    return apiClient.get<TodayCalendar>("/calendar/today");
  },

  getMonthly(year: number, month: number): Promise<MonthlyCalendar> {
    return apiClient.get<MonthlyCalendar>(
      `/calendar?year=${year}&month=${month}`,
    );
  },

  getWeekly(): Promise<WeeklyCalendar> {
    return apiClient.get<WeeklyCalendar>("/calendar/week");
  },

  getDayDetails(date: string): Promise<DayDetails> {
    return apiClient.get<DayDetails>(`/calendar/${encodeURIComponent(date)}`);
  },
};
