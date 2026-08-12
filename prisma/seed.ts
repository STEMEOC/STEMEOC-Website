import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@stemeoc.org";
  const adminPassword = "ChangeMe123!";

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "STEMEOC Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  await prisma.siteStat.deleteMany();
  await prisma.siteStat.createMany({
    data: [
      { label: "Years of STEM Festivals", value: "8+", order: 0 },
      { label: "Partner Schools", value: "150+", order: 1 },
      { label: "Students Reached", value: "40,000+", order: 2 },
      { label: "Provinces Covered", value: "12", order: 3 },
    ],
  });

  await prisma.program.deleteMany();
  await prisma.program.createMany({
    data: [
      {
        slug: "cambodian-stem-festival",
        title: "Cambodian STEM Festival",
        description:
          "Our flagship annual event bringing hands-on science, technology, engineering, and math activities to thousands of students across Cambodia.",
        category: "festival",
        order: 0,
      },
      {
        slug: "cambodia-robotics-olympiad",
        title: "Cambodia Robotics Olympiad",
        description:
          "A national robotics competition that challenges student teams to design, build, and program robots to solve real-world problems.",
        category: "robotics",
        order: 1,
      },
      {
        slug: "eco-stem-initiative",
        title: "Eco-STEM Initiative",
        description:
          "Combining environmental education with STEM learning to help students tackle sustainability challenges in their own communities.",
        category: "eco",
        order: 2,
      },
    ],
  });

  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Sokha Chan",
        role: "Executive Director",
        bio: "Sokha leads STEMEOC's strategy and partnerships, with over a decade of experience in education nonprofits across Southeast Asia.",
        order: 0,
      },
      {
        name: "Dara Pich",
        role: "Programs Manager",
        bio: "Dara oversees the design and delivery of STEMEOC's festivals and school programs nationwide.",
        order: 1,
      },
      {
        name: "Lina Sok",
        role: "Community Engagement Lead",
        bio: "Lina builds relationships with schools, volunteers, and local partners to expand STEMEOC's reach.",
        order: 2,
      },
    ],
  });

  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: [
      { name: "Ministry of Education, Youth and Sport", logoUrl: "/placeholders/partner-1.svg", order: 0 },
      { name: "US Embassy Phnom Penh", logoUrl: "/placeholders/partner-2.svg", order: 1 },
      { name: "Tech for Cambodia", logoUrl: "/placeholders/partner-3.svg", order: 2 },
    ],
  });

  await prisma.newsPost.deleteMany();
  await prisma.newsPost.create({
    data: {
      slug: "stem-festival-2026-recap",
      title: "2026 Cambodian STEM Festival Draws Record Crowds",
      excerpt:
        "This year's festival welcomed over 5,000 students from 12 provinces for a weekend of hands-on science and engineering activities.",
      body: "This year's Cambodian STEM Festival was our largest yet, with over 5,000 students from 12 provinces attending workshops, robotics demos, and science fairs across three days. Thank you to our volunteers, partners, and sponsors who made it possible.",
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  await prisma.podcastEpisode.deleteMany();
  await prisma.podcastEpisode.createMany({
    data: [
      {
        title: "Introducing STEM Talks",
        videoId: "4vsUfrqEf-c",
        order: 1,
        description:
          "STEMEOC is pleased to announce the release of the first episode of our STEM Talks podcast, Introducing STEM Talks. In the first episode, our host Vatey Sokea introduces the podcast and shares why it was created, who it's for, and what listeners can expect in upcoming episodes. Through these conversations, STEM Talks aims to spotlight STEM pathways, careers, and opportunities for young people in Cambodia. We hope you'll stay tuned for future episodes featuring inspiring stories, practical insights, and voices from across Cambodia's STEM community.",
      },
      {
        title: "Nithijounie Dene Eang",
        videoId: "eTCU_A1p_d4",
        order: 2,
        description:
          "In the second episode of STEM Talks, host Vatey sits down with Nithijounie Dene Eang, Executive Director of STEMEOC. They explore Dene's journey into leadership, the work STEMEOC is doing to expand access to STEM education, and the current STEM education landscape in Cambodia. The conversation also offers valuable advice for young people interested in pursuing pathways in STEM and leadership.",
      },
      {
        title: "Annual Cambodia STEM Festival 2026",
        videoId: "OIc-Fbpvo8I",
        order: 3,
        tag: "Special Episode",
        description:
          "In this special episode of STEM Talks, Vatey, Neary, and Piseth take us behind the scenes of the Annual Cambodia STEM Festival 2026! Held on 7 February 2026 at Premier Sen Sok in Phnom Penh, this year's festival showcased 337 STEM projects centered around the theme Patterns and Programming. Follow our host as she explores selected projects, and interviews students, teachers, and guests to capture the energy, creativity, and innovation that define Cambodia's growing STEM community!",
      },
      {
        title: "Solita Pun",
        videoId: "NTjH_Ir5BjY",
        order: 4,
        description:
          "They explore Solita's journey into robotics and the experiences that shaped her passion for STEM. Now pursuing a master's degree in data science, Solita also shares insights on the growing role of robotics and AI in Cambodia and how these technologies are opening new opportunities for students. The conversation also touches on the importance of supporting women in STEM, the evolving STEM education landscape in Cambodia, and advice for young people who aspire to pursue careers in science and technology.",
      },
      {
        title: "ChanSocheata Poum",
        videoId: "uIwp1oW-rgw",
        order: 5,
        description:
          "In the fifth episode of STEM Talks, host Vatey sits down with Chansocheata Poum. Socheata shares her journey into tech, the experiences that shaped her passion, and how she co-founded Snoopedu to make STEM learning more accessible for students in Cambodia. She also talks about her current work as Head of Makerspace at the Cambodia Academy of Digital Technology (CADT), where she focuses on assistive technology and innovation and even brings in a Braille printer she built to show live on the podcast.",
      },
      {
        title: "Solyda Teik",
        videoId: "1UD39jz9qu0",
        order: 6,
        description:
          "In the sixth episode of STEM Talks, host Vatey sits down with Solyda Teik, a Cambodian Technical Project Manager working in the aerospace industry in the United States at Blue Origin. Solyda shares her journey from Cambodia to South Korea and eventually into aerospace, reflecting on career pivots, moving across countries, and working on large-scale aerospace programs. She also gives listeners a glimpse into what it's like inside large aerospace programs, and why careers in aerospace may be more accessible than many students imagine.",
      },
      {
        title: "Andrew Roberts",
        videoId: "uLvIQmWKLH8",
        order: 7,
        description:
          "In the seventh episode of STEM Talks, host Vatey sits down with Andrew Roberts, STEM Coordinator at the Cambodian Children's Fund (CCF). Andrew shares how he first came to Cambodia in 2016 and how he became involved in building CCF's STEM programme. Together, they discuss CCF and its flagship school, Neeson Cripps Academy (NCA), recently recognized as the World's Best STEM School at the 2026 Global Schools Prize, and how students and supporters can get involved with CCF.",
      },
    ],
  });

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${adminEmail}  password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
