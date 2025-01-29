import { Timestamp } from "firebase/firestore";

export const appConfig = {
  name: "INDUSTRY DAY 2024",
  owner: 'Faculty of Science',
  shortName: "ID24",
  description: "Queue Management Portal",
  queues: {
    baseTime: Timestamp.fromDate(new Date("2024-08-08T10:00:00+05:30")),
  },
};
