import {useReducer} from "react";

// express intent
export type LGDLevel = string;
export type LGDDocType = string;
export type LGDSubject = string;

export interface LGDUnification {
  search?: string,
  level?: LGDLevel,
  docType?: LGDDocType,
  subject?: LGDSubject,
}

export type LGDPReducerAction = {
  actionType: "search" | "level" | "doc-type" | "subject",
  update?: string | LGDLevel | LGDSubject | LGDDocType
};

// Please ensure that you do not send this over JSON!
export interface LibGSNIndex {
  categories: {
    name: string,
    key: string,
    subjects: {
      name: string,
      code: string[]
    }[]
  }[],
  doctype: {
    name: string,
    code: number
  }[],
}

export interface LibGSNShadow {
  doc_code: string, // not following JS conventions, but the db
  name: string,
  year: number,
  subject: string,
  pointer: string,
  doc_type: number,
  category: string,
  last_updated: Date,
  desc: string,
}

function lgdReducer(state: LGDUnification, {actionType, update}: LGDPReducerAction): LGDUnification {
  switch(actionType) {
    case "search": {
      return {
        search: update,
        level: state.level,
        docType: state.docType,
        subject: state.subject,
      }
    }
    case "level": {
      return {
        search: state.search,
        level: update as LGDLevel,
        docType: state.docType,
        subject: state.subject,
      }
    }
    case "doc-type": {
      return {
        search: state.search,
        level: state.level,
        docType: update as LGDDocType,
        subject: state.subject,
      }
    }
    case "subject": {
      return {
        search: state.search,
        level: state.level,
        docType: state.docType,
        subject: update as LGDSubject,
      }
    }
  }
}

export function useDDReducer() {
  return useReducer(lgdReducer, {
    search: undefined,
    level: undefined,
    docType: undefined,
    subject: undefined
  } as LGDUnification);
}

export function resolveDocTypeNumerical(numeric: number, index: LibGSNIndex): string {
  return index.doctype.find((c) => c.code == numeric)?.name!;
}

export function resolveDocTypeName(name: string, index: LibGSNIndex): number {
  return index.doctype.find((c) => c.name == name)?.code!;
}

export function resolveCategoryKey(key: string, index: LibGSNIndex): string {
  return index.categories.find((c) => c.key == key)?.name!
}

export function resolveCategoryName(name: string, index: LibGSNIndex): string {
  return index.categories.find((c) => c.name == name)?.key!
}

