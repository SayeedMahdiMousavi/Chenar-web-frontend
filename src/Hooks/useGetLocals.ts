import { useTranslation } from "react-i18next";
//@ts-ignore
import Pagination from "rc-pagination/lib/locale/fa_IR";
import enUS from "antd/es/date-picker/locale/en_US";
import faIR from "antd/es/time-picker/locale/fa_IR";
import faIRCalendar from "antd/es/calendar/locale/fa_IR";

export default function useGetLocals() {
  var typeTemplate = "${label} is not a valid ${type}";

  const { t } = useTranslation();
  const locals = {
    locale: "fa",
    Pagination,
    DatePicker: enUS,
    TimePicker: faIR, 
    Calendar: faIRCalendar, 
    global: {
      placeholder: t("Antd.Global_placeholder"),
    },
    Table: {
      filterTitle: t("Antd.Table_filter_title"),
      filterConfirm: t("Antd.Table_filter_confirm"),
      filterReset: t("Antd.Table_filter_reset"),
      filterEmptyText: t("Antd.Table_filter_empty_text"),
      filterCheckall: t("Antd.Table_filter_check_all"),
      filterSearchPlaceholder: t("Antd.Table_filter_search_placeholder"),
      emptyText: t("Antd.Table_empty_text"),
      selectAll: t("Antd.Table_select_all"),
      selectInvert: t("Antd.Table_select_invert"),
      selectNone: t("Antd.Table_select_none"),
      selectionAll: t("Antd.Table_selection_all"),
      sortTitle: t("Antd.Table_sort_title"),
      expand: t("Antd.Table_expand"),
      collapse: t("Antd.Table_collapse"),
      triggerDesc: t("Antd.Descend"),
      triggerAsc: t("Antd.Ascend"),
      cancelSort: t("Antd.Cancel_sort"),
    },
    Modal: {
      okText: t("Antd.Modal_ok_text"),
      cancelText: t("Antd.Modal_cancel_text"),
      justOkText: t("Antd.Modal_just_ok__text"),
    },
    Popconfirm: {
      okText: t("Antd.Popconfirm_ok__text"),
      cancelText: t("Antd.Popconfirm_cancel__text"),
    },
    Transfer: {
      titles: ["", ""],
      searchPlaceholder: "Search here",
      itemUnit: "item",
      itemsUnit: "items",
      remove: "Remove",
      selectCurrent: "Select current page",
      removeCurrent: "Remove current page",
      selectAll: "Select all data",
      removeAll: "Remove all data",
      selectInvert: "Invert current page",
    },
    Upload: {
      uploading: t("Antd.Upload_uploading"),
      removeFile: t("Antd.Upload_remove_file"),
      uploadError: t("Antd.Upload_error"),
      previewFile: t("Antd.Upload_preview"),
      downloadFile: t("Antd.Upload_download"),
    },
    Empty: {
      description: t("Antd.Empty_description"),
    },
    Icon: {
      icon: "icon",
    },
    Text: {
      edit: t("Antd.Text_edit"),
      copy: t("Antd.Text_copy"),
      copied: t("Antd.Text_copied"),
      expand: t("Antd.Text_expand"),
    },
    PageHeader: {
      back: "Back",
    },
    Form: {
      optional: t("Antd.Form_optional"),
      defaultValidateMessages: {
        default: t("Antd.Form_default", { label: "${label}" }),
        required: t("Antd.Form_required", { label: "${label}" }),
        enum: "${label} must be one of [${enum}]",
        whitespace: t("Antd.Form_whitespace", { label: "${label}" }),
        date: {
          format: t("Antd.Form_date_format", { label: "${label}" }),
          parse: t("Antd.Form_date_parse", { label: "${label}" }),
          invalid: t("Antd.Form_date_invalid", { label: "${label}" }),
        },
        types: {
          string: typeTemplate,
          method: typeTemplate,
          array: typeTemplate,
          object: typeTemplate,
          number: typeTemplate,
          date: typeTemplate,
          boolean: typeTemplate,
          integer: typeTemplate,
          float: typeTemplate,
          regexp: typeTemplate,
          email: typeTemplate,
          url: typeTemplate,
          hex: typeTemplate,
        },
        string: {
          len: t("Antd.Form_string_len", { label: "${label}", len: "${len}" }),
          min: t("Antd.Form_string_min", { label: "${label}", min: "${min}" }),
          max: t("Antd.Form_string_max", { label: "${label}", max: "${max}" }),
          range: t("Antd.Form_string_range", {
            label: "${label}",
            min: "${min}",
            max: "${max}",
          }),
        },
        number: {
          len: t("Antd.Form_number_len", { label: "${label}", len: "${len}" }),
          min: t("Antd.Form_number_min", { label: "${label}", min: "${min}" }),
          max: t("Antd.Form_number_max", { label: "${label}", max: "${max}" }),
          range: t("Antd.Form_number_range", {
            label: "${label}",
            min: "${min}",
            max: "${max}",
          }),
        },
        array: {
          len: t("Antd.Form_array_len", { label: "${label}", len: "${len}" }),
          min: t("Antd.Form_array_min", { label: "${label}", min: "${min}" }),
          max: t("Antd.Form_array_max", { label: "${label}", max: "${max}" }),
          range: t("Antd.Form_array_range", {
            label: "${label}",
            min: "${min}",
            max: "${max}",
          }),
        },
        pattern: {
          mismatch: t("Antd.Form_array_max", {
            label: "${label}",
            pattern: "${pattern}",
          }),
        },
      },
    },
    Image: {
      preview: "Preview",
    },
  };
  return locals;
}
