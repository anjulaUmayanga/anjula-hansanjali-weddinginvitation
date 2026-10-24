export const siteConfig = {
  projectName: "Anjula & Hansanjali Wedding",
  couple: {
    partnerOne: "Anjula",
    partnerTwo: "Hansanjali",
    displayNames: "Anjula & Hansanjali",
    initials: "A&H",
  },
  weddingDateISO: "2026-12-12T11:00:00+05:30",
  weddingDateLabel: "Saturday, 12 December 2026",
  parents: {
    groom: {
      side: "Groom's Parents",
      names: ["Mr. Sajith Premasiri", "Mrs. Seetha Malani"],
    },
    bride: {
      side: "Bride's Parents",
      names: ["Mr. Petric De Silva", "Mrs. Nelum "],
    },
  },
  venue: {
    name: "Ramadia Ranmal Holiday Resort",
    address: "Ramadia Ranmal Holiday Resort, Sri Lanka",
    mapsShareUrl: "https://maps.app.goo.gl/zXvLEeBmtvzQgHx36",
    mapQuery: "Ramadia Ranmal Holiday Resort",
    parkingNote:
      "Complimentary parking is available on site. Please follow signs for wedding guests.",
    hotelNote:
      "Limited rooms are available at the resort. Contact us early if you would like to stay overnight.",
  },
  
  schedule: [
    {
      id: "start",
      title: "Ceremony Begins",
      time: "11:00",
      timeLabel: "11:00 AM",
      description: "Guests are welcomed as the celebration begins at Ramadia Ranmal Holiday Resort.",
      icon: "sparkle" as const,
      emphasis: "primary" as const,
    },
    {
      id: "dinner",
      title: "Wedding Feast",
      time: "12:30",
      timeLabel: "12:30 PM",
      description: "Join us for a warm midday feast shared with family and friends.",
      icon: "dining" as const,
      emphasis: "secondary" as const,
    },
    {
      id: "end",
      title: "Celebration Ends",
      time: "16:00",
      timeLabel: "4:00 PM",
      description: "A final toast and fond farewell as we close this beautiful day together.",
      icon: "heart" as const,
      emphasis: "secondary" as const,
    },
  ],
  story: [
    {
      id: "met",
      title: "Where It All Began",
      date: "2019",
      body: "Between crowded lecture halls and late-night study sessions at university, two strangers crossed paths. One glance, one shy smile, and a conversation that carried on long after the class had ended. Neither of us knew it then, but our story had already begun.",
      photo: "/photos/howmet.jpeg",
    },
    {
      id: "dating",
      title: "Growing Together",
      date: "2020",
      body: "Campus walks turned into long talks, and coffee after class turned into a habit we never wanted to break. We shared our notes, our worries, and our biggest dreams, and slowly we became each other's closest friend and safest place.",
      photo: "/photos/grow.jpeg",
    },
    {
      id: "graduation",
      title: "Side by Side, Degrees in Hand",
      date: "2025",
      body: "Through exams, deadlines, and sleepless nights, we studied side by side and never let each other give up. When the day finally came, we walked across the stage together and earned our degrees as a team. Our first big dream came true, and it was even sweeter because we shared it.",
      photo: "/photos/sidebyside.jpeg",
    },
    {
      id: "proposal",
      title: "The Promise",
      date: "2025",
      body: "With our degrees behind us and a future ahead, one beautiful day brought a question and a quiet yes. We were engaged, surrounded by the people we love, and the next chapter of our lives was ready to begin.",
      photo: "/photos/promis.jpg",
    },
    {
      id: "today",
      title: "Our Forever",
      date: "2026",
      body: "From a university classroom to the day we say \"I do\", every step has led us here. With grateful hearts, we invite you to be part of the day our story becomes a vow.",
      photo: "/photos/ourforever.jpeg",
    },
  ],
  dressCode: {
    title: "Soft Maroon Elegance",
    description:
      "Ivory, blush, soft rose, and gentle maroon accents. Light fabrics, warm neutrals — elegant without heavy colour.",
    swatches: [
      { name: "Ivory", hex: "#FBF6F2" },
      { name: "Blush", hex: "#F0E0DC" },
      { name: "Rose Mist", hex: "#E8D0CC" },
      { name: "Soft Maroon", hex: "#C4A0A0" },
      { name: "Antique Gold", hex: "#B8923F" },
    ],
  },
  livestreamUrl: "https://youtube.com/live/example-wedding-stream",
  photos: {
    /** Hero / cover background */
    couple: "/photos/maincover.jpg",
    /**
     * Gallery — add more paths anytime.
     * Current: couple2 … couple5 (+ couple6 when you add the file).
     */
    gallery: [
      "/photos/couple2.jpg",
      "/photos/couple3.jpg",
      "/photos/couple4.jpg",
      "/photos/couple5.jpg",
      "/photos/couple6.jpeg",
      "/photos/couple7.jpeg",
    ] as string[],
  },
  welcomeMessage:
    "With joyful hearts we invite you to share in our wedding day — a celebration of love, family, and the beautiful journey ahead.",
  thankYouMessage:
    "Thank you for being part of our story. Your presence is the greatest gift of all.",
};

export type SiteConfig = typeof siteConfig;
export type ScheduleItem = (typeof siteConfig.schedule)[number];
export type StoryMilestone = (typeof siteConfig.story)[number];
