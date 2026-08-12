import type { FormFieldType, FormLayout, FormTheme } from "@prisma/client";

export type FormTemplateField = {
  label: string;
  type: FormFieldType;
  options?: string[];
  required?: boolean;
};

export type FormTemplate = {
  id: string;
  label: string;
  description: string;
  color: string;
  title: string;
  slug: string;
  formDescription: string;
  accentColor: string;
  layout: FormLayout;
  theme: FormTheme;
  fields: FormTemplateField[];
};

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "blank",
    label: "Blank form",
    description: "Start from scratch",
    color: "var(--color-blue)",
    title: "",
    slug: "",
    formDescription: "",
    accentColor: "#2c80c2",
    layout: "CLASSIC",
    theme: "LIGHT",
    fields: [],
  },
  {
    id: "volunteer",
    label: "Volunteer application",
    description: "Collect volunteer sign-ups",
    color: "var(--color-green)",
    title: "Volunteer Application",
    slug: "volunteer-application",
    formDescription: "Tell us a bit about yourself and how you'd like to get involved.",
    accentColor: "#14a650",
    layout: "CLASSIC",
    theme: "LIGHT",
    fields: [
      { label: "Full name", type: "SHORT_TEXT", required: true },
      { label: "Email", type: "EMAIL", required: true },
      { label: "Phone number", type: "SHORT_TEXT", required: false },
      {
        label: "Availability",
        type: "MULTIPLE_CHOICE",
        options: ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"],
        required: true,
      },
      { label: "Why do you want to volunteer with us?", type: "PARAGRAPH", required: true },
      { label: "Relevant experience", type: "PARAGRAPH", required: false },
    ],
  },
  {
    id: "event-rsvp",
    label: "Event RSVP",
    description: "Track attendance for an event",
    color: "var(--color-orange)",
    title: "Event RSVP",
    slug: "event-rsvp",
    formDescription: "Let us know if you'll be joining us.",
    accentColor: "#f49423",
    layout: "BOLD",
    theme: "LIGHT",
    fields: [
      { label: "Full name", type: "SHORT_TEXT", required: true },
      { label: "Email", type: "EMAIL", required: true },
      { label: "Will you attend?", type: "MULTIPLE_CHOICE", options: ["Yes", "No", "Maybe"], required: true },
      { label: "Number of guests", type: "NUMBER", required: false },
      { label: "Dietary restrictions", type: "SHORT_TEXT", required: false },
    ],
  },
  {
    id: "contact",
    label: "Contact form",
    description: "General inquiries and messages",
    color: "var(--color-red)",
    title: "Contact Us",
    slug: "contact",
    formDescription: "Have a question? Send us a message and we'll get back to you.",
    accentColor: "#e5262a",
    layout: "MINIMAL",
    theme: "LIGHT",
    fields: [
      { label: "Full name", type: "SHORT_TEXT", required: true },
      { label: "Email", type: "EMAIL", required: true },
      { label: "Subject", type: "SHORT_TEXT", required: true },
      { label: "Message", type: "PARAGRAPH", required: true },
    ],
  },
];
