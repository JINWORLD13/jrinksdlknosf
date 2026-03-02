import { useTranslation } from 'react-i18next';
import * as tarotData from '../tarot/data/tarotData.js';

// 코스모스 + 타로 + 신비감: 퍼플/마젠타/골드/블루 네온 팔레트
const dailyColors = ['#a78bfa', '#e879f9'];
const weeklyColors = ['#8b5cf6', '#c084fc']; // 이번주 마이너: c084fc
const monthlyColors = ['#7c3aed', '#a78bfa']; // 이번달 마이너: a78bfa
const totalColors = ['#6366f1', '#38bdf8'];

export const colors = [totalColors, monthlyColors, weeklyColors, dailyColors];

export const minorColors = ['#38bdf8', '#a78bfa', '#e879f9', '#fbbf24'];
// '#FFBB28'

const TotalMajorToMinorData = (tarotHistory, date, browserLanguage) => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-major-total`),
      value: tarotData.TotalMajorCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-minor-total`),
      value: tarotData.TotalMinorCount(tarotHistory, date, browserLanguage),
    },
  ];
};
const MonthlyMajorToMinorData = (tarotHistory, date, browserLanguage) => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-major-this-month`),
      value: tarotData.MonthlyMajorCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-minor-this-month`),
      value: tarotData.MonthlyMinorCount(tarotHistory, date, browserLanguage),
    },
  ];
};
const WeeklyMajorToMinorData = (tarotHistory, date, browserLanguage) => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-major-this-week`),
      value: tarotData.WeeklyMajorCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-minor-this-week`),
      value: tarotData.WeeklyMinorCount(tarotHistory, date, browserLanguage),
    },
  ];
};
const DailyMajorToMinorData = (tarotHistory, date, browserLanguage) => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-major-today`),
      value: tarotData.DailyMajorCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-minor-today`),
      value: tarotData.DailyMinorCount(tarotHistory, date, browserLanguage),
    },
  ];
};

export const allPeriodMajorToMinorData = (
  tarotHistory,
  date,
  browserLanguage
) => {
  return [
    TotalMajorToMinorData(tarotHistory, date, browserLanguage),
    MonthlyMajorToMinorData(tarotHistory, date, browserLanguage),
    WeeklyMajorToMinorData(tarotHistory, date, browserLanguage),
    DailyMajorToMinorData(tarotHistory, date, browserLanguage),
  ];
};

const TotalMinorData = (tarotHistory, date, browserLanguage) => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-cups-total`),
      value: tarotData.TotalCupsCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-swords-total`),
      value: tarotData.TotalSwordsCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-wands-total`),
      value: tarotData.TotalWandsCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-pentacles-total`),
      value: tarotData.TotalPentaclesCount(tarotHistory, date, browserLanguage),
    },
  ];
};
const MonthlyMinorData = tarotHistory => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-cups-this-month`),
      value: tarotData.MonthlyCupsCount(tarotHistory),
    },
    {
      name: t(`mypage.chart-swords-this-month`),
      value: tarotData.MonthlySwordsCount(tarotHistory),
    },
    {
      name: t(`mypage.chart-wands-this-month`),
      value: tarotData.MonthlyWandsCount(tarotHistory),
    },
    {
      name: t(`mypage.chart-pentacles-this-month`),
      value: tarotData.MonthlyPentaclesCount(tarotHistory),
    },
  ];
};
const WeeklyMinorData = tarotHistory => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-cups-this-week`),
      value: tarotData.WeeklyCupsCount(tarotHistory),
    },
    {
      name: t(`mypage.chart-swords-this-week`),
      value: tarotData.WeeklySwordsCount(tarotHistory),
    },
    {
      name: t(`mypage.chart-wands-this-week`),
      value: tarotData.WeeklyWandsCount(tarotHistory),
    },
    {
      name: t(`mypage.chart-pentacles-this-week`),
      value: tarotData.WeeklyPentaclesCount(tarotHistory),
    },
  ];
};
const DailyMinorData = (tarotHistory, date, browserLanguage) => {
  const { t } = useTranslation();
  return [
    {
      name: t(`mypage.chart-cups-today`),
      value: tarotData.DailyCupsCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-swords-today`),
      value: tarotData.DailySwordsCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-wands-today`),
      value: tarotData.DailyWandsCount(tarotHistory, date, browserLanguage),
    },
    {
      name: t(`mypage.chart-pentacles-today`),
      value: tarotData.DailyPentaclesCount(tarotHistory, date, browserLanguage),
    },
  ];
};

export const allPeriodMinorCardData = (tarotHistory, date, browserLanguage) => {
  return [
    TotalMinorData(tarotHistory, date, browserLanguage),
    MonthlyMinorData(tarotHistory),
    WeeklyMinorData(tarotHistory),
    DailyMinorData(tarotHistory, date, browserLanguage),
  ];
};
