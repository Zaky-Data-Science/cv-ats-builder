/**
 * English dictionary.
 *
 * Typed as `Dictionary`, so TypeScript refuses to build whenever a key is
 * added to `id.ts` but not translated here. That check is the reason the
 * two files are allowed to be this long: nothing can silently fall back to
 * Indonesian text inside an English interface.
 */

import type { Dictionary } from "./id";

export const en: Dictionary = {
  common: {
    appName: "CV ATS Builder",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    close: "Close",
    back: "Back",
    next: "Next",
    loading: "Loading...",
    saving: "Saving...",
    saved: "Saved",
    error: "Something went wrong",
    tryAgain: "Try again",
    optional: "you can leave this blank",
    recommended: "recommended",
    yes: "Yes",
    no: "No",
    of: "of",
    page: "Page",
    pages: "pages",
    example: "Example",
  },

  form: {
    personalTitle: "Personal details",
    personalHint:
      "The very top of the CV. Name, contact details and profile links - the first thing screening software goes looking for.",

    fullName: "Full name",
    fullNameHint: "No academic titles in front. Post-nominals may go after the name.",
    fullNamePh: "Budi Santoso",
    headline: "Target job title",
    headlineHint: "Match the wording of the job you are applying for.",
    headlinePh: "Frontend Developer",
    email: "Email",
    emailHint: "Use a professional address you actually check.",
    emailPh: "budi.santoso@email.com",
    phone: "Phone number",
    phoneHint: "Include the country code so it reads as an international number.",
    phonePh: "+62 812-3456-7890",
    city: "City",
    cityPh: "Bontang",
    province: "Province / State",
    provincePh: "East Kalimantan",
    country: "Country",
    countryPh: "Indonesia",
    linkedin: "LinkedIn",
    linkedinPh: "linkedin.com/in/budisantoso",
    portfolio: "Portfolio / website",
    portfolioPh: "budisantoso.dev",
    github: "GitHub",
    githubPh: "github.com/budisantoso",
    showPhoto: "Show a photo",
    showPhotoHint:
      "Best left off. Screening software cannot see images, and the layout around a photo often scrambles the text beside it. Only switch it on if the job ad actually asks for a photo.",
    photo: "Photo",
    photoHint:
      "JPG, PNG, or WebP. Photos from a phone camera are shrunk automatically, so a large file is fine - what gets stored is at most 1 MB. A plain background gives the best result.",
    photoChoose: "Choose a photo file",
    photoReplace: "Replace photo",
    photoRemove: "Remove photo",
    photoWorking: "Processing...",
    photoZoom: "Photo zoom",
    photoZoomIn: "Zoom in",
    photoZoomOut: "Zoom out",
    photoReset: "Put it back how it was",
    photoDragHint:
      "Drag the photo to choose which part shows. The frame stays 3:4, so your CV layout never shifts.",
    photoZoomHint:
      "Zoom in first if you want to reposition it. The frame stays 3:4, so your CV layout never shifts.",
    photoLinked:
      "This photo is still an image link from a CV built earlier. The link keeps working; choose a file if you would rather store the photo inside the CV itself.",
    photoErrorType: "That file is not an image. Choose a JPG, PNG, or WebP file.",
    photoErrorRead:
      "The image could not be read. The file may be damaged - try another one.",
    photoErrorSourceTooBig:
      "That file is over 12 MB, and something that large can lock the browser up before it finishes processing. Pick an ordinary photo from your gallery - a passport photo is never that big.",
    photoErrorTooBig:
      "It was compressed as far as it goes and still comes out over 1 MB, so it cannot be stored. That usually happens with a very busy background; a plain one is far lighter.",

    summary: "Professional summary",
    summaryHint:
      "A simple formula: role + years of experience + core skills + one achievement with a number. Avoid first-person pronouns.",
    summaryPh:
      "Frontend Developer with 4 years building production web applications in React and TypeScript. Cut homepage load time by 45% and led a team of 4 through a migration to a shared component architecture.",
    summaryWords: "words",
    summaryIdeal: "(ideal)",
    summaryIdealRange: "(ideal: 30-120 words)",

    experienceLabel: "Experience",
    experienceEmpty:
      "No work experience yet. Just graduated? Fill in Projects and Organisations instead - both count just as much as evidence of what you can do.",
    experienceAdd: "Add work experience",
    jobTitle: "Job title",
    jobTitleHint: "As it appears on your appointment letter.",
    jobTitlePh: "Frontend Developer",
    company: "Company name",
    companyPh: "PT Digital Nusantara",
    workCityPh: "South Jakarta",
    employmentType: "Employment type",
    employmentUnset: "Not specified",
    stillWorking: "I still work here",

    educationLabel: "Education",
    educationAdd: "Add education",
    degree: "Level / degree",
    degreeHint: "For example: Bachelor, Diploma, High School.",
    degreePh: "Bachelor of Computer Science",
    fieldOfStudy: "Field of study",
    fieldOfStudyPh: "Informatics Engineering",
    institution: "Institution",
    institutionPh: "Mulawarman University",
    eduCityPh: "Samarinda",
    stillStudying: "I am still studying",
    gpa: "GPA",
    gpaHint: "Include it when it is 3.00 or above. Leave it blank otherwise.",
    gpaPh: "3.62",
    maxGpa: "GPA scale",
    maxGpaPh: "4.00",
    graduated: "Graduated",

    skillAdd: "Add skill",
    skillNamePh: "React",
    skillCategory: "Skill category",
    skillRemove: "Remove skill",
    skillCalloutLead: "Write the skill exactly as it is named -",
    skillCalloutGood: "JavaScript",
    skillCalloutMid: ", not",
    skillCalloutBad: "JavaScript (advanced)",
    skillCalloutTail:
      ". Screening software matches word for word, exactly as written - anything added in brackets simply stops it matching.",

    projectLabel: "Project",
    projectAdd: "Add project",
    projectName: "Project name",
    projectNamePh: "SIMAK PWA",
    projectRole: "Your role",
    projectRolePh: "Lead developer",
    projectUrl: "Link",
    projectUrlHint: "Repository, live demo, or where the project was published.",
    projectUrlPh: "github.com/budisantoso/simak-pwa",

    certificationLabel: "Certificate",
    certificationAdd: "Add certificate",
    certName: "Certificate name",
    certNamePh: "Meta Front-End Developer Professional Certificate",
    certIssuer: "Issuer",
    certIssuerPh: "Meta / Coursera",
    certIssueDate: "Issued",
    certExpiry: "Valid until",
    certExpiryHint: "Leave blank if it never expires.",
    certCredentialId: "Certificate number",
    certCredentialHint: "So a recruiter can check it is genuine.",
    certCredentialPh: "ABCD1234EFGH",
    certVerifyUrl: "Verification link",
    certVerifyPh: "coursera.org/verify/ABCD1234EFGH",

    organizationLabel: "Organisation",
    organizationAdd: "Add organisation",
    orgName: "Organisation name",
    orgNamePh: "Informatics Engineering Student Association",
    orgRole: "Position",
    orgRolePh: "Head of Research and Technology",
    stillActive: "Still active",

    awardLabel: "Award",
    awardAdd: "Add award",
    awardTitle: "Award name",
    awardTitleHint: "State the placing and the level of the competition.",
    awardTitlePh: "2nd place, Kaltim Digital Hackathon",
    awardIssuer: "Awarded by",
    awardIssuerPh: "East Kalimantan Communication and Informatics Office",
    awardDate: "Date",
    awardDescription: "Short description",
    awardDescriptionPh:
      "Built a prototype infrastructure-reporting app in 48 hours with a team of 3.",

    languageAdd: "Add language",
    languageNamePh: "English",
    languageLevel: "Proficiency",
    languageRemove: "Remove language",

    publicationLabel: "Publication",
    publicationAdd: "Add publication",
    pubTitle: "Title",
    pubTitlePh: "Applying Progressive Web Apps to an Academic Information System",
    pubPublisher: "Publisher / journal",
    pubPublisherPh: "Jurnal Informatika Mulawarman, Vol. 16 No. 2",
    pubDate: "Published",
    pubDoiPh: "10.30872/jim.v16i2.1234",
    pubUrl: "Link",
    pubUrlPh: "jurnal.unmul.ac.id/index.php/JIM/article/view/1234",

    customLabel: "Extra section",
    customAddSection: "Add a new section",
    customAddEntry: "Add an item",
    customRemoveEntry: "Remove this item",
    customSectionTitle: "Section heading",
    customSectionTitleHint:
      "Plain words, no emoji - screening software cannot read emoji.",
    customSectionTitlePh: "Training and workshops",
    customEntryTitle: "Title",
    customEntryTitlePh: "Introduction to Cyber Security",
    customEntrySubtitle: "Detail",
    customEntrySubtitlePh: "National Cyber and Crypto Agency - 24 contact hours",

    startDate: "From",
    endDate: "To",
    bulletsLabel: "Achievement bullets",
    bulletsHint:
      "Start with a verb, and name the number. Not \"responsible for reports\", but \"wrote 12 monthly reports, all on time\". This is what lifts your score more than anything else.",
    bulletsAdd: "Add bullet",
    bulletsRemove: "Remove bullet",
    bulletPh1:
      "Example: Rebuilt the checkout flow, lifting conversion from 2.1% to 3.4% within 6 months.",
    bulletPh2:
      "Example: Led a team of 4 through a 60-component migration, cutting feature delivery time by 30%.",
    bulletPh3:
      "Example: Automated the deployment process, reducing release time from 40 minutes to 6.",

    entryMoveUp: "Move up",
    entryMoveDown: "Move down",
    entryRemove: "Remove this item",
    entryRemoveConfirm: "Remove this item?",
    entryRemoveYes: "Yes, remove it",
    sectionMoveUp: "Move this section up",
    sectionMoveDown: "Move this section down",
  },

  guest: {
    metaTitle: "Build a CV without an account",
    metaDescription:
      "Build a CV that gets past screening software without signing up. It is stored in your own browser and downloads as PDF, Word, plain text, or a backup file.",
    ctaTry: "Try without an account",
    ctaTryHint: "Start right away - no sign-up, no email",
    loading: "Preparing the editor...",

    bannerTitle: "This CV lives only in this browser.",
    bannerBody:
      "Nothing is sent anywhere, which is why you need no account. But there is a catch: open it on another device, clear your browser data, or use a private window, and this CV goes with it. Download the files, or move it into an account if you want it kept for good.",
    savedLocal: "Saved in this browser",
    saveFailed:
      "The browser refused to save, usually because its storage is full. The photo is by far the largest thing in a CV, so removing it often settles it straight away. Your CV is still safe on screen - if that does not help, download the files now.",
    loadFromJson: "Open a backup file",
    loadHint:
      "Opens a backup file you saved from here before. Useful for keeping several versions of a CV as files of your own.",
    loadConfirm:
      "The CV now on screen will be replaced entirely by the contents of that file, and the old one cannot be brought back.",
    loadYes: "Replace with the file",
    loadFailed:
      "That file could not be read as a CV. Choose a backup file downloaded from this app.",
    loadTooNew:
      "That file was made by a newer version of the app. Reload this page first, then try again.",
    moveToAccount: "Move to an account",
    moveHint:
      "You will be asked to sign in or sign up first, and can then move this CV into that account.",

    importTitle: "There is a CV you built without an account",
    importBody:
      "It is still sitting in this browser. Move it now so it is kept for good in your account and reachable from any device.",
    importButton: "Move it into my account",
    importDismiss: "Not now",
    importDone: "The CV has been moved into your account.",
    importFailed: "The CV could not be moved. Please try again.",
  },

  editor: {
    back: "My CVs",
    backAria: "Back to my CVs",
    titleAria: "CV name",
    actionsMenu: "More options",
    undo: "Undo the last change",
    redo: "Redo that change",
    panelNav: "Switch panel",
    actionSampleLabel: "Fill with an example",
    actionSampleHint: "See what a finished CV looks like",
    actionAppearanceLabel: "Adjust the look",
    actionAppearanceHint: "Design, paper size, lettering, edge spacing",
    actionPdfLabel: "Download PDF",
    actionPdfHint: "This is the one you send to employers",
    actionWordLabel: "Download Word",
    actionWordHint: "When the job ad asks for a .docx file",
    actionTxtLabel: "Download plain text",
    actionTxtHint: "For copying into online application forms",
    actionJsonLabel: "Save a backup",
    actionJsonHint: "A backup file you can open again any time",
    btnSample: "Example",
    btnAppearance: "Appearance",
    btnPdf: "PDF",
    btnWord: "Word",
    btnText: "Text",
    btnJson: "Backup",
    btnTextTitle: "Plain text, for copying into online application forms",
    btnJsonTitle: "A backup file, so this CV can be opened again later",
    saveNotYet: "Not saved yet",
    saveAuto: "Saves automatically",
    untitled: "Unnamed CV",
    renameLabel: "CV name",
    appearance: "Appearance",
    fillSample: "Fill with sample",
    fillSampleConfirm:
      "Everything in this CV will be replaced with a complete worked example. Good for seeing what a finished CV looks like and where each box ends up - but anything you have typed will be lost.",
    fillSampleYes: "Yes, show me the example",
    matchJob: "Match against a job ad",
    moreActions: "More actions",
    print: "Print or save as PDF",
    downloadDocx: "Download Word (.docx)",
    downloadTxt: "Download text (.txt)",
    downloadJson: "Save a backup file",
    tabPreview: "See the result",
    tabScore: "CV score",
    paneForm: "Fill in",
    panePreview: "Result",
    paneScore: "Score",
    saveIdle: "No changes yet",
    saveDirty: "Something is not saved yet",
    saveSaving: "Saving...",
    saveSaved: "Saved",
    saveError: "Could not save",
    saveFailedTitle: "Could not save",
    saveFailedGeneric: "Your changes could not be saved.",
    saveFailedOffline:
      "The connection to the server has dropped. What you typed is still safe on screen - just do not close this page until it comes back.",
    sectionOrderHint:
      "Sections you skip never appear on the CV, so there is no need to fill them all in. To reorder them, use the arrows beside each heading.",
  },

  appearance: {
    drawerTitle: "Adjust how your CV looks",
    drawerHint: "The page beside it changes as you go",
    groupLook: "Design",
    groupText: "Text",
    groupPaper: "Paper and edge spacing",
    groupLanguage: "Language of the headings inside the CV",
    template: "CV design",
    templateWithPhoto: "With a photo",
    templateWithoutPhoto: "Without a photo",
    font: "Lettering",
    fontHint: "All five are safe - screening software can read every one.",
    fontSize: "Text size",
    lineHeight: "Space between lines",
    headingLanguage: "Language of the headings inside the CV",
    headingLanguageHint:
      "Decides whether your CV reads \"WORK EXPERIENCE\" or \"PENGALAMAN KERJA\". Nothing to do with the language this app is shown in.",
    accentColor: "Colour of rules and headings",
    photoWidth: "Photo size",
    margin: "Space around the edges",
    marginY: "Space at top and bottom",
    marginX: "Space at left and right",
    marginFollowTemplate: "following the design",
    marginReset: "Put it back how it was",
    marginHint:
      "Top and bottom are always equal, and apply to every page - not just the first. Below 10 mm some printers will clip the edges.",
    paperSize: "Paper size",
    photoUnsupported:
      "This design has no place for a photo. If the job ad asks for one, pick a design from the \"With a photo\" group.",
  },

  flow: {
    metaTitle: "Flow and Architecture",
    metaDescription:
      "User flow, architecture, data flow and development workflow diagrams for CV ATS Builder - also available as SVG and PNG image files.",
    title: "Flow and architecture",
    subtitle:
      "Four diagrams: how people use it, how the data moves, and how a code change reaches production. The diagrams on this page and the image files are generated from the same source data, so the two can never tell different stories.",
    downloadTitle: "Download as an image",
    downloadNote:
      "For dropping into a report or a slide deck. SVG stays sharp at any size; PNG is handled more reliably by word processors.",
    downloadSvg: "Download SVG",
    downloadPng: "Download PNG",
    legendTitle: "Shape legend",
    legendNote:
      "Each box states its own type in words rather than relying on colour alone - so the diagram still reads when printed in black and white, and when read aloud by a screen reader.",
  },

  home: {
    skipToContent: "Skip to main content",
    heroBadge: "100% Free • No Watermark • Saves Itself",
    heroTitleLine1: "You tell your story.",
    heroTitleLine2: "The ATS formatting",
    heroTitleLine3: "is on us",
    heroBody:
      "Plenty of employers filter applications through software that reads your CV automatically, and fancy formatting like two columns, tables, or text buried inside an image often comes out garbled. Do not let good experience get lost to that. Fill in our simple form, get a CV built to ATS conventions, and see your score straight away.",
    heroCtaNew: "Build my ATS CV now",
    heroCtaDashboard: "Back to my CVs",
    heroCtaCompare: "Check the CV I already have",
    statSections: "CV sections",
    statDimensions: "things we check",
    statTemplates: "designs to pick from",
    statFormats: "ways to download it",
    statsPrompt: "Tap a number to see what it means.",
    statSectionsWhy:
      "Personal details, summary, work experience, education, skills, projects, certificates, organisations, awards, languages, and publications. Anything you leave empty never shows up on the CV, so relax: you do not have to fill them all in.",
    statTemplatesWhy:
      "Ten different looks for the same content: some ruled and formal, some plain, two of them with a place for a photo. Switch whenever you like; your data does not change at all.",
    statDimensionsWhy:
      "Your CV is checked on five things: whether machines can read it, how complete it is, how well the sentences are written, how tidily it is laid out, and how closely it matches the job you are after.",
    statFormatsWhy:
      "PDF to send to employers, Word when the job ad asks for a .docx, plain text for pasting into online forms, and a backup file so this CV can be opened again later.",
    heroCaption: "A finished example, Classic design",
    heroBadgeScore: "CV score",
    heroBadgeGrade: "Grade A",
    heroBadgeSaved: "Saved automatically",

    pathsTitle: "2 solid ways to make sure your CV gets through",
    pathsBody:
      "Start from scratch, or take apart the CV you already have. Both are judged exactly the same way, so what your CV says actually gets read, instead of tripping over its own formatting.",
    pathBuildTitle: "Build a new CV, no fuss",
    pathBuildBody:
      "Just type into the boxes we give you, watch it change live on a virtual sheet of paper, push the score up, then download it as a PDF, a Word file, or plain text. That simple.",
    pathBuildCta: "Build my ATS CV now",
    pathCompareTitle: "Audit and compare your old CVs",
    pathCompareBody:
      "Getting ghosted by recruiters? Upload your old CV and let our checker take it apart. Compare up to 5 CVs side by side to see exactly where each one falls short and which is readiest to send. Your files are processed on your own device and never sent to our servers.",
    pathCompareCta: "Check my CV now",

    stepsTitle: "Just 4 steps between you and the interview",
    stepsBody:
      "Forget wrestling with margins and layout. Your job is to talk about what you have done; the technical side is ours to handle.",
    step1Title: "No blank page syndrome",
    step1Body:
      "No staring at an empty document wondering what to write. Every section (experience, education, skills) comes with short guidance and a real example already in the box.",
    step2Title: "A live preview that means it",
    step2Body:
      "Type on the left, see it on the right. The sheet matches real paper size, so you know exactly where your words will land once it is printed.",
    step3Title: "Push your CV score up",
    step3Body:
      "You get an analysis across 5 things that matter. We do not just hand you a number and leave. Every shortcoming comes with the steps to fix it.",
    step4Title: "Download, send, get ready",
    step4Body:
      "Export to PDF or Word in seconds. Everything stays in your account, ready to duplicate or rework for the next job you go after.",

    featuresTitle:
      "Leave the old way behind. Here is why this beats an ordinary Word template.",
    featuresBody:
      "An ordinary Word template only cares whether it looks pretty, and forgets whether software can read it. Here we keep your CV tidy for the recruiter and clean for the screening system.",
    feature1Title: "Not just a blank sheet",
    feature1Body:
      "11 blocks of information ready to fill in, with the underlying structure kept standard and tidy for you.",
    feature2Title: "No surprises when it prints",
    feature2Body:
      "Pick A4, Letter, Legal, or F4. The preview uses the real paper size. What you see on screen is what comes out of the printer.",
    feature3Title: "Saves itself, so you never panic",
    feature3Body:
      "Closed the tab by accident? Relax. Less than a second after you stop typing, the change is already saved. Close the browser, come back next month, carry on where you left off.",
    feature4Title: "Feedback that points somewhere",
    feature4Body:
      "Find your CV's weak spots through scoring across 5 dimensions. Click a suggestion and you land straight on the box that needs the edit.",
    feature5Title: "The secret weapon: job ad matching",
    feature5Body:
      "Paste in the job ad you are chasing, and we track down which important keywords your CV is still missing.",
    feature6Title: "Your data stays yours",
    feature6Body:
      "Download it, keep a backup, or delete the lot along with your account whenever you want, no questions asked.",

    templatesTitle: "10 elegant designs. Every one safe for machines to read.",
    templatesBody:
      "No quirky layouts that break the software. Every template is built clean, single column, with no hidden tables. Change the typeface, the line spacing, even where the photo sits. None of it touches your data.",
    templatesWithoutPhoto: "Without a photo",
    templatesWithPhoto: "With a photo",
    templatesPhotoNote:
      "Two designs with a photo are here because some Indonesian job ads still ask for one. If yours does not, pick a design without it, since screening software cannot see images anyway.",

    faqTitle: "Questions people ask",
    faqBody: "Including the things similar apps tend not to mention.",

    ctaTitle: "Build it once, use it again and again",
    ctaBody:
      "Your data lives in your account. For the next job, duplicate the CV you already have and change what needs changing, with no starting from a blank page again.",
    ctaButton: "Build my ATS CV now",
    ctaButtonSignedIn: "Open my CVs",
    ctaNote: "No cost, and no watermark on your CV.",
  },

  faq: [
    {
      q: "What is an ATS, and why should I care?",
      a: "An ATS is the software many employers use to collect and screen the applications they receive. It stands for Applicant Tracking System, but picture it like this: before a human ever sees your CV, a machine reads it first and pulls out the details: name, contact, experience, skills. That machine trips easily. Two-column CVs, tables, or text buried inside an image often come out as nonsense, and experience you genuinely have never reaches anyone. Not because you fall short, just because the file could not be read.",
    },
    {
      q: "So a CV from here is guaranteed to get through?",
      a: "No, and be wary of anyone who promises that. Every employer runs different screening software, and none of them publish how it works. What we can do, and do, is make sure your CV follows the rules that hold generally: one column, no tables, standard section headings, consistent dates, and text that really is text. A score here means \"it passes what we check\", not \"you will be hired\".",
    },
    {
      q: "How many pages should my CV be?",
      a: "One. That is the right length for almost every applicant, long-serving ones included. Recruiters glance at a CV in seconds, so anything on a second page is likely never read. Two pages only earn their keep when you have more than five years of experience and all of it speaks to the role. And if your CV has grown long, cut the content; do not shrink the font.",
    },
    {
      q: "Which paper size should I use?",
      a: "A4, and it is already selected for you, so there is nothing to change. A4 is the standard in Indonesia and almost everywhere else. Letter is only needed when you are applying to companies in the US or Canada. Legal and F4 only when an institution specifically asks for them.",
    },
    {
      q: "Free? Genuinely no hidden costs?",
      a: "Genuinely free. There is no paid tier, no limit on how many CVs you keep, nothing stamped onto what you download, and you will never be asked for card details.",
    },
    {
      q: "Will this app's name or logo end up on my CV?",
      a: "No. What you download holds only your own data: no logo, no stamp, no app name, no author name. That is your document, not our advertisement.",
    },
    {
      q: "The CVs I upload to be checked, are they kept on your server?",
      a: "No. Not merely unkept: they are never sent anywhere in the first place. They are read and scored right on your own phone or computer. Close the page and it is all gone. That is also why this feature needs no account.",
    },
    {
      q: "If I close my browser, do I lose my data?",
      a: "You do not, for CVs you build while signed in. Every change saves itself less than a second after you stop typing, so there is no Save button to forget. Sign in again from any device and your CV is still there. Want to be safer still? Download the backup file and keep it yourself.",
    },
    {
      q: "Why is a photo usually a bad idea on a CV?",
      a: "Because screening software cannot see images, and the layout around a photo often scrambles the order in which the surrounding text is read. In many countries photos are also avoided so that appearance does not colour the decision. Even so, two photo designs are here, because some Indonesian job ads do still ask, and you will be warned when you switch one on.",
    },
    {
      q: "Can I have more than one CV?",
      a: "Yes, and you should. The CVs that do best are the ones tailored to each job ad. Use the duplicate button, then change the summary and the order of your skills to match the role. Far quicker than starting over.",
    },
  ],

  compare: {
    metaTitle: "Check and Compare CVs",
    metaDescription:
      "Upload several CVs at once, see the strengths and weaknesses of each, and find out which one is most ready to send. Files are read on your own device and never leave it.",
    title: "Check your CV, or pit a few against each other",
    subtitle:
      "Upload one file to have it checked, or two to five to pit them against each other. Each gets a score, a list of strengths, and a list of weaknesses with how to fix them - then at the end we name the one most ready to send.",
    privacyTitle: "Your files are not sent anywhere.",
    privacyBody:
      "All the reading and scoring happens inside your own phone or computer. Not one file goes to our server or to any other service, and nothing is stored. Close this page and it is all gone.",
    dropTitle: "Drag your CV files here",
    dropSubtitle: "or tap to choose them from your device",
    dropFormats: "PDF, Word or text files - up to 5 files, 8 MB each",
    chooseFiles: "Choose files",
    fileRemove: "Take this file out",
    tooMany: "Five files at a time is the maximum.",
    jobToggleShow: "Got the job ad? Paste it here (you can skip this)",
    jobToggleHide: "Hide the job advertisement",
    jobHint:
      "Fill this in and every CV is also judged on how well it matches this particular job - which is usually what decides which one you should actually send.",
    analyze: "Check them now",
    analyzing: "Checking...",
    reset: "Start over",
    readingFile: "Reading",
    resultSingleTitle: "What we found",
    resultCompareTitle: "Comparison result",
    winnerLabel: "Most ready to send",
    rankLabel: "Rank",
    reasonsTitle: "Why this one wins",
    perDimensionTitle: "Side by side, point by point",
    dimensionColumn: "What is judged",
    bestColumn: "Highest",
    worstColumn: "Lowest",
    spreadColumn: "Gap",
    strengthsTitle: "Strengths",
    weaknessesTitle: "Weaknesses, and how to fix them",
    noWeakness: "Nothing came up against the rules we check.",
    noStrength: "Nothing to record as a strength in this file yet.",
    statPages: "Pages",
    statWords: "Words",
    statBullets: "Bullets",
    statColumns: "Columns",
    ctaTitle: "Want to fix it now?",
    ctaBody:
      "Rebuild your CV here: every box already holds a worked example, the score moves as you type, and the result downloads straight away as PDF, Word, or plain text.",
    ctaButton: "Build a CV free",
    addMoreSingle:
      "Got another version of your CV? Add it now - the two get pitted against each other and we name the one more ready to send.",
    addMoreMany:
      "Any more CVs? Just add them - up to five files at once.",
    addMoreButton: "Add another CV",
    errorTitle: "The file could not be read",
    limitsNote:
      "Honest about the limits: this reads the words, it does not understand what they mean. It can tell you whether machines can read your CV, but not whether your experience suits a particular job. That call stays yours.",
  },

  ats: {
    severityError: "Must be fixed",
    severityWarning: "Worth fixing",
    severityInfo: "If you want it even better",
    noCritical: "Nothing serious",
    mustFixCount: "things that must be fixed",
    suggestionCount: "suggestions",
    statPages: "Pages",
    statWords: "Word count",
    statActionVerbs: "Bullets starting with a verb",
    statQuantified: "Bullets that name a number",
    breakdownTitle: "Score breakdown",
    breakdownHint:
      "The final score comes from the five things below. They do not all count equally - the percentage beside each one shows how much it weighs.",
    weight: "counts for",
    notScored: "cannot be judged yet",
    keywordsTitle: "Important words from the job ad",
    keywordsMatchSuffix: "match",
    keywordsMissing: "Not in your CV yet",
    keywordsMatched: "Already in your CV",
    keywordsWarning:
      "Only add what you can genuinely back up. Pasting in skills you do not have will lift the number here - and come apart in the interview.",
    noFindings:
      "All clear. Your CV satisfies every rule we check.",
    openField: "Open the part that needs work",
    gradePrefix: "Grade",
    jobTitle: "Match against a job ad",
    jobIntro:
      "Paste in the job ad you are targeting. We pull out the words that matter and compare them against your CV.",
    jobLabel: "The job ad",
    jobPlaceholder:
      "Paste the whole job ad here - including the requirements and responsibilities. The more you paste, the better we can tell which words matter.",
    jobAnalyze: "See how well it matches",
    jobAnalyzing: "Working it out...",
    jobClear: "Clear",
    jobEmpty: "The job ad has not been pasted in yet.",
    pageTitle: "Match against a job ad",
    pageSubtitle:
      "Paste in the job ad, then see which of the words it asks for are still missing from your CV.",
    jobDescTitle: "The job ad",
    jobDescHint:
      "Copy the whole job ad - including the requirements and responsibilities - and paste it below. We pull out the words that matter ourselves.",
    wordsAnalyzed: "words checked.",
    saveToHistory: "Record this score",
    historyTitle: "Scores you have recorded",
    historyEmpty:
      "Nothing recorded yet. Press Record this score to save where you stand now - then improve your CV, record again, and watch your own progress.",
    historyBest: "Best score so far:",
    historySaved: "Score recorded.",
    historySaveFailed: "The score could not be recorded.",
    historyOffline: "The connection to the server has dropped.",
    backToEditor: "Back to editing my CV",
  },

  print: {
    backToEditor: "Back to editing my CV",
    printNow: "Print or Save as PDF",
    openPrintPage: "Open the print page",
    openPrintPageHint: "If the print window does not appear on its own",
  },

  preview: {
    label: "Result",
    viewLabel: "How to show it",
    viewPaged: "Cut into pages",
    viewContinuous: "One long scroll",
    typeHere: "Type straight on the page",
    typeHint:
      "Switch this on and type straight onto the paper, just like in Word. What you type flows back into the boxes on the left - both are the same CV, not two copies. For dates, just click the period: a month picker opens, so the wording stays tidy.",
    typeDateTitle: "Change the dates",
    typeDateStart: "Start",
    typeDateEnd: "End",
    typeDateSingle: "Month",
    typeDateCurrent: "Still going today",
    typeDateSave: "Save",
    typeDateCancel: "Cancel",
    typeAddEntry: "Add another one",
    typePageNote:
      "The page count is worked out again once typing mode is off. Empty boxes shown while you type are never printed.",
    typeForcesContinuous:
      "Not available while typing mode is on. The paged view cuts the document at page breaks, and the cursor cannot cross a cut.",
    viewPagedHint: "Just like Word - you can see exactly where each page breaks.",
    viewContinuousHint: "One long scroll with no breaks - easier to skim while you change things.",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomFit: "Fit to width",
    pageLabel: "Page",
    paperSize: "Paper size",
    paperRecommended: "safest choice",
    lengthIdeal: "Length is just right.",
    lengthAcceptable: "Still reasonable if you have more than five years of experience.",
    lengthTooLong: "Too long. Recruiters usually only glance at the first page.",
    onePageAdvice:
      "One page is enough for almost every applicant. If it runs long, cut the experience that does not speak to the role - do not shrink the lettering.",
  },

  prefs: {
    theme: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    language: "Language",
    languageToggleLabel: "Change interface language",
  },

  nav: {
    home: "Home",
    guide: "Guide",
    about: "About",
    flowNav: "Flow",
    compare: "Check My CV",
    dashboard: "My CVs",
    login: "Sign in",
    register: "Sign up free",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main",
    mobileNav: "Main (mobile)",
    settingsGroup: "Display",
    breadcrumb: "You are here",
    backHome: "Back to home",
    backDashboard: "Back to my CVs",
    homeAria: "home",
  },

  app: {
    settings: "Settings",
    signOut: "Sign out",
    user: "User",
  },

  dashboard: {
    title: "My CVs",
    subtitleEmpty:
      "Nothing here yet. Start from the example so you can see what a finished CV looks like.",
    subtitleCount: "CVs saved. Everything saves itself - there is no Save button to press.",
    importJson: "Open a backup file",
    startFromSample: "Start from an example",
    createNew: "Create a CV",
    startBlank: "Start from a blank page",
    emptyTitle: "This account has no CVs yet",
    emptyBodyLead: "Suggestion: choose",
    emptyBodyTail:
      ". The CV arrives filled with a complete example, so you can see where every box ends up - then simply type over it with your own details.",
    nameEmpty: "Name not filled in",
    changedAt: "Edited",
    edit: "Open and edit",
    renameTitle: "Rename",
    duplicateTitle: "Duplicate",
    deleteTitle: "Delete",
    deleteConfirmLead: "Delete",
    deleteConfirmTail: "? Everything in it goes too, and it cannot be brought back.",
    deleteYes: "Yes, delete it",
    tipsLabel: "Tip:",
    tips:
      "applying for a different role? Press duplicate, then change the summary and the order of your skills. A CV tailored to one job ad almost always matches far better.",
    errorGeneric: "Something went wrong. Please try again.",
    errorOffline: "The connection to the server has dropped.",
    justNow: "just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
  },

  settings: {
    title: "Account settings",
    savedCount: "CVs saved in this account.",
    identityTitle: "Identity",
    emailLabel: "Email",
    emailLocked: "The email address cannot be swapped for another.",
    nameLabel: "Display name",
    saveName: "Save name",
    passwordChangeTitle: "Change password",
    passwordCreateTitle: "Create a password",
    passwordGoogleNote:
      "This account was made through Google, so it has no password yet. Set one now and you will have two ways in: the Google button, or your email and password.",
    passwordCurrent: "Current password",
    passwordNew: "New password",
    passwordHint: "At least 8 letters or numbers.",
    passwordSave: "Save password",
    dangerTitle: "Delete account",
    dangerBody:
      "Every CV and everything in it goes for good and cannot be recovered - not even by us. Download a backup file of each CV before you go on.",
    dangerStart: "I want to delete my account",
    dangerConfirmLabel: 'Type "DELETE ACCOUNT" to confirm',
    dangerConfirmHint:
      "This step is deliberately awkward, so it can never happen through a mis-click.",
    dangerConfirmWord: "DELETE ACCOUNT",
    dangerButton: "Delete my account",
    saveFailed: "Could not save.",
    deleteFailed: "Could not delete the account.",
    saved: "Your changes have been saved.",
    offline: "The connection to the server has dropped.",
  },

  auth: {
    loginTitle: "Sign in",
    loginSubtitle: "Pick up the CV you already saved.",
    registerTitle: "Sign up",
    registerSubtitle:
      "Free. Your CV saves itself and stays editable any time, from any device.",
    google: "Sign in with Google",
    divider: "OR",
    nameLabel: "Full name",
    namePh: "Budi Santoso",
    emailLabel: "Email",
    emailPh: "name@email.com",
    passwordLabel: "Password",
    passwordHint: "At least 8 letters or numbers.",
    submitLogin: "Sign in",
    submitRegister: "Create account",
    registeredNotice:
      "Your account is ready. Now sign in with the email and password you just chose.",
    signInFailed: "Sign-in failed. Give it one more try.",
    invalidCredentials: "That email or password is not right.",
    registerFailed: "Sign-up failed. Give it one more try.",
    sessionStale:
      "You are no longer signed in - the account recorded here cannot be found any more. You are being taken to the sign-in page.",
    forgotPassword: "Forgotten your password?",
    forgotTitle: "Forgotten password",
    forgotSubtitle:
      "Enter the email address on your account. We will send you a link for setting a new password.",
    forgotSubmit: "Send me the link",
    forgotFailed: "The link could not be sent. Give it one more try.",
    forgotOffline: "The connection to the server has dropped. Try again once it is back.",
    sentTitle: "Check your email",
    sentBody:
      "If that address is registered, a link for setting a new password is on its way. It works for 30 minutes, and only once.",
    sentSpam:
      "Nothing after a few minutes? Check your spam folder, and make sure the address you typed has no typo in it.",
    resetTitle: "Set a new password",
    resetSubtitle: "Type the new password twice, so a typo cannot slip through.",
    resetNew: "New password",
    resetConfirm: "Type it again",
    resetSubmit: "Save the new password",
    resetMismatch: "The two passwords do not match yet. Check them again.",
    resetFailed: "The password could not be changed. Give it one more try.",
    resetNoToken:
      "This page address carries no recovery link. Open the link from your email again - or ask for a new one.",
    resetDone: "Your password has been changed. Sign in with the new one.",
    backToLogin: "Back to sign in",
    forgotViaGoogle:
      "Email sending is not switched on for this installation. What you can do now: sign in with Google using the same email address, then set a new password on the Settings page. An account with a matching address is linked, not duplicated.",
    forgotNoGoogle:
      "Email sending is not switched on for this installation, and Google sign-in is off too. For now, an account with a forgotten password cannot be recovered on your own.",
    toRegister: "No account yet?",
    toRegisterLink: "Sign up free",
    toLogin: "Already have an account?",
    toLoginLink: "Sign in here",
  },

  legal: {
    updatedAt: "Last updated:",
    seeAlso: "See also",
    and: "and",
  },

  errors: {
    errorTitle: "Something went wrong",
    errorBody:
      "This page failed to show. Your CV is safe though - every change had already saved itself the moment you stopped typing.",
    errorCode: "Error code:",
    notFoundTitle: "There is no such page",
    notFoundBody:
      "The address you opened does not exist - or the CV it points to belongs to a different account than the one signed in now.",
    retry: "Try again",
    openDashboard: "Open my CVs",
    backHome: "Back to home",
    loading: "Loading page...",
  },

  /* Contact block. The footer and the About page both render it through one
     shared component, so the two can never drift apart. */
  contact: {
    heading: "Get in touch",
    purpose:
      "Spotted something wrong, got a suggestion, or stuck using the app? Do say.",
    expectation:
      "One person runs this, so a reply is not always quick. Every message does get read though.",
    emailLabel: "Email",
    waLabel: "WhatsApp",
    waAction: "Chat on WhatsApp",
    waAria: "Chat with the maintainer on WhatsApp",
    emailAria: "Email the maintainer",
  },

  footer: {
    pagesHeading: "Pages",
    authorHeading: "Built by",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    registerFree: "Sign up free",
    madeBy: "built by",
    rights: "All rights reserved.",
  },
};
