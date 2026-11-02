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
  /** Opportunity type on /apply */
  category?: string;
  accentColor: string;
  layout: FormLayout;
  theme: FormTheme;
  fields: FormTemplateField[];
};

// One per opportunity type; events and internships have no application form
export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "event",
    category: "event",
    label: "Event",
    description: "Festivals, competitions, talks",
    color: "var(--color-orange)",
    title: "",
    slug: "",
    formDescription: "",
    accentColor: "#f49423",
    layout: "BOLD",
    theme: "LIGHT",
    fields: [],
  },
  {
    id: "workshop",
    category: "workshop",
    label: "Workshop",
    description: "Hands-on sessions people sign up for",
    color: "var(--color-blue)",
    title: "",
    slug: "",
    formDescription: "",
    accentColor: "#2c80c2",
    layout: "CLASSIC",
    theme: "LIGHT",
    fields: [
      { label: "Full name", type: "SHORT_TEXT", required: true },
      { label: "Email", type: "EMAIL", required: true },
      { label: "Phone number", type: "SHORT_TEXT", required: false },
      { label: "School or organization", type: "SHORT_TEXT", required: false },
    ],
  },
  {
    id: "volunteer",
    category: "volunteer",
    label: "Volunteer",
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
    id: "internship",
    category: "internship",
    label: "Internship",
    description: "Internship roles and details",
    color: "var(--color-red)",
    title: "",
    slug: "",
    formDescription: "",
    accentColor: "#e5262a",
    layout: "CLASSIC",
    theme: "LIGHT",
    fields: [],
  },
];
