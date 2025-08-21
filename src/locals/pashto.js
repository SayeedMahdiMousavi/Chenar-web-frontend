// import Pagination from "rc-pagination/lib/locale/fa_IR";
// import DatePicker from "../../node_modules/";
// import TimePicker from "../time-picker/locale/fa_IR";
// import Calendar from "../calendar/locale/fa_IR";

const typeTemplate = "${label} د اعتبار وړ ${type} ندی";

export const pashtoLocals = {
  locale: "ps",
  // Pagination,
  // DatePicker,
  // TimePicker,
  // Calendar,
  global: {
    placeholder: "مهرباني وکړئ وټاکئ",
  },
  Table: {
    filterTitle: "د فلټر مینو",
    filterConfirm: "باوري",
    filterReset: "بیا تنظیم کړئ",
    filterEmptyText: "هیڅ فلټر نشته",
    filterCheckall: "ټول توکي غوره کړئ",
    filterSearchPlaceholder: "په فلټرونو کې لټون وکړئ",
    emptyText: "هیڅ ډاټا نشته",
    selectAll: "اوسنۍ پانه غوره کړئ",
    selectInvert: "په اوسني پانه کې انتخابونه بدل کړئ",
    selectNone: "ټول انتخابونه پاک کړئ",
    selectionAll: "ټول معلومات غوره کړئ",
    sortTitle: "ترتیب کړئ",
    expand: "قطار پراخ کړئ",
    collapse: "قطار ړنګ کړئ",
    triggerDesc: "د ښکته کیدو امر",
    triggerAsc: "پورته کېدونکی امر",
    cancelSort: "ورکړل شوی امر لغوه کړئ",
  },
  Modal: {
    okText: "تایید",
    cancelText: "لغو",
    justOkText: "تایید",
  },
  Popconfirm: {
    okText: "تایید",
    cancelText: "لغو",
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "جستجو",
    itemUnit: "عدد",
    itemsUnit: "عدد",
    remove: "حذف",
    selectCurrent: "انتخاب صفحه فعلی",
    removeCurrent: "پاک کردن انتخاب‌های صفحه فعلی",
    selectAll: "انتخاب همه",
    removeAll: "پاک کردن همه انتخاب‌ها",
    selectInvert: "معکوس کردن انتخاب‌ها در صفحه ی کنونی",
  },
  Upload: {
    uploading: "در حال آپلود...",
    removeFile: "حذف فایل",
    uploadError: "خطا در آپلود",
    previewFile: "مشاهده‌ی فایل",
    downloadFile: "دریافت فایل",
  },
  Empty: {
    description: "داده‌ای موجود نیست",
  },
  Icon: {
    icon: "آیکن",
  },
  Text: {
    edit: "ویرایش",
    copy: "کپی",
    copied: "کپی شد",
    expand: "توسعه",
  },
  PageHeader: {
    back: "برگشت",
  },
  Form: {
    optional: "(اختیاری)",
    defaultValidateMessages: {
      default: "خطا در ${label}",
      required: "فیلد ${label} اجباریست",
      enum: "${label} باید یکی از [${enum}] باشد",
      whitespace: "${label} نمیتواند خالی باشد",
      date: {
        format: "ساختار تاریخ در ${label} نامعتبر است",
        parse: "${label} قابل تبدیل به تاریخ نیست",
        invalid: "${label} تاریخی نا معتبر است",
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
        len: "${label} باید ${len} کاراکتر باشد",
        min: "${label} باید حداقل ${min} کاراکتر باشد",
        max: "${label} باید حداکثر ${max} کاراکتر باشد",
        range: "${label} باید بین ${min}-${max} کاراکتر باشد",
      },
      number: {
        len: "${label} باید برابر ${len}",
        min: "${label} حداقل میتواند ${min} باشد",
        max: "${label} حداکثر میتواند ${max} باشد",
        range: "${label} باید بین ${min}-${max} باشد",
      },
      array: {
        len: "تعداد ${label} باید ${len} باشد.",
        min: "تعداد ${label} حداقل باید ${min} باشد",
        max: "تعداد ${label} حداکثر باید ${max} باشد",
        range: "مقدار ${label} باید بین ${min}-${max} باشد",
      },
      pattern: {
        mismatch: "الگوی ${label} با ${pattern} برابری نمی‌کند",
      },
    },
  },
  Image: {
    preview: "نمایش",
  },
};
