"use client";

import { useQuery } from "@tanstack/react-query";

import { calendarService } from "@/services/calendarService";

export function useTodayCalendar() {
  return useQuery({
    queryKey: ["calendar", "today"],
    queryFn: () => calendarService.getToday(),
  });
}

export function useMonthlyCalendar(year: number, month: number) {
  return useQuery({
    queryKey: ["calendar", "monthly", year, month],
    queryFn: () => calendarService.getMonthly(year, month),
  });
}

export function useWeeklyCalendar() {
  return useQuery({
    queryKey: ["calendar", "weekly"],
    queryFn: () => calendarService.getWeekly(),
  });
}

export function useDayDetails(date: string) {
  return useQuery({
    queryKey: ["calendar", "day", date],
    queryFn: () => calendarService.getDayDetails(date),
    enabled: date.length > 0,
  });
}
