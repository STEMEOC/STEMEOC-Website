/**
 * Extra content for program pages that the Program table has no fields for:
 * hero copy, stats, competition categories, photos and each edition of the
 * event. Keyed by program slug. Programs without an entry get the page built
 * from their table row alone.
 *
 * Event facts come from STEMEOC's website and Facebook page and from press
 * coverage (Khmer Times, Phnom Penh Post, ICIA, NEP, AUPPHS-FA).
 */

export type CategoryIcon = "tug" | "sumo" | "soccer" | "innovator" | "engineer" | "mission";

export type ProgramCategory = {
  name: string;
  description: string;
  icon: CategoryIcon;
  /** Optional photo; the card shows the icon panel without one. */
  image?: string;
  fee?: string;
  learnMoreUrl?: string;
  registerUrl?: string;
};

export type Stat = { value: string; label: string };
/** `contain` shows the whole image (posters, logos) instead of cropping it. */
export type Photo = { src: string; alt: string; contain?: boolean };

export type WinnerTeam = {
  /** Team or project name. */
  name?: string;
  members?: string[];
  school?: string;
  country?: string;
  /** e.g. "1st place". Only set when the organizers published a ranking. */
  place?: string;
  /** Photo of the team, e.g. on stage with their certificates. Only use a
   *  photo confirmed to show this team. */
  photo?: string;
  /** A portrait for each student, keyed by their name exactly as written in
   *  `members`, e.g. { "HENG Bunkheang": "/uploads/winners/cro-2025/heng-bunkheang.jpg" }.
   *  Students without one show their initials. */
  portraits?: Record<string, string>;
};

export type WinnerGroup = {
  category: string;
  /** Age division, e.g. "Senior". */
  division?: string;
  teams: WinnerTeam[];
};

export type Winners = {
  intro?: string;
  groups: WinnerGroup[];
  /** Award-ceremony photos. */
  photos?: Photo[];
};

/** One edition of a program (CRO 2025, the 18th STEM Festival...). Each gets
 *  its own page at /projects/[program]/[event]. */
export type ProgramEvent = {
  slug: string;
  /** Short label for the card badge, e.g. "2026". */
  year: string;
  /** Display date, e.g. "7 February 2026". */
  date: string;
  title: string;
  venue?: string;
  /** One or two sentences, used on the card and in the page hero. */
  summary: string;
  /** Longer write-up for the event page. */
  body?: string[];
  highlights?: string[];
  stats?: Stat[];
  image?: string;
  /** The image is a poster or logo: show all of it rather than crop. */
  imageContain?: boolean;
  photos?: Photo[];
  /** Show the program's competition categories (with Register buttons). */
  showCategories?: boolean;
  winners?: Winners;
};

export type ProgramPage = {
  heroTitle?: string;
  summary: string;
  whatIsTitle: string;
  whatIs: string;
  overviewImage: string;
  stats: Stat[];
  preRegisterUrl?: string;
  sections: { title: string; intro: string; categories: ProgramCategory[] }[];
  photos: Photo[];
  /** Newest first. */
  events?: ProgramEvent[];
};

const CRO_2026 = "/projects/cambodia-robotics-olympiad/2026";
const WRO_REGISTER = "https://docs.google.com/forms/d/1eba2fA6SbAQKyoO2dmh4vn0II3NeloFzI7bKcOOFaJg/viewform";

