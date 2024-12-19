export type LGDLevel = "GCE Ordinary Level" | "GCE Advanced Level";
export type LGDDocType = "Exam Papers" | "Notes & Supplements";

export enum LGDSubjectA {
  FM = "Further Mathematics",
  M2 = "Mathematics 2",
  M3 = "Mathematics 3",
  EC = "Economics",
}

export enum LGDSubjectO {
  SS = "Social Studies",
  HS = "History",
  AM = "Additional Mathematics",
  EM = "Elementary Mathematics",
  EL = "English Language",
  CC = "Chemistry",
  PP = "Physics"
}

export type LGDSubject = LGDSubjectA | LGDSubjectO;

export type LGDUnification = {
  level?: LGDLevel,
  docType?: LGDDocType,
  subject?: LGDSubject,
}