// Child Protection Policy STEMEOC_P001 v3.0, from public/docs/child-protection-policy.pdf. English only.

export type PolicyBlock =
  | { p: string }
  | { list: readonly string[] }
  | { defs: readonly (readonly [string, string])[] };

export type PolicySection = { id: string; num: string; title: string; sub?: boolean; blocks: readonly PolicyBlock[] };

export const POLICY_META = {
  code: "STEMEOC_P001 v3.0",
  effective: "August 2024",
  review: "August 2026",
  approvedBy: "Senior Management of STEMEOC (the Director and the Vice Chairperson)",
  signedBy: "Mrs. Eang Nithijounie Dene, Executive Director",
  pdf: "/docs/child-protection-policy.pdf",
};

export const POLICY_SECTIONS: readonly PolicySection[] = [
  {
    id: "introduction",
    num: "1",
    title: "Introduction",
    blocks: [
      {
        p: "STEM Education Organization for Cambodia (STEMEOC) is based in Phnom Penh and is a registered local NGO since 2016. Our mission is to re-invigorate the interest of Cambodia's next generation in Science, Technology, Engineering and Mathematics (STEM) by developing a passion for STEM careers at a young age. We offer innovative and fun programs, festivals, exhibitions and workshops for young students of Cambodia. Our work caters to Primary, Secondary and University students.",
      },
      {
        p: "STEMEOC is fully committed to Child Protection and has a zero tolerance approach towards abuse or exploitation of any kind. We believe that every child has the right to be protected and all adults have a shared responsibility to prevent child abuse and exploitation.",
      },
      {
        p: "This Child Protection Policy outlines our commitment to providing children who participate in STEMEOC activities with the safest possible environment. It also includes the expectations of all STEMEOC staff in the management of child protection risks and lays out the steps that will be taken against any STEMEOC staff who breach the code of conduct contained herein.",
      },
      {
        p: "STEMEOC takes seriously our responsibility to promote child safe practices. We will take positive action towards preventing the employment of any individual who has been identified as a risk to children and will take stringent measures against any STEMEOC staff who abuses a child.",
      },
      {
        p: "All STEMEOC staff, paid or unpaid, and including volunteers and contractors, are bound by STEMEOC's Code of Conduct and policies. It is intended that this policy will set a minimum standard for all STEMEOC staff and their commitment will be evidenced through signing this policy along with the 'STEMEOC Policy Commitment Statement'.",
      },
    ],
  },
  {
    id: "goals",
    num: "1.1",
    title: "Goals",
    sub: true,
    blocks: [
      {
        p: "The overall goal of this policy is the effective protection of all children participating in STEMEOC activities from abuse of all kinds.",
      },
    ],
  },
  {
    id: "objectives",
    num: "1.2",
    title: "Objectives",
    sub: true,
    blocks: [
      {
        p: "The objective of this policy is to provide a practical guide to prevent child abuse at any STEMEOC activities and to set-out a range of strategies that will be implemented by all STEMEOC staff (including volunteers, partners, organizations and contractors). It also represents a statement of commitment by the STEMEOC and its staff to strictly abide by the principles and guidelines contained herein.",
      },
    ],
  },
  {
    id: "principles",
    num: "1.3",
    title: "Principles",
    sub: true,
    blocks: [
      { p: "This policy is informed by a set of principles that are derived from UNCRC and include:" },
      {
        defs: [
          [
            "Zero tolerance of child exploitation and abuse",
            "Child abuse is not tolerated by STEMEOC. STEMEOC takes an active approach to risk management and ensures that its staff are selected, trained and obligated accordingly. STEMEOC will not knowingly employ or use the services of anyone known or likely to pose an unacceptable risk to children.",
          ],
          [
            "Management of child protection risk",
            "While it is not possible to eliminate all risk of child abuse, sound and active management can minimize the likelihood or incidence of child abuse.",
          ],
          [
            "Sharing responsibility for child protection",
            "STEMEOC recognizes its legal and moral accountability and the accountability of all individuals concerned for child protection. It regards child protection as the responsibility of all STEMEOC staff at all levels and requires the active support and cooperation of all involved with the organization, including employees, paid or unpaid, contractors, volunteers, visitors, supporters and sponsors.",
          ],
          [
            "Recognition of the best interests of the child",
            "STEMEOC places the interests of the child as its highest priority. Their physical and emotional security and welfare, along with the development of their abilities are its major concern and their protection will always be its highest value.",
          ],
        ],
      },
    ],
  },
  {
    id: "scope",
    num: "1.4",
    title: "Scope",
    sub: true,
    blocks: [
      { p: "This policy applies to:" },
      {
        list: [
          "STEMEOC Board of Directors",
          "All STEMEOC staff, paid or unpaid",
          "All volunteers (both national and international) who participate in STEMEOC activities",
          "All contractors or consultants involved in STEMEOC activities",
        ],
      },
    ],
  },
  {
    id: "definitions",
    num: "1.5",
    title: "Definitions",
    sub: true,
    blocks: [
      {
        defs: [
          [
            "Bullying",
            "Bullying is the inappropriate use of power by an individual or group, with intent to injure either physically or emotionally. It is usually deliberate and repetitive. The bullying may be physical or psychological (verbal and non-verbal).",
          ],
          ["Child Abuse", "Child abuse includes physical, sexual, emotional, neglect and bullying."],
          [
            "Child exploitation",
            "Using children for profit, labor, sexual benefit, or for other personal or financial advantage. Includes producing, obtaining or distributing child exploitation material.",
          ],
          ["Child/children", "Any human being up to the age of 18."],
          [
            "Contact with children",
            "Working on an activity or in a position that involves or may involve contact with children, either under the position description or due to the nature of the work (also refer to Working with children definition).",
          ],
          ["Emotional abuse", "Verbal or other acts towards a child which can damage a child's self-esteem or confidence."],
          [
            "Grooming",
            "Refers to behavior that makes it easier for an offender to procure a child for sexual activity. For example, an offender might build a relationship of trust with the child, and then seek to sexualize that relationship (for example by encouraging romantic feelings, or exposing the child to sexual concepts through pornography).",
          ],
          [
            "Harm",
            "Any detrimental effect on a child's physical, psychological or emotional wellbeing. Harm may be caused by physical, or emotional abuse, neglect, and/or sexual abuse or exploitation whether intended or unintended.",
          ],
          [
            "Neglect",
            "The failure to provide a child (where they are in a position to do so) with the conditions that are culturally accepted as being essential for this development and wellbeing.",
          ],
          [
            "Online Grooming",
            "The act of sending an electronic message to a child with the intention of procuring the recipient to engage in or submit to sexual activity with another person, including but not necessarily the sender; or of sending an electronic message with indecent content to a child.",
          ],
          ["Partner Organization", "Any organization with which STEMEOC partners with in the hosting of a STEMEOC event/activity."],
          [
            "Physical abuse",
            "The use of physical force against a child (including hitting, shaking, punching, kicking, burning and poisoning) that causes harm to a child.",
          ],
          [
            "Sexual abuse",
            "Use of children for sexual benefit by an adult or older child or teenager, including using children in child pornography.",
          ],
          ["STEMEOC", "The organization entitled 'STEM Education Organization for Cambodia'."],
          [
            "STEMEOC Activities",
            "Any activity (including festivals, meet-ups, workshops, talks, contests, seminars) organized by STEMEOC.",
          ],
          [
            "STEMEOC Staff",
            "Any employee of STEMEOC including paid and unpaid, volunteers (national and international) and contractors.",
          ],
          [
            "Working with children",
            "Working with children means being engaged in an activity with a child where the contact would reasonably be expected as a normal part of the activity and the contact is not incidental to the activity. Working includes volunteering or other unpaid works (also refer to Contact with children definition).",
          ],
        ],
      },
    ],
  },
  {
    id: "legislation",
    num: "1.6",
    title: "Governing Legislation",
    sub: true,
    blocks: [
      { p: "STEMEOC's Child Protection Policy is compliant with international primary child protection legislation as expressed in the:" },
      {
        list: [
          "United Nations Convention on the Rights of the Child (Cambodia acceded 1992)",
          "Resolution adopted by the General Assembly; Guidelines for the Alternative Care of Children [on the report of the Third Committee (A/64/434)] 64/142",
        ],
      },
    ],
  },
  {
    id: "responsibilities",
    num: "2",
    title: "Responsibilities and procedures",
    blocks: [],
  },
  {
    id: "recruitment",
    num: "2.1",
    title: "Recruitment Procedures",
    sub: true,
    blocks: [
      {
        p: "STEMEOC takes seriously our responsibility to promote child safe practices. STEMEOC will not knowingly permit any person to be employed or engaged as a volunteer if they have been identified as a risk to children.",
      },
      {
        p: "All job advertisements for STEMEOC will include the following message: 'STEMEOC is child safe and will ask all applicants to undergo our child safe recruitment procedures and sign our Child Protection Policy. All staff and volunteers working for STEMEOC must sign and agree to conform to the Child Protection Policy and Code of Conduct as a condition of employment/engagement with the organization.'",
      },
      { p: "In addition:" },
      {
        list: [
          "Applicants are required to provide documentation to prove their true identity. No candidate under the legal working age of 18 will be employed.",
          "For any roles that have contact with children, recruitment interviews will include behavioral-based interview questions.",
          "At least two verbal reference checks with referees will be conducted. Verbal referees cannot include partners, spouse, parents and/or other relatives. Referees will be asked whether they hold any concerns about the applicant, or if complaints were made about the applicant, in connection with working or having contact with children.",
          "All staff and volunteers are required to immediately disclose all charges, convictions and any other outcomes of an offence which occurred before or occurs during their association with STEMEOC that relate to child exploitation and abuse.",
          "New STEMEOC personnel may be required to provide an appropriate current police check (criminal record check).",
        ],
      },
      {
        p: "All successful candidates and existing representatives will be clearly informed of their contractual requirement to comply with this policy, and are required to sign and comply with STEMEOC's Child Protection Policy and Code of Conduct prior to commencing work.",
      },
    ],
  },
  {
    id: "training",
    num: "2.2",
    title: "Training",
    sub: true,
    blocks: [
      {
        p: "STEMEOC understands its responsibility to inform its staff and volunteers of its Child Protection Policy and Code of Conduct, including the Child Protection Reporting Process. All existing staff will be provided an awareness session on this policy and informed of any updates upon the review of this policy. All newly recruited staff and volunteers will be provided an awareness session of the details of this policy and informed of the details of our Code of Conduct. The Policy will be posted on our website and will be accessible by all.",
      },
    ],
  },
  {
    id: "review",
    num: "2.3",
    title: "Policy Review",
    sub: true,
    blocks: [
      {
        p: "STEMEOC understands the need for regular review of this policy and Code of Conduct and child protection reporting processes. A nominated STEMEOC representative (a member of Senior Management of STEMEOC) will undergo training periodically to ensure they are capable and competent to conduct these reviews thoroughly along with complaint handling and the reporting processes, to ensure alignment with changes in laws, policies and practices.",
      },
      {
        p: "This Child Protection Policy and the associated Code of Conduct shall be reviewed every two years by the aforementioned nominated STEMEOC representative. Only authorized personnel with approval from the aforementioned nominated STEMEOC representative can make changes to the policy or decisions regarding child protection. The policy will be reviewed and approved by the Senior Management of STEMEOC.",
      },
    ],
  },
  {
    id: "conduct",
    num: "2.4",
    title: "Conduct",
    sub: true,
    blocks: [
      {
        p: "Everyone who works with and engages with STEMEOC has a responsibility to ensure that children are protected. The responsibilities detailed below form our Code of Conduct and these responsibilities are mandatory for those who fall within the scope of the policy.",
      },
      {
        p: "STEMEOC does not dictate the belief and value system by which STEMEOC staff and volunteers conduct their personal lives. However, actions taken by them out of working hours that are seen to contradict this policy will be considered a violation of this policy. STEMEOC staff and volunteers are required to bear in mind the principles of this Child Protection Policy and heighten their awareness of how their behaviors may be perceived both at work and outside work.",
      },
      {
        p: "The following is a list of acceptable behaviors provided as a guide to all STEMEOC staff and volunteers. These guidelines represent a minimum standard. All STEMEOC staff and volunteers will:",
      },
      {
        list: [
          "Treat all children with respect regardless of distinguishing factors such as age, race, religion, sexuality, disability or other status",
          "Not behave towards children in any manner, physical or verbal, which is, or can be construed as inappropriate, harassing, abusive, provocative, demeaning or culturally inappropriate",
          "Not engage in any form of sexual activity or services, including paying for sexual services",
          "Wherever possible, ensure that another adult is present when working in the proximity of children",
          "While performing work duties, never invite unaccompanied children into their home, unless they are at immediate risk or harm",
          "While performing work duties (for example, when accompanying children on a trip), never sleep close to unsupervised children unless absolutely necessary",
          "Use any communications or recording technology or social media appropriately, and never to exploit, harass or put children at risk, or to access child pornography via any medium or from any source",
          "Communicate information regarding STEMEOC activities with children only through official mechanisms. This includes STEMEOC email addresses/social media accounts/phones or via STEMEOC social media platforms. In the case of a Closed Facebook Group where the use of personal profiles cannot be avoided then all care will be taken to abide by this policy.",
          "Refrain from sharing personal contact details/social media profiles with children participating in STEMEOC activities, or asking for such details from said children. Special exception is made for the case of a Closed Facebook Group where the use of personal profiles cannot be avoided then all care will be taken to abide by this policy.",
          "Not employ physical force or punishment on children",
          "Not use children for labor which places them at risk of injury or affects their development",
          "Respect national laws and policies relating to children",
          "Report any concern or allegation of child abuse or policy non-compliance as swiftly as possible and as set down in relevant procedures detailed within this document",
          "Disclose or report any charge, or conviction relating to a crime or offence against children",
          "Be aware of behavior and avoid any actions/behaviors that would be seen as child abuse",
          "Take seriously any complaint of child abuse, from whatever source and report any known breach of this code or of the Child Protection Policy, or any concerns relating to the safety of children to STEMEOC",
          "Refrain from any behavior that could be considered a form of 'grooming' including 'online grooming'",
          "Respect privacy for children when taking photos or using children's images, including obtaining consent from child, parent or guardian",
          "When planning a STEMEOC activity, dedicate time and attention to planning for the protection of all children participating in said activity by completing a risk assessment form",
        ],
      },
    ],
  },
  {
    id: "images",
    num: "2.5",
    title: "Use of child images and video",
    sub: true,
    blocks: [
      { p: "STEMEOC will at all times portray children in a respectful, appropriate and consensual way." },
      {
        list: [
          "A child will always be portrayed in a dignified and respectful manner and not in a vulnerable or submissive manner. Children should not be in a pose that could be seen as sexually suggestive.",
          "Images will be an honest representation of the context and content.",
          "Before photographing or filming a child for work related purposes, STEMEOC staff will assess and comply with local traditions or restrictions on reproducing personal images.",
          "When sending images electronically, file labels will not reveal identifying information about a child.",
          "Only authorized personnel, with approval from STEMEOC Senior Management (including the Deputy Director, the Vice Chairperson, or the nominated STEMEOC representative for Child Protection) have permission to take photos and/or post on social media/website.",
          "Images taken at STEMEOC activities will only be used for the promotion of STEMEOC activities and only on official websites and social media associated with our organization.",
        ],
      },
    ],
  },
  {
    id: "reporting",
    num: "2.6",
    title: "Incident Reporting",
    sub: true,
    blocks: [
      {
        p: "In the event of any incidents, comments, suspicions or concerns, the case must be immediately reported to the Deputy Director of STEMEOC, or the Governing Board Chair. All concerns, allegations of abuse must be reported within 24 hrs or as soon as practically possible. When there is a reasonable belief that harm to children occurred, or could occur, a report is mandatory and failure to do so is considered a violation of this policy.",
      },
      {
        p: "All cases of abuse will be investigated thoroughly. When responding to concerns or allegations of harm or abuse, the ultimate guiding principle will be the best interests and well-being of the child or children involved.",
      },
      {
        p: "A child reporting concerns or claiming to be the subject of abuse will be protected, taken seriously and treated with respect. He or she will be reassured that they are not to blame. He or she will never be treated with disbelief or in a manner that might cause shame or embarrassment. STEMEOC will immediately remove a child from an abusive environment, seek medical treatment for any injuries and make any necessary further referrals.",
      },
      {
        p: "All STEMEOC staff and volunteers will be made aware of the Child Protection Reporting Process (Annex 2 of the full policy). An investigation and a confidential report will be made in response to an allegation or concern, and in compliance with this Policy or within the context of country legislation.",
      },
      {
        p: "The Child Protection Representative will be responsible for the dissemination and investigation of all initial complaints, and with the assistance of the Senior Management, and the Board of Directors, will make an assessment on the allegation, and take appropriate action which can range from no-action, behavioral management, counseling, referring the complaint to local law enforcement/police and dismissal. An incident report form is included at Annex 1 of the full policy.",
      },
    ],
  },
  {
    id: "response",
    num: "2.7",
    title: "Response",
    sub: true,
    blocks: [
      { p: "Here are some guidelines for STEMEOC staff and volunteers on how best to respond if a child tells them they have been harmed." },
      {
        list: [
          "Try and keep calm and give the child your attention",
          "Let the child take his or her time",
          "Reassure the child that it is the right thing to tell",
          "Let the child use his or her own words to tell",
          "Don't make promises you can't keep",
          "Listen carefully and take note of any details",
          "Let the child know what you will do next",
          "Don't confront the person who has allegedly harmed the child (this can put yourself and the child in danger)",
        ],
      },
    ],
  },
  {
    id: "risk",
    num: "2.8",
    title: "Risk Review",
    sub: true,
    blocks: [
      {
        p: "STEMEOC recognizes and understands that STEMEOC activities may place participating children at risk of harm. STEMEOC is committed to reviewing these risks in the planning, and during the activities. For each existing and new activity, an official step of the planning process will be to list the possible risks that may cause harm and identifying and taking steps to reduce or remove these risks. The planning process of each activity will require formulation of a list of the child protection risks involved to enable identification of high risk activities.",
      },
      {
        p: "Following each STEMEOC activity we will include an opportunity for comment on the topic of Child Protection in our Feedback Survey. We will review the feedback and take action when appropriate.",
      },
    ],
  },
  {
    id: "breach",
    num: "2.9",
    title: "Breach/Violation of this Child Protection Policy",
    sub: true,
    blocks: [
      {
        p: "All STEMEOC staff, paid or unpaid, and including volunteers and contractors, are bound by STEMEOC's Child Protection Policy and Code of Conduct. It is intended that this policy will set a minimum standard for all STEMEOC staff and their commitment will be evidenced through signing this policy.",
      },
      {
        p: "STEMEOC staff and volunteers can be suspended or transferred to other duties if they are under investigation, or dismissed if it is found out that they have breached the Child Protection Policy/Code of Conduct.",
      },
    ],
  },
  {
    id: "code-of-conduct",
    num: "3",
    title: "Child Protection Code of Conduct",
    blocks: [
      {
        p: "Every staff member and volunteer signs the Code of Conduct before working with STEMEOC. It repeats the commitments in section 2.4 and 2.5. The signing form, Statement of Compliance, incident report form, reporting process and risk assessment form are in the full policy PDF.",
      },
    ],
  },
];
