interface IStyles {
  modal: (isMobile: any) => React.CSSProperties;
  modalBody: (
    isMobile: any,
    isSubBase: any,
    isTablet: any,
  ) => React.CSSProperties;
}

export const Styles: IStyles = {
  modal: (isMobile) => ({
    top: isMobile ? 0 : 15,
    bottom: isMobile ? 0 : 15,
    right: isMobile ? 0 : undefined,
    left: isMobile ? 0 : undefined,
  }),
  modalBody: (isMobile, isSubBase, isTablet) => ({
    maxHeight: `calc(100vh - 162px)`,
    overflowY: 'auto',
    padding: isSubBase ? '20px' : '10px 24px 10px 24px',
  }),
};
