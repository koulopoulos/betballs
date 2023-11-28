export type FootballTeamResponse = {
  team: {
    id: string;
    uid: string;
    slug: string;
    location: string;
    name: string;
    nickname: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    isActive: boolean;
  };
};

export type NFLScoreboardEvent = {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  competitions: [
    {
      competitors: [
        {
          homeAway: 'home' | 'away';
          team: {
            id: string;
            uid: string;
            location: string;
            name: string;
            abbreviation: string;
            displayName: string;
            color: string;
            shortDisplayName: string;
            logo: string;
          };
          records: [
            {
              name: string;
              summary: string;
            },
          ];
        },
      ];
    },
  ];
};

export type NFLScoreboard = {
  leagues: [];
  season: {};
  week: {};
  events: NFLScoreboardEvent[];
};

export type SearchOutletContext = {
  events: NFLScoreboardEvent[];
  setEvents: React.Dispatch<any>;
};
