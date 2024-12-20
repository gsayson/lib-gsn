import {useReducer} from "react";

// express intent
export type LGDLevel = string;
export type LGDDocType = string;
export type LGDSubject = string;

export type LGDUnification = {
  search?: string;
  level?: LGDLevel,
  docType?: LGDDocType,
  subject?: LGDSubject,
}

export type LGDPReducerAction = {
  actionType: "search" | "level" | "doc-type" | "subject",
  update: string | LGDLevel | LGDSubject | LGDDocType
};

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