export const PROGRAM_PAGES: Record<string, ProgramPage> = {
  "cambodia-robotics-olympiad": {
    heroTitle: "Cambodia Robotics Olympiad",
    summary:
      "The Cambodian Robotics Olympiad, proudly organized by STEMEOC, is a prestigious national competition that inspires students to push the boundaries of creativity and innovation in robotics.",
    whatIsTitle: "What is CRO?",
    whatIs:
      "The Cambodian Robotics Olympiad, proudly organized by STEMEOC, is a prestigious national competition that inspires students to push the boundaries of creativity and innovation in robotics. Participants are challenged to design, build, and program robots to solve real-world problems, offering them a unique platform to showcase their talents and skills. This exciting event features five diverse categories: RoboMission, Future Innovators, Future Engineers, Robot Sumo, and Robot Tug of War, ensuring a variety of challenges that cater to different interests and skill levels.",
    overviewImage: "/uploads/CRO-4-scaled.jpg",
    // From the CRO event recap: "over 900 visitors, including more than 200
    // students competing across the five categories".
    stats: [
      { value: "200+", label: "Students competing" },
      { value: "900+", label: "Visitors" },
      { value: "5", label: "Categories" },
    ],
    preRegisterUrl: "#programs",
    sections: [
      {
        title: "CRO Programs",
        intro:
          "National categories run by STEMEOC for Cambodian students. Teams design, build and drive their own robots in head-to-head matches.",
        categories: [
          {
            name: "Robot Tug of War",
            description: "Two robots, one rope. Build for grip, torque and balance to out-pull the other team.",
            icon: "tug",
            fee: "$15 / team",
            learnMoreUrl: CRO_2026,
            registerUrl: "https://forms.gle/6fsMzwqpRxNRz1JQ7",
          },
          {
            name: "Robot Sumo Challenge",
            description: "Push your opponent out of the ring with a robot built for power and control.",
            icon: "sumo",
            image: "/uploads/categories/robot-sumo.jpg",
            fee: "$15 / team",
            learnMoreUrl: CRO_2026,
            registerUrl: "https://forms.gle/keA1m9M2AsVSaZnJ9",
          },
          {
            name: "Robot Soccer",
            description: "Robots take the pitch. Teams program strategy and teamwork to score goals.",
            icon: "soccer",
            image: "/uploads/categories/robot-soccer.jpg",
            learnMoreUrl: CRO_2026,
          },
        ],
      },
      {
        title: "WRO Programs",
        intro:
          "The international World Robot Olympiad categories. Top teams earn the chance to represent Cambodia at the WRO international final.",
        categories: [
          {
            name: "Future Innovators",
            description: "Design and build a robotics project that answers the season's theme.",
            icon: "innovator",
            fee: "$30 / team",
            learnMoreUrl: CRO_2026,
            registerUrl: WRO_REGISTER,
          },
          {
            name: "Future Engineers",
            description: "Engineer an autonomous self-driving vehicle that races a changing track.",
            icon: "engineer",
            image: "/uploads/categories/future-engineers.jpg",
            fee: "$30 / team",
            learnMoreUrl: CRO_2026,
            registerUrl: WRO_REGISTER,
          },
          {
            name: "RoboMission",
            description: "Build and program a robot to complete missions on a themed game field.",
            icon: "mission",
            image: "/uploads/categories/robomission.jpg",
            fee: "$30 / team",
            learnMoreUrl: CRO_2026,
            registerUrl: WRO_REGISTER,
          },
        ],
      },
    ],
    photos: [
      { src: "/uploads/CRO-4-scaled.jpg", alt: "Guests on stage at the Cambodia Robotics Olympiad 2024" },
      { src: "/uploads/STEM-Group.jpg", alt: "Students and organizers at the Cambodia Robotics Olympiad 2024" },
      {
        src: "/uploads/707646851_1405230371650624_3445541354606307499_n.jpg",
        alt: "Cambodia Robotics Olympiad 2026 poster: Robots Meet Culture",
        contain: true,
      },
      { src: "/uploads/Announcement-scaled.png", alt: "Cambodia Robotics Olympiad 2025 poster: The Future of Robots", contain: true },
      { src: "/uploads/Workshop-1-scaled.png", alt: "CRO 2025 virtual robotics workshop: Introduction to WRO games", contain: true },
      { src: "/uploads/photo_6160988771046853618_y.jpg", alt: "Team Cambodia with the national flag at the World Robot Olympiad" },
    ],
    events: [
      {
        slug: "2026",
        year: "2026",
        date: "5 September 2026",
        title: "Cambodia Robotics Olympiad 2026",
        venue: "AEON Mall Mean Chey, AEON Hall (1st floor)",
        summary:
          "Road to WRO 2026: the national round for the 2026 season, themed \"Robots Meet Culture\". Winners represent Cambodia at the World Robot Olympiad 2026.",
        body: [
          "The 2026 World Robot Olympiad season asks teams how robots can help shape, protect and grow art and culture. At CRO 2026, Cambodian students put that theme to work across the national CRO categories and the international WRO categories.",
          "The competition ran from 8:00 AM to 2:00 PM at AEON Hall on the first floor of AEON Mall Mean Chey, with free entry for teachers, parents, students and the public.",
        ],
        highlights: [
          "Theme: Robots Meet Culture",
          "8:00 AM – 2:00 PM, free entry",
          "CRO categories: Robot Tug of War, Robot Sumo, Robot Soccer",
          "WRO categories: Future Innovators, Future Engineers, RoboMission",
          "Winners represent Cambodia at WRO 2026",
        ],
        image: "/uploads/707646851_1405230371650624_3445541354606307499_n.jpg",
        imageContain: true,
        photos: [
          {
            src: "/uploads/707646851_1405230371650624_3445541354606307499_n.jpg",
            alt: "Cambodia Robotics Olympiad 2026 poster: Robots Meet Culture",
            contain: true,
          },
          // Photos from STEMEOC's "Congratulations, Champions!" Facebook post (story 1498164072357253).
          { src: "/uploads/events/cro-2026/stage-1.jpg", alt: "Winners lined up on the CRO 2026 stage in front of the Robots Meet Culture backdrop" },
          { src: "/uploads/events/cro-2026/stage-2.jpg", alt: "Award ceremony on the CRO 2026 stage at AEON Hall" },
          { src: "/uploads/events/cro-2026/stage-3.jpg", alt: "A winning team with their certificates on the CRO 2026 stage" },
        ],
        showCategories: true,
        winners: {
          intro:
            "The top three teams in every category and division at CRO 2026. The WRO-category winners go on to represent Cambodia at the World Robot Olympiad 2026.",
          // The award-ceremony photos from the same Facebook post, one per winning team on stage.
          photos: Array.from({ length: 31 }, (_, i) => ({
            src: `/uploads/events/cro-2026/${String(i + 1).padStart(2, "0")}.jpg`,
            alt: "Winning students with their certificates on stage at CRO 2026",
          })),
          groups: [
            {
              category: "Robot Tug of War",
              division: "Senior",
              teams: [
                { name: "FUNAN WORRIES", place: "1st place", school: "New Gat Way International School", members: ["Thav Ban Oudom", "Chhoun Ketya"] },
                { name: "Hunter", place: "2nd place", school: "U.S.A.I.S.R.T.C", members: ["Kosal Panha", "Chea Sambath"] },
                { name: "Flying Dragon", place: "3rd place", school: "U.S.A.I.S.R.T.C", members: ["Lay Cheapav", "Try Hengsamnang"] },
              ],
            },
            {
              category: "Robot Tug of War",
              division: "Junior",
              teams: [
                { name: "KB JDM", place: "1st place", school: "U.S.A.I.S.R.T.C", members: ["Cheang Nakhim", "Vy Sereyboth"] },
                { name: "LAPEACE", place: "2nd place", school: "Dewey International School – Banteay Meanchey", members: ["Hin Vicheka", "Taing Venghong"] },
                { name: "CyborgV14", place: "3rd place", school: "Dewey International School – Banteay Meanchey", members: ["Theng Channthonarak", "Thong Chanvinlong"] },
              ],
            },
            {
              category: "Robot Sumo",
              division: "Manual Senior",
              teams: [
                { name: "John Sumo", place: "1st place", school: "U.S.A.I.S.R.T.C", members: ["Pel Chetra", "Peou Pichvireakboth"] },
                { name: "Champion Calling", place: "2nd place", school: "Happy Chandara School", members: ["Tharn Channdy", "Nam Raksa"] },
                { name: "Sumo Nova", place: "3rd place", school: "Happy Chandara School", members: ["Choun Zana", "Pho Khemary"] },
              ],
            },
            {
              category: "Robot Sumo",
              division: "Manual Junior",
              teams: [
                { name: "SSE sumo titans", place: "1st place", school: "Super Student Education Cambodian School", members: ["Vong KeangAnn", "Khun Bunmeng"] },
                { name: "June Engine", place: "2nd place", school: "Paragon International School", members: ["Yu Hao", "Aliyeva Rabia"] },
                { name: "GOLDEN TITAN ATTACK", place: "3rd place", school: "Super Student Education Cambodian School", members: ["Sieng Chunhung", "Born Vila"] },
              ],
            },
            {
              category: "Robot Sumo",
              division: "Auto Senior",
              teams: [
                { name: "Seksaa Tech 03", place: "1st place", school: "Seksaa Tech Academy", members: ["Chanrathanak Horn", "Sopanha HORN"] },
                { name: "HANUMAN", place: "2nd place", members: ["Chhun Chandara", "Khy Liseam"] },
                { name: "Cute_Puppy_is_Back", place: "3rd place", school: "Dewey International School – Banteay Meanchey", members: ["Sot Peseth", "Tann Seang Hong"] },
              ],
            },
            {
              category: "Robot Sumo",
              division: "Auto Junior",
              teams: [
                { name: "Titanpush", place: "1st place", school: "Seksaa Tech Academy", members: ["Wenxing LEAP", "SoVichet LIM"] },
                { name: "The Strongest", place: "2nd place", school: "Seksaa Tech Academy", members: ["Sokseriputhisak CHHORN", "Virakcheat Sar"] },
                { name: "Seksaa Tech 02", place: "3rd place", school: "Seksaa Tech Academy", members: ["Norakvithia PHEAV", "Panhareach LAY"] },
              ],
            },
            {
              category: "Future Engineers",
              teams: [
                { name: "IriSight", place: "1st place", school: "American University of Phnom Penh", members: ["Ponlork Ponita", "Taing Muyleang", "Luy Kimchour"] },
                { name: "Bubblegum", place: "2nd place", school: "Northbridge International School Cambodia", members: ["Wu Zhihao", "Tieng Visott", "Ye Zeyu (Justin)"] },
                { name: "Compass", place: "3rd place", school: "American University of Phnom Penh", members: ["Yeong Vechakasy Sothon", "Be Naro", "Art Oudom"] },
              ],
            },
            {
              category: "RoboMission",
              division: "Senior",
              teams: [
                { name: "Titanicans", place: "1st place", members: ["Koeum Sokoan", "Run Sreytoich"] },
                { name: "Infin8ty", place: "2nd place", school: "Jay Pritzker Academy", members: ["Mann Mali", "San Soputhi", "Houw Sreyneang"] },
                { name: "Hydro", place: "3rd place", school: "Jay Pritzker Academy", members: ["Son Kanha", "Sim Sereyroattana", "Nyoy Sok Dannet"] },
              ],
            },
            {
              category: "RoboMission",
              division: "Junior",
              teams: [
                { name: "Kango", place: "1st place", members: ["Kim Mondol", "Chea Ratha"] },
                { name: "Aqua", place: "2nd place", members: ["Thy ChanMonyVachana", "Seyha Jaennary"] },
                { name: "Zenith", place: "3rd place", school: "Jay Pritzker Academy", members: ["Soatsan Gau Kannika", "Lim Muy Heang", "Hon Sokmeas"] },
              ],
            },
            {
              category: "Future Innovators",
              division: "Senior",
              teams: [
                { name: "Tri-Insight", place: "1st place", school: "The Methodist School of Cambodia", members: ["Mengthai Sarah", "Kuch Kimlong", "Chem Ratanak"] },
                { name: "Luminous Innovators", place: "2nd place", school: "Jay Pritzker Academy", members: ["Siep Sanny", "Yip Kolyan", "Rek Youbin"] },
                { name: "Vestige", place: "3rd place", school: "NGS Preah Sisowath High School", members: ["Lyhout Khay", "Arunvichit Heng", "Prithybandit Sum"] },
              ],
            },
            {
              category: "Future Innovators",
              division: "Junior",
              teams: [
                { name: "River Guardians", place: "1st place", school: "Sovannaphumi School", members: ["Leanghak Sy", "Chhaysing Ung", "Sengpheng Chan"] },
                { name: "Temple Guardian AI", place: "2nd place", school: "Sovannaphumi School – Steung Meanchey 1 Campus", members: ["Try Pichsamphie", "Dara Pagnaboth", "Rattanak Ahnghayuth"] },
                { name: "Young Tech Innovators", place: "3rd place", school: "Sovannaphumi School – Steung Meanchey 1 Campus", members: ["Lim Panhabo", "Sok Sihareach", "Hun Chansothida"] },
              ],
            },
            {
              category: "Future Innovators",
              division: "Elementary",
              teams: [
                { name: "AUPP Emeralds", place: "1st place", school: "American University of Phnom Penh (AUPP) Foxcroft – Primary School", members: ["Khut Khemavatey", "Long Naleeya", "Ly Serey Leakhena"] },
                { name: "AUPP Dragons", place: "2nd place", school: "American University of Phnom Penh (AUPP) Foxcroft – Primary School", members: ["Lor Kaingoun", "Lambrechts Leopaul Ferdinand Ocean", "Aing Sereyputhirith"] },
                { name: "AUPP Sharks", place: "3rd place", school: "American University of Phnom Penh (AUPP) Foxcroft – Primary School", members: ["Thay Yuthyka Skyler", "Blanche Felix Casey"] },
              ],
            },
          ],
        },
      },
      {
        slug: "2025",
        year: "2025",
        date: "6 September 2025",
        title: "Cambodia Robotics Olympiad 2025",
        venue: "AEON Mall Mean Chey, AEON Hall (1st floor)",
        summary:
          "Road to the World Stage: the 2025 national round. Top teams earned places at the World Robot Olympiad International Final in Singapore, 26–28 November 2025.",
        body: [
          "Registration for CRO 2025 opened on 20 June 2025 as the road to WRO 2025. To help new teams get started, STEMEOC ran a free online workshop in July introducing the WRO game formats.",
          "The national round took place on 6 September 2025, from 8:00 AM to 4:00 PM at AEON Hall, AEON Mall Mean Chey, with free entry for everyone. Winners were announced on 11 September and went on to represent Cambodia at the WRO International Final in Singapore.",
        ],
        highlights: [
          "Registration opened 20 June 2025",
          "Free online workshop in July: Introduction to WRO games",
          "8:00 AM – 4:00 PM, free entry",
          "Winners announced 11 September 2025",
          "WRO International Final: Singapore, 26–28 November 2025",
        ],
        image: "/uploads/events/cro-2025/01.jpg",
        photos: [
          { src: "/uploads/events/cro-2025/venue-stage.jpg", alt: "The CRO 2025 stage set up at AEON Hall, AEON Mall Mean Chey" },
          { src: "/uploads/events/cro-2025/venue-trophies.jpg", alt: "Trophies waiting for the CRO 2025 winners" },
          { src: "/uploads/events/cro-2025/venue-fields.jpg", alt: "Competition fields ready for CRO 2025" },
          { src: "/uploads/Announcement-scaled.png", alt: "Cambodia Robotics Olympiad 2025 poster: The Future of Robots", contain: true },
          { src: "/uploads/Workshop-1-scaled.png", alt: "CRO 2025 virtual robotics workshop: Introduction to WRO games", contain: true },
        ],
        winners: {
          intro:
            "The winning teams in the WRO categories, as announced by STEMEOC on 11 September 2025. They went on to represent Cambodia at the WRO International Final in Singapore.",
          photos: [1, 2, 3, 4, 5, 6].map((n) => ({
            src: `/uploads/events/cro-2025/0${n}.jpg`,
            alt: "Winning team with their certificates on stage at CRO 2025",
          })),
          groups: [
            {
              category: "Future Engineers",
              teams: [
              { name: "Baymax Motion", school: "American University of Phnom Penh", members: ["CHHUN Paulen", "CHAMROEUN Vireakpanha", "HENG Bunkheang"] },
              { name: "Snoopy", school: "American University of Phnom Penh", members: ["Leangheng Vongchhayyuth", "Sreng Kimroathpiseth", "Bunchhoeun Rattanakboth"] },
              ],
            },
            {
              category: "Future Innovators",
              division: "Elementary",
              teams: [
              { name: "The Bright Lights", school: "Bluebird British International School", members: ["VATH Densopanhawath", "VANN Thanasihapissott", "SARIM Nadi Virakpich"] },
              { name: "Circuit Cleaners", school: "Bluebird British International School", members: ["PRAK Sakda", "KHOEM Nguon Sreng"] },
              { name: "Blue Gears", school: "Bluebird British International School", members: ["PHEAK Felix", "CHAN Kosomak Molly", "HOM Leena"] },
              ],
            },
            {
              category: "Future Innovators",
              division: "Senior",
              teams: [
              { name: "Charlie Brown", school: "AUPP High School Foxcroft Academy", members: ["Sophea Vitian", "Bun VanBen", "Sok Heng"] },
              { name: "Poweris", school: "Methodist School of Cambodia", members: ["Linlyka Aok", "Sarah Mengthai"] },
              { name: "AngkorBot", school: "Methodist School of Cambodia", members: ["Panha Aok", "Raksa Sopheakrath"] },
              ],
            },
            {
              category: "RoboMission",
              division: "Junior",
              teams: [
              { name: "WebWarrior", school: "Neeson Cripps Academy", members: ["Thann Bee", "Khann Vanny", "Nov Rady"] },
              { name: "Astrobots", school: "Neeson Cripps Academy", members: ["គីម មណ្ឌល", "Pheap Khemarak", "Van Sovansophal"] },
              { name: "LPNR Robotics", school: "Hor Namhong Preynhea High School", members: ["Phan Punhaphinihar", "Ly Soklang", "Kol Sovanpanha"] },
              ],
            },
            {
              category: "RoboMission",
              division: "Senior",
              teams: [
              { name: "Miracle", school: "Tomorrow Academy", members: ["Mao Phearun", "Chantha Darayuth"] },
              { name: "Black Jack Prime", school: "Neeson Cripps Academy", members: ["Samoeurn Sambath", "Sok Saran Chandavid", "Pu Leakena"] },
              { name: "Aqua", school: "Jay Pritzker Academy", members: ["Buey Chanry", "Seyha Jaennary"] },
              ],
            },
          ],
        },
      },
      {
        slug: "2024",
        year: "2024",
        date: "September 2024",
        title: "Cambodia Robotics Olympiad 2024",
        summary:
          "More than 200 students competed across five categories in front of over 900 visitors. Winners represented Cambodia at WRO 2024 in İzmir, Türkiye.",
        body: [
          "CRO 2024 brought more than 200 students together to compete in RoboMission, Future Innovators, Future Engineers, Robot Sumo and Robot Soccer, watched by over 900 visitors.",
          "Alongside the competition, a Robotics Expo gave visitors hands-on activities and the chance to meet professionals and companies working in robotics. The winning teams went on to the World Robot Olympiad 2024 in İzmir, Türkiye, on 28–30 November 2024.",
        ],
        highlights: [
          "Five categories: RoboMission, Future Innovators, Future Engineers, Robot Sumo, Robot Soccer",
          "Robotics Expo with industry exhibitors",
          "WRO 2024 International Final: İzmir, Türkiye, 28–30 November 2024",
        ],
        stats: [
          { value: "200+", label: "Students competing" },
          { value: "900+", label: "Visitors" },
          { value: "5", label: "Categories" },
        ],
        image: "/uploads/events/cro-2024/01.jpg",
        photos: [
          { src: "/uploads/events/cro-2024/02.jpg", alt: "Partners receiving certificates at the Cambodia Robotics Olympiad 2024" },
          { src: "/uploads/CRO-4-scaled.jpg", alt: "Guests on stage at the Cambodia Robotics Olympiad 2024" },
          { src: "/uploads/STEM-Group.jpg", alt: "Students and organizers at the Cambodia Robotics Olympiad 2024" },
        ],
        winners: {
          intro:
            "AUPP High School–Foxcroft Academy took three first places, and six of its Grade 11 students went on to represent Cambodia at WRO 2024 in İzmir, Türkiye.",
          photos: [{ src: "/uploads/events/cro-2024/01.jpg", alt: "Award winners with their medals and certificates at CRO 2024" }],
          groups: [
            { category: "Robot Soccer", division: "Senior", teams: [{ school: "AUPP High School–Foxcroft Academy", place: "1st place" }] },
            { category: "Future Innovators", teams: [{ school: "AUPP High School–Foxcroft Academy", place: "1st place" }] },
            { category: "Future Engineers", teams: [{ school: "AUPP High School–Foxcroft Academy", place: "1st place" }] },
          ],
        },
      },
    ],
  },

  "annual-stem-festivals": {
    heroTitle: "Annual Cambodia STEM Festival",
    summary:
      "The largest student exhibition of science, technology, engineering and mathematics in Cambodia. Every year thousands of students, families and schools come together for projects, performances, competitions and hands-on workshops.",
    whatIsTitle: "What is the STEM Festival?",
    whatIs:
      "The Annual Cambodia STEM Festival is a national event that showcases innovative student projects, interactive exhibits and workshops, inspiring young people to explore how science, technology, engineering and math can shape Cambodia's future. Each edition has its own theme, from green innovation to patterns and programming, with a STEM project exhibition, STEM performances, an art contest, robotics and ECO-STEM zones, a STEAM career fair and a kids zone. Entry is free and open to everyone.",
    overviewImage: "/uploads/STEMFest2026-49.jpg",
    stats: [
      { value: "13,000", label: "Visitors in 2026" },
      { value: "200+", label: "Student projects" },
      { value: "10,000+", label: "Plastic items saved (2024)" },
    ],
    sections: [],
    photos: [
      { src: "/uploads/STEMFest2026-49.jpg", alt: "Crowds at the Annual Cambodia STEM Festival 2026" },
      { src: "/uploads/unnamed-scaled.png", alt: "STEM Festival 2026 poster: Patterns and Programming", contain: true },
      { src: "/uploads/download-11.jpg", alt: "Primary School Art Contest poster for CamSTEMFest 2026", contain: true },
      { src: "/uploads/download-12.jpg", alt: "Call for sponsors and partners of CamSTEMFest 2026", contain: true },
      { src: "/uploads/ACSF-Logo-4.png", alt: "Logo of the 18th Annual Cambodia STEM Festival", contain: true },
    ],
    events: [
      {
        slug: "2026",
        year: "2026",
        date: "7 February 2026",
        title: "Annual Cambodia STEM Festival 2026",
        venue: "The Premier Centre Sen Sok, Halls D, E, F & G",
        summary:
          "Themed \"Patterns and Programming: Discovering Math, Games, and Creativity through STEM\". About 13,000 students, educators, families and visitors came through the doors.",
        body: [
          "The 2026 festival explored the theme \"Patterns and Programming: Discovering Math, Games, and Creativity through STEM\". Students from schools across the country showcased projects, competed in challenges and took part in STEM initiatives across four halls of The Premier Centre Sen Sok.",
          "Schools and students could take part in three ways: the STEM Project Exhibition, STEM Performances, and the Primary School Art Contest. The art contest, themed \"The Art of Patterns: Tessellations\", had two divisions (grades 1–3 and grades 4–6), with A3 individual entries due on 23 January and results announced at the festival.",
          "Entry was free for schools, families, students, ministries, private-sector partners, NGOs and the general public.",
        ],
        highlights: [
          "Around 250 STEM projects and 1,000 creative exhibits",
          "Robotics, ECO-STEM, interactive learning and kids zones",
          "STEAM Career Fair",
          "Performances, quizzes and competitions",
          "Primary School Art Contest: \"The Art of Patterns: Tessellations\"",
        ],
        stats: [
          { value: "13,000", label: "Visitors" },
          { value: "250", label: "STEM projects" },
          { value: "1,000", label: "Creative exhibits" },
        ],
        image: "/uploads/events/festival-2026/01.jpg",
        photos: [
          { src: "/uploads/events/festival-2026/02.jpg", alt: "Students with their tessellation artwork at the STEM Festival 2026" },
          { src: "/uploads/events/festival-2026/03.jpg", alt: "A speaker at the opening of the STEM Festival 2026" },
          { src: "/uploads/events/festival-2026/04.jpg", alt: "A student speaker at the STEM Festival 2026" },
          { src: "/uploads/STEMFest2026-49.jpg", alt: "Crowds at the Annual Cambodia STEM Festival 2026" },
          { src: "/uploads/unnamed-scaled.png", alt: "STEM Festival 2026 poster: Patterns and Programming", contain: true },
          { src: "/uploads/download-11.jpg", alt: "Primary School Art Contest poster for CamSTEMFest 2026", contain: true },
          { src: "/uploads/download-12.jpg", alt: "Call for sponsors and partners of CamSTEMFest 2026", contain: true },
        ],
      },
      {
        slug: "2025",
        year: "2025",
        date: "8 February 2025",
        title: "Annual Cambodia STEM Festival 2025",
        venue: "The Premier Centre Sen Sok, Halls A, B, C & D",
        summary:
          "Themed \"Designing Sustainable Cities\": students, schools, officials and partners explored how STEM can build greener cities.",
        body: [
          "The 2025 festival took the theme \"Designing Sustainable Cities\", asking students how science, technology, engineering and math can shape cleaner, greener places to live.",
          "Guests of honour and partners toured the student project exhibition across four halls of The Premier Centre Sen Sok, alongside talks on stage and halls full of students and families.",
        ],
        highlights: ["Theme: Designing Sustainable Cities", "Student project exhibition", "Opening ceremony and talks from officials and partners"],
        image: "/uploads/events/festival-2025/02.jpg",
        photos: [1, 3, 4, 5, 6, 7, 8].map((n) => ({
          src: `/uploads/events/festival-2025/0${n}.jpg`,
          alt: "At the Annual Cambodia STEM Festival 2025",
        })),
      },
      {
        slug: "2024",
        year: "2024",
        date: "10–11 May 2024",
        title: "Annual Cambodia STEM Festival 2024",
        venue: "AEON Mall Mean Chey",
        summary:
          "The 18th festival: green innovation and sustainability, with more than 200 student projects, 5,000+ visiting students and 8,000+ members of the public.",
        body: [
          "The 18th festival put green innovation and sustainability at its heart. It was organized by STEMEOC and STEAM Cambodia with the endorsement of the Ministry of Environment, the Ministry of Education, Youth and Sport, and the Ministry of Industry, Science, Technology & Innovation.",
          "Students presented projects on renewable energy, waste management, biodiversity conservation and sustainable agriculture. More than 200 student projects were joined by 550 art pieces and over 30 STEM performances.",
          "The first day drew a record crowd of more than 5,000 visiting students, and more than 8,000 members of the public joined over the weekend. By committing to eco-friendly practices, the festival also avoided more than 10,000 single-use plastic items, from bottles and cups to straws.",
        ],
        highlights: [
          "Theme: green innovation and sustainability",
          "Co-organized with STEAM Cambodia",
          "Endorsed by three ministries",
        ],
        stats: [
          { value: "200+", label: "Student projects" },
          { value: "8,000+", label: "Public visitors" },
          { value: "10,000+", label: "Plastic items avoided" },
        ],
        image: "/uploads/events/festival-2024/01.jpg",
        photos: [{ src: "/uploads/ACSF-Logo-4.png", alt: "Logo of the 18th Annual Cambodia STEM Festival", contain: true }],
      },
      {
        slug: "2023",
        year: "2023",
        date: "24–25 February 2023",
        title: "Annual Cambodia STEM Festival 2023",
        venue: "The Premier Centre Sen Sok, Halls F & G",
        summary:
          "The 17th festival: two days of creative student projects from schools across Cambodia, alongside STEM Sisters, robotics, Soap Up and Beat Plastic activities.",
        image: "/uploads/events/festival-2023/poster.jpg",
        imageContain: true,
        body: [
          "At the 17th festival, held at The Premier Centre Sen Sok, students from schools across Cambodia showcased their creative projects in science, technology, engineering, arts and mathematics.",
          "Visitors also met STEMEOC's wider programs, including STEM Sisters and robotics, and the Soap Up and Beat Plastic campaigns.",
        ],
      },
      {
        slug: "2021",
        year: "2021",
        date: "25–29 January 2021",
        title: "Annual Cambodia STEM Festival 2021",
        venue: "Online",
        summary:
          "The 16th festival and Cambodia's first virtual STEM Festival, held online during the COVID-19 pandemic so students could keep sharing their projects.",
        body: [
          "With the COVID-19 pandemic ruling out a live event, the 16th festival moved online for the first time, running over five days so students could keep sharing their projects. It closed with an online award ceremony.",
        ],
        image: "/uploads/events/festival-2021/01.jpg",
        photos: [{ src: "/uploads/events/festival-2021/awards.jpg", alt: "Announcement of the 16th festival's online award ceremony", contain: true }],
      },
      {
        slug: "2019",
        year: "2019",
        date: "2019",
        title: "Annual Cambodia STEM Festival 2019",
        summary: "The 15th festival: more than 13,000 visitors and over 200 STEM projects.",
        body: [
          "The 15th festival welcomed more than 13,000 visitors and featured over 200 STEM projects from students across Cambodia.",
        ],
        stats: [
          { value: "13,000+", label: "Visitors" },
          { value: "200+", label: "STEM projects" },
        ],
      },
    ],
  },

  icia: {
    heroTitle: "International Creativity and Innovation Award",
    summary:
      "ICIA is a global competition and learning platform where creativity meets innovation. STEMEOC runs the Cambodia National Selection and hosted the 2026 Global Round in Phnom Penh.",
    whatIsTitle: "What is ICIA?",
    whatIs:
      "The International Creativity and Innovation Award (ICIA), initiated by Krya Global and Crebiz Factory, is more than a competition: it is a learning platform where students turn bold ideas into real solutions. STEMEOC brings ICIA to Cambodia in collaboration with the Ministry of Education, Youth and Sports, the Ministry of Tourism and the Ministry of Environment. Students compete in three categories: Inventor Wannabe, Innovation Challenge and Innovation Award.",
    overviewImage: "/uploads/ICIA-Box.jpg",
    stats: [
      { value: "27", label: "Countries" },
      { value: "33", label: "National selections" },
      { value: "3", label: "Student categories" },
    ],
    sections: [],
    photos: [
      { src: "/uploads/ICIA-Box.jpg", alt: "ICIA award ceremony" },
      { src: "/uploads/681978669_1378614724312189_7724845010848517612_n.jpg", alt: "Opening day of the ICIA Global Round 2026" },
      { src: "/uploads/682511379_1380390724134589_5403311687650702745_n.jpg", alt: "Participants on day 2 of the ICIA Global Round 2026" },
      { src: "/uploads/682141820_1380405444133117_32712812770791493_n.jpg", alt: "Cultural Night Party at the ICIA Global Round 2026" },
      { src: "/uploads/625262244_1310935147746814_8225481027416273051_n.jpg", alt: "ICIA 2026 Cambodia National Selection poster", contain: true },
    ],
    events: [
      {
        slug: "global-round-2026",
        year: "2026",
        date: "24–26 April 2026",
        title: "ICIA Global Round 2026",
        venue: "Phnom Penh, Cambodia",
        summary:
          "Cambodia hosted innovators, educators and leaders from 33 national selections in 27 countries for three days of competitions, forums and exhibitions.",
        body: [
          "For the first time, Cambodia hosted the Global Round of the International Creativity and Innovation Award. STEMEOC brought the event to Phnom Penh with Krya Global and Crebiz Factory, in collaboration with the Ministry of Education, Youth and Sports, the Ministry of Tourism and the Ministry of Environment.",
          "In March, STEMEOC and its international partners briefed H.E. Kim Sethany on preparations. Day 1 opened with a campus tour and a welcome dinner for participants from around the world, and day 2 ended with a Cultural Night Party sharing Cambodia's culture and hospitality.",
          "Students competed in three categories: Inventor Wannabe, Innovation Challenge (with the Ministry of Environment and SEAMEO) and Innovation Award. Alongside the competition ran the Startup Innovation Weekend, the Educators Meetalk forum on AI in education, and the first Teach Me Award for educators.",
        ],
        highlights: [
          "Public exhibition on 25 April at Paragon International School",
          "Startup Innovation Weekend for student and professional startups",
          "Educators Meetalk: speakers from the US, Cambodia, Malaysia and Japan",
          "First Teach Me Award, recognizing educators",
          "Global Celebration and World Creativity and Innovation Day on 26 April",
        ],
        stats: [
          { value: "27", label: "Countries" },
          { value: "33", label: "National selections" },
          { value: "3", label: "Days" },
        ],
        image: "/uploads/events/icia-2026/01.jpg",
        photos: [
          { src: "/uploads/events/icia-2026/02.jpg", alt: "Team Cambodia at the ICIA Global Round 2026" },
          { src: "/uploads/events/icia-2026/03.jpg", alt: "International participants at the ICIA Global Round 2026" },
          { src: "/uploads/681978669_1378614724312189_7724845010848517612_n.jpg", alt: "Opening day of the ICIA Global Round 2026" },
          { src: "/uploads/682511379_1380390724134589_5403311687650702745_n.jpg", alt: "Participants on day 2 of the ICIA Global Round 2026" },
          { src: "/uploads/682141820_1380405444133117_32712812770791493_n.jpg", alt: "Cultural Night Party at the ICIA Global Round 2026" },
          {
            src: "/uploads/653712120_1348361477337514_1919288644011531013_n.jpg",
            alt: "STEMEOC and international partners brief H.E. Kim Sethany on ICIA 2026 preparations",
          },
        ],
        winners: {
          intro: "The Titanium and Grand awardees of the ICIA 2026 Global Round in Cambodia, as announced by ICIA.",
          photos: [{ src: "/uploads/events/icia-2026/awards.jpg", alt: "Awardees on stage with their national flags at the ICIA 2026 Global Round" }],
          groups: [
            {
              category: "Innovation Award",
              teams: [
                { name: "TRACE" },
                { name: "SeizAlert" },
                { name: "Gobind" },
                { name: "FIREGUARD: A LoRa-Integrated Hybrid Smart Fire Detection and Suppression System" },
                { name: "Flow to Power: Converting Kinetic Energy into Electricity" },
                { name: "FriendlyCom: A Solar-Powered Garbage Bin as a Collecting and Charging Station" },
                { name: "FV (Fish Viscera): Dietary Factor in Vermicast Production" },
                { name: "Green Gold: Evaluating Compost Impact on Soil Variants" },
                { name: "AC Water Recycling", country: "India" },
                { name: "EpiTrack", country: "Kazakhstan" },
                { name: "Animal Alert", country: "Kazakhstan" },
                { name: "A Prophylactic Approach to Iodine Deficiency", country: "Romania" },
              ],
            },
            {
              category: "Innovation Challenge",
              teams: [
                { name: "OVO-AI" },
                { name: "AI Eco Ally" },
                { name: "Electri-Dry" },
                { name: "PETraform" },
                { name: "A Hands-on Approach to Statistics Using Recyclables" },
                { name: "Maggotopia" },
              ],
            },
            {
              category: "Inventor Wannabe",
              teams: [
                { members: ["Chea Chansoneeya", "Ourng Mana", "Virak Noparoth"] },
                { members: ["Aliyah Joanna C.", "Achsah Ivanna C."] },
                { members: ["Putluru Dhanvin Sai Reddy"] },
                { members: ["Seng Lyza", "Cheth Chanlina", "Pheak Hanntheareach"] },
              ],
            },
            {
              category: "Startup Innovation Weekend",
              teams: [
                { name: "Bamnang Holdings Pte. Ltd." },
                { name: "Duluin" },
              ],
            },
          ],
        },
      },
      {
        slug: "national-selection-2026",
        year: "2026",
        date: "14 March 2026",
        title: "ICIA Cambodia National Selection 2026",
        summary:
          "Young Cambodian innovators competed on a national stage for places in the ICIA 2026 Global Round.",
        body: [
          "Registration for the Cambodia National Selection opened in February 2026, calling on young innovators, creators and changemakers to bring their ideas to a national stage.",
          "The national selection took place on 14 March 2026. Teams that stood out went on to the Global Round in Phnom Penh on 24–26 April.",
        ],
        highlights: ["Registration fee: $10 per team", "Global Round: Phnom Penh, 24–26 April 2026"],
        image: "/uploads/625262244_1310935147746814_8225481027416273051_n.jpg",
        imageContain: true,
        photos: [
          { src: "/uploads/625262244_1310935147746814_8225481027416273051_n.jpg", alt: "ICIA 2026 Cambodia National Selection poster", contain: true },
        ],
      },
    ],
  },

  "eco-stem": {
    heroTitle: "Eco-STEM",
    summary:
      "Eco-STEM empowers students to develop innovative, sustainable solutions to environmental challenges, fostering eco-conscious leadership and action in their communities.",
    whatIsTitle: "What is Eco-STEM?",
    whatIs:
      "Environmental stewardship is one of STEMEOC's core values. Through Eco-STEM (formerly Eco Heroes), students take what they learn in science and engineering out into their communities: clean-up days, plastic-awareness tours, and green-innovation projects at the STEM Festival. The 18th Annual Cambodia STEM Festival alone avoided more than 10,000 single-use plastic items.",
    overviewImage: "/uploads/Artboard-5.png",
    stats: [],
    sections: [],
    photos: [],
    events: [
      {
        slug: "cleanup-day-2024",
        year: "2024",
        date: "8 June 2024",
        title: "Eco-Hero Cleanup Day 2024",
        venue: "Mean Commune, Ou Reang Ov District",
        summary:
          "Students, volunteers, local authorities and the Ministry of Environment cleaned public spaces as part of the national \"Clean Cambodia, Khmer Can Do It\" movement.",
        body: [
          "Eco-Hero Cleanup Day brought students and volunteers together with local authorities and representatives of the Ministry of Environment in Mean Commune, Ou Reang Ov District.",
          "Participants cleaned public spaces, collected waste and promoted sustainable practices in the community, as part of the national \"Clean Cambodia, Khmer Can Do It\" movement.",
        ],
        image: "/uploads/Eco-Hero-Logo.png",
        imageContain: true,
      },
      {
        slug: "green-festival-2024",
        year: "2024",
        date: "10–11 May 2024",
        title: "Green Innovation at the STEM Festival 2024",
        venue: "AEON Mall Mean Chey",
        summary:
          "Students presented projects on renewable energy, waste management, biodiversity and sustainable agriculture, and the festival avoided more than 10,000 plastic items.",
        body: [
          "Sustainability was the theme of the 18th Annual Cambodia STEM Festival. Students presented projects on renewable energy, waste management, biodiversity conservation and sustainable agriculture.",
          "The festival itself committed to eco-friendly practices and avoided more than 10,000 single-use plastic items, including bottles, cups and straws.",
        ],
        stats: [{ value: "10,000+", label: "Plastic items avoided" }],
        image: "/uploads/events/festival-2024/01.jpg",
      },
      {
        slug: "plastic-odyssey-2019",
        year: "2019",
        date: "September 2019",
        title: "Plastic Odyssey Tour 2019",
        summary: "Eco Heroes students took an eye-opening tour exploring plastic pollution and how to beat it.",
        body: [
          "Eco Heroes students set out on the Plastic Odyssey, an eye-opening exploration tour about plastic pollution and its effect on the environment.",
        ],
        // From the "Eco Heroes Embark on an Eye-Opening Plastic Odyssey Exploration Tour" post on the old site.
        photos: [
          { src: "/uploads/events/plastic-odyssey-2019/01.jpg", alt: "Eco Heroes students on the deck of the Plastic Odyssey ship" },
          { src: "/uploads/events/plastic-odyssey-2019/02.jpg", alt: "Eco Heroes students and guides with their worksheets aboard the Plastic Odyssey" },
          { src: "/uploads/events/plastic-odyssey-2019/03.jpg", alt: "Students exploring the Plastic Odyssey ship's lab and library" },
        ],
      },
    ],
  },

  "stem-sisters": {
    heroTitle: "STEM Sisters Cambodia",
    summary:
      "A mentoring program that empowers young Cambodian women to pursue careers in science, technology, engineering and mathematics.",
    whatIsTitle: "What is STEM Sisters?",
    whatIs:
      "STEM Sisters is a three-tier mentoring program that builds a supportive STEM community for girls and women. Pro-Sisters (young professional women in STEM) mentor Big Sisters (women studying STEM at university), who mentor Little Sisters (high-school girls). Little Sisters attend a Leadership Academy, then return to their schools to start their own STEM Clubs for boys and girls together, led by the girls.",
    overviewImage: "/uploads/SS-Box-scaled.jpg",
    stats: [
      { value: "60", label: "Core participants (cycles 1–2)" },
      { value: "3", label: "Mentoring tiers" },
      { value: "3", label: "Cycles run" },
    ],
    sections: [],
    photos: [1, 2, 3, 4, 5, 6].map((n) => ({
      src: `/uploads/events/stem-sisters/0${n}.jpg`,
      alt: "STEM Sisters workshop with girls building and coding robots",
    })),
    events: [
      {
        slug: "cycle-3-2021",
        year: "2021",
        date: "2021",
        title: "STEM Sisters 2021: Online Robotics",
        summary:
          "During the COVID-19 pandemic, STEM Sisters created a pandemic-proof online robotics program that reached students across the country.",
        body: [
          "With schools closed by the COVID-19 pandemic, STEM Sisters rebuilt the program for a third cycle as an online robotics course that reached students across the country.",
        ],
      },
      {
        slug: "cycles-1-2",
        year: "2019–20",
        date: "2019–2020",
        title: "STEM Sisters 2019–2020: Cycles 1 & 2",
        summary:
          "A core group of 60 Pro-Sisters, Big Sisters and Little Sisters. Little Sisters trained at the Leadership Academy and started STEM Clubs in their own schools.",
        body: [
          "The first two cycles brought together a core group of 60 girls and women across three levels: Pro-Sisters (young professional women in STEM), Big Sisters (women studying STEM majors) and Little Sisters (high-school girls).",
          "Little Sisters attended a Leadership Academy for training in leadership, coaching and mentoring. They then returned to their schools, gathered their classmates and started STEM Clubs for boys and girls, led by the girls.",
        ],
        stats: [
          { value: "60", label: "Core participants" },
          { value: "3", label: "Mentoring tiers" },
        ],
        image: "/uploads/SS-Box-scaled.jpg",
      },
    ],
  },
};

/** One edition of a program, or undefined. */
export function getProgramEvent(programSlug: string, eventSlug: string) {
  return PROGRAM_PAGES[programSlug]?.events?.find((e) => e.slug === eventSlug);
}
