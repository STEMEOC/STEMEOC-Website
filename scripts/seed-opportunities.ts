import { PrismaClient, FormFieldType } from "@prisma/client";

const prisma = new PrismaClient();

const OPPORTUNITIES_DATA = [
  {
    slug: "volunteer-application",
    title: "Cambodia STEM Festival Volunteer Crew",
    description:
      "Join the organizing crew behind Cambodia's largest national STEM gathering for youth, schools, and partners.",
    category: "volunteer",
    location: "Phnom Penh",
    deadline: "Deadline: 15 Oct",
    accentColor: "#f49423",
    layout: "BOLD" as const,
    fields: [
      { label: "Full name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email", type: FormFieldType.EMAIL, required: true },
      { label: "Phone number", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "Availability",
        type: FormFieldType.MULTIPLE_CHOICE,
        options: ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"],
        required: true,
      },
      { label: "Why do you want to volunteer with us?", type: FormFieldType.PARAGRAPH, required: true },
      { label: "Relevant experience", type: FormFieldType.PARAGRAPH, required: false },
    ],
  },
  {
    slug: "annual-cambodia-stem-festival-project",
    title: "The Annual Cambodia STEM Festival Project",
    description:
      "Register your school, university, or youth STEM innovation project to be showcased at the annual national festival.",
    category: "event",
    location: "Phnom Penh",
    deadline: "Deadline: 15 Oct",
    accentColor: "#e5262a",
    layout: "BOLD" as const,
    fields: [
      { label: "Project Title", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "School or University Name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Lead Innovator / Team Representative", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email Address", type: FormFieldType.EMAIL, required: true },
      { label: "Phone / Telegram", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "STEM Category",
        type: FormFieldType.DROPDOWN,
        options: [
          "Robotics & Artificial Intelligence",
          "Eco-Tech & Environmental Sustainability",
          "Software & Mobile Applications",
          "Applied Engineering & Electronics",
          "Science Experiments & Mathematics",
        ],
        required: true,
      },
      { label: "Brief Project Summary & Objective", type: FormFieldType.PARAGRAPH, required: true },
      { label: "Number of Team Members", type: FormFieldType.NUMBER, required: true },
      { label: "Booth Equipment or Power Needs", type: FormFieldType.PARAGRAPH, required: false },
    ],
  },
  {
    slug: "stem-program-logistics-internship",
    title: "STEM Education Program & Logistics Intern",
    description:
      "Gain hands-on professional experience in nationwide STEM program operations, school outreach, and event coordination.",
    category: "internship",
    location: "Phnom Penh",
    deadline: "Deadline: Rolling",
    accentColor: "#2c80c2",
    layout: "CLASSIC" as const,
    fields: [
      { label: "Full Name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email Address", type: FormFieldType.EMAIL, required: true },
      { label: "Phone / Telegram Contact", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "University, Major & Year of Study", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "Internship Availability",
        type: FormFieldType.MULTIPLE_CHOICE,
        options: ["Full-time (3-6 months)", "Part-time (20 hours/week)", "Flexible Academic Internship"],
        required: true,
      },
      { label: "Why do you want to intern with STEMEOC?", type: FormFieldType.PARAGRAPH, required: true },
      { label: "Past leadership, event coordination, or school club experience", type: FormFieldType.PARAGRAPH, required: false },
    ],
  },
  {
    slug: "stem-teacher-training-facilitator",
    title: "STEM Teacher Training & Workshop Facilitator",
    description:
      "Support educators across provinces with hands-on robotics kits, curriculum experiments, and laboratory toolkits.",
    category: "workshop",
    location: "Siem Reap",
    deadline: "Deadline: 20 Nov",
    accentColor: "#14a650",
    layout: "BOLD" as const,
    fields: [
      { label: "Full Name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email Address", type: FormFieldType.EMAIL, required: true },
      { label: "Phone Number", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Current Role / School / Organization", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Province of Residence", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "Core Training Focus",
        type: FormFieldType.MULTIPLE_CHOICE,
        options: [
          "Hands-on Robotics & Sensor Kits",
          "Beginner Coding & Micro:bit Hardware",
          "Science Laboratory Demonstrations",
          "Interactive Pedagogy & STEM Curriculum",
        ],
        required: true,
      },
      { label: "Describe your prior teaching, mentoring, or facilitation experience", type: FormFieldType.PARAGRAPH, required: true },
    ],
  },
  {
    slug: "national-robot-olympiad-support-team",
    title: "National Robot Olympiad 2026 Support Team",
    description:
      "Help referee, organize team check-ins, and manage technical arenas for national robotics competitors.",
    category: "event",
    location: "Phnom Penh",
    deadline: "Deadline: 30 Nov",
    accentColor: "#e5262a",
    layout: "CLASSIC" as const,
    fields: [
      { label: "Full Name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email Address", type: FormFieldType.EMAIL, required: true },
      { label: "Phone / Telegram", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "Preferred Event Role",
        type: FormFieldType.DROPDOWN,
        options: [
          "Arena Referee & Scorekeeper",
          "Team Pit Marshall & Check-in",
          "Technical Hardware Inspection",
          "Livestream, Audio & Stage Coordinator",
        ],
        required: true,
      },
      {
        label: "T-Shirt Size",
        type: FormFieldType.DROPDOWN,
        options: ["S", "M", "L", "XL", "XXL"],
        required: true,
      },
      { label: "Prior robotics or tournament volunteer experience", type: FormFieldType.PARAGRAPH, required: false },
    ],
  },
  {
    slug: "digital-media-visual-content-intern",
    title: "Digital Media & Visual Content Creation Intern",
    description:
      "Create engaging photography, short-form reels, and stories highlighting Cambodian student innovators.",
    category: "internship",
    location: "Phnom Penh",
    deadline: "Deadline: Rolling",
    accentColor: "#2c80c2",
    layout: "BOLD" as const,
    fields: [
      { label: "Full Name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email Address", type: FormFieldType.EMAIL, required: true },
      { label: "Phone / Telegram Handle", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Link to Portfolio, Instagram, or Video Samples", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "Creative Tools You Use",
        type: FormFieldType.CHECKBOXES,
        options: [
          "Premiere Pro / Final Cut / CapCut",
          "Photoshop / Illustrator",
          "Camera Operation (DSLR / Mirrorless)",
          "Canva & Social Copywriting",
        ],
        required: true,
      },
      { label: "Why are you passionate about visual storytelling in STEM?", type: FormFieldType.PARAGRAPH, required: true },
    ],
  },
  {
    slug: "hands-on-science-lab-assistant",
    title: "Hands-on Science & Engineering Lab Assistant",
    description:
      "Deliver interactive STEM experiments in mobile science labs for rural primary and secondary students.",
    category: "workshop",
    location: "Battambang",
    deadline: "Deadline: Rolling",
    accentColor: "#14a650",
    layout: "CLASSIC" as const,
    fields: [
      { label: "Full Name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email Address", type: FormFieldType.EMAIL, required: true },
      { label: "Phone Number", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Academic Background in Science or Engineering", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "Availability for Provincial Field Travel",
        type: FormFieldType.MULTIPLE_CHOICE,
        options: ["Fully available for travel", "Available on weekends only", "Limited travel availability"],
        required: true,
      },
      { label: "Relevant science outreach or experimental demonstration background", type: FormFieldType.PARAGRAPH, required: true },
    ],
  },
  {
    slug: "community-youth-robotics-mentor",
    title: "Community Youth Robotics & Coding Mentor",
    description:
      "Inspire and mentor beginner teams learning block programming and robotics kit assembly.",
    category: "volunteer",
    location: "Phnom Penh",
    deadline: "Deadline: Rolling",
    accentColor: "#f49423",
    layout: "BOLD" as const,
    fields: [
      { label: "Full Name", type: FormFieldType.SHORT_TEXT, required: true },
      { label: "Email Address", type: FormFieldType.EMAIL, required: true },
      { label: "Phone / Telegram Contact", type: FormFieldType.SHORT_TEXT, required: true },
      {
        label: "Technical Specialties",
        type: FormFieldType.CHECKBOXES,
        options: [
          "Scratch & Block-based Coding",
          "Arduino & C++ Basics",
          "Python for Beginners",
          "Lego Spike / Mindstorms",
          "Basic Electronics & Breadboarding",
        ],
        required: true,
      },
      {
        label: "Mentoring Availability",
        type: FormFieldType.MULTIPLE_CHOICE,
        options: ["Saturday Mornings", "Saturday Afternoons", "Sunday Mornings", "Both Weekends"],
        required: true,
      },
      { label: "Why do you want to mentor young robotics learners?", type: FormFieldType.PARAGRAPH, required: true },
    ],
  },
];

async function main() {
  console.log("Seeding authentic STEMEOC opportunities & forms...");

  for (const item of OPPORTUNITIES_DATA) {
    const existing = await prisma.form.findUnique({
      where: { slug: item.slug },
      include: { fields: true },
    });

    if (existing) {
      console.log(`Updating existing form: ${item.slug}`);
      await prisma.form.update({
        where: { id: existing.id },
        data: {
          title: item.title,
          description: item.description,
          category: item.category,
          location: item.location,
          deadline: item.deadline,
          accentColor: item.accentColor,
          layout: item.layout,
          published: true,
        },
      });

      // If fields are empty, recreate them
      if (existing.fields.length === 0) {
        for (let i = 0; i < item.fields.length; i++) {
          const f = item.fields[i];
          await prisma.formField.create({
            data: {
              formId: existing.id,
              label: f.label,
              type: f.type,
              options: "options" in f && f.options ? f.options : [],
              required: f.required,
              order: i,
            },
          });
        }
      }
    } else {
      console.log(`Creating form: ${item.slug}`);
      const created = await prisma.form.create({
        data: {
          slug: item.slug,
          title: item.title,
          description: item.description,
          category: item.category,
          location: item.location,
          deadline: item.deadline,
          accentColor: item.accentColor,
          layout: item.layout,
          published: true,
        },
      });

      for (let i = 0; i < item.fields.length; i++) {
        const f = item.fields[i];
        await prisma.formField.create({
          data: {
            formId: created.id,
            label: f.label,
            type: f.type,
            options: "options" in f && f.options ? f.options : [],
            required: f.required,
            order: i,
          },
        });
      }
    }
  }

  const allForms = await prisma.form.findMany({ select: { slug: true, title: true, category: true } });
  console.log(`Successfully synced ${allForms.length} real forms in database:`);
  console.table(allForms);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
