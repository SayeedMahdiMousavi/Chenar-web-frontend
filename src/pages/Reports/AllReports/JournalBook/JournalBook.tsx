import React from "react";
import JournalBookTable from "./JournalBookTable";
import { useTranslation } from "react-i18next";
import ReportBody from "../../ReportBody";
import {
  JOURNAL_LIST,
  JOURNAL_RESULT_LIST,
} from "../../../../constants/routes";

interface IProps {
  backText: string;
  backUrl: string;
  place: string;
}
export const journalUrl = JOURNAL_LIST;
export const journalResultUrl = JOURNAL_RESULT_LIST;
const JournalBook: React.FC<IProps> = (props) => {
  const { t } = useTranslation();

  return (
    <ReportBody
      title={t("Reports.Journal_book")}
      type="financial"
      table={
        <JournalBookTable
          resultUrl={journalResultUrl}
          baseUrl={journalUrl}
          place={props.place}
        />
      }
    />
  );
};

export default JournalBook;
