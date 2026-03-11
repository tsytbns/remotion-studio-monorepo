export type CollectorsRouteEventTag = "AUCTION" | "TALK";

export type CollectorsRouteEvent = {
  time: string;
  title: string;
  venue: string;
  detail?: string;
  tag?: CollectorsRouteEventTag;
};

export type CollectorsRouteScheduleDay = {
  date: string;
  dateEn: string;
  events: CollectorsRouteEvent[];
};

export const collectorsRouteMapNote =
  "Satellite displays and pop-ups run alongside the auction weekend. Visit the marked venues and collect the stamps across Tokyo International Forum.";

export const collectorsRouteScheduleDays: CollectorsRouteScheduleDay[] = [
  {
    date: "3/12",
    dateEn: "Thursday, March 12",
    events: [
      {
        time: "11:00AM-7:00PM",
        title: "Modern Legacy Preview",
        venue: "Tokyo International Forum Hall D7",
      },
      {
        time: "11:00AM-7:00PM",
        title: "Bloom Now Preview",
        detail: "Selected works are also on view at Hall D7",
        venue: "Tokyo International Forum Hall D1",
      },
      {
        time: "11:00AM-7:00PM",
        title: "Jaume PLENSA, Tokyo's soul",
        detail: "Modern Legacy / Lot 025",
        venue: "Tokyo International Forum Lobby Gallery",
      },
      {
        time: "11:00AM-5:00PM",
        title: "Plaza Pop-up",
        detail: "No artworks exhibited. No stamp available.",
        venue: "Tokyo International Forum Plaza",
      },
    ],
  },
  {
    date: "3/13",
    dateEn: "Friday, March 13",
    events: [
      {
        time: "11:00AM-7:00PM",
        title: "Modern Legacy Preview",
        venue: "Tokyo International Forum Hall D7",
      },
      {
        time: "11:00AM-7:00PM",
        title: "Bloom Now Preview",
        detail: "Selected works are also on view at Hall D7",
        venue: "Tokyo International Forum Hall D1",
      },
      {
        time: "11:00AM-7:00PM",
        title: "Jaume PLENSA, Tokyo's soul",
        detail: "Modern Legacy / Lot 025",
        venue: "Tokyo International Forum Lobby Gallery",
      },
      {
        time: "11:00AM-5:00PM",
        title: "Plaza Pop-up",
        detail: "No artworks exhibited. No stamp available.",
        venue: "Tokyo International Forum Plaza",
      },
    ],
  },
  {
    date: "3/14",
    dateEn: "Saturday, March 14",
    events: [
      {
        time: "11:00AM-1:00PM",
        title: "Modern Legacy Preview",
        venue: "Tokyo International Forum Hall D7",
      },
      {
        time: "11:00AM-7:00PM",
        title: "Jaume PLENSA, Tokyo's soul",
        detail: "Modern Legacy / Lot 025",
        venue: "Tokyo International Forum Lobby Gallery",
      },
      {
        time: "11:00AM-12:00PM",
        title: "Talk Event about Léonard Tsuguharu FOUJITA",
        venue: "Tokyo International Forum Hall D5",
        tag: "TALK",
      },
      {
        time: "2:00PM-",
        title: "Modern Legacy Auction",
        venue: "Tokyo International Forum Hall D5",
        tag: "AUCTION",
      },
      {
        time: "1:00PM-5:00PM",
        title: "Plaza Pop-up",
        detail: "No artworks exhibited. No stamp available.",
        venue: "Tokyo International Forum Plaza",
      },
    ],
  },
  {
    date: "3/15",
    dateEn: "Sunday, March 15",
    events: [
      {
        time: "2:00PM-",
        title: "Bloom Now Auction",
        venue: "Tokyo International Forum Hall D5",
        tag: "AUCTION",
      },
      {
        time: "1:00PM-5:00PM",
        title: "Plaza Pop-up",
        detail: "No artworks exhibited. No stamp available.",
        venue: "Tokyo International Forum Plaza",
      },
    ],
  },
];
