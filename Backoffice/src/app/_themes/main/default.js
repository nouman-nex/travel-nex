const shadows = [
  "none",
  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
  "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
  "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
  "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
  "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
  "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
  "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
  "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
  "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
  "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
  "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
  "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
  "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
  "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
  "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
  "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
  "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
  "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
  "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
  "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
  "0 5px 10px rgba(0, 0, 0, 0.085)",
  "0 5px 10px rgba(0, 0, 0, 0.175)",
];

export const mainTheme = {
  type: "light",
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },

  palette: {
    primary: {
      main: "#0EA5E9", // Sky Blue
      light: "#7DD3FC",
      dark: "#0369A1",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#64748B", // Slate Blue-Grey
      light: "#94A3B8",
      dark: "#475569",
      contrastText: "#FFF",
    },
    error: {
      main: "#E73145",
      light: "#FF6A70",
      dark: "#AD001E",
      contrastText: "#FFF",
    },
    warning: {
      main: "#F39711",
      light: "#FFC84C",
      dark: "#BB6900",
      contrastText: "#FFF",
    },
    info: {
      main: "#06B6D4",
      light: "#67E8F9",
      dark: "#0891B2",
      contrastText: "#FFF",
    },
    success: {
      main: "#3BD2A2",
      light: "#78FFD3",
      dark: "#00A073",
      contrastText: "#FFF",
    },
    text: {
      primary: "#1E293B", // Darker Slate for better readability
      secondary: "#64748B",
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
    background: {
      paper: "#FFFFFF",
      default: "#F8FAFC", // Slightly cooler white
    },
    action: {
      active: "#0EA5E9",
      hover: "#F1F5F9",
    },
  },
  shadows: shadows,
  typography: {
    fontFamily: "NoirPro, Arial",
    fontSize: 14,
    h1: {
      fontSize: "1.5rem",
      lineHeight: 1.2,
      fontWeight: 400,
      color: "#37373C",
      margin: "0 0 .5rem",
    },
    h2: {
      fontSize: "1.4rem",
      lineHeight: 1.2,
      fontWeight: 400,
      color: "#37373C",
      margin: "0 0 .5rem",
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: 1.2,
      fontWeight: 400,
      color: "#37373C",
      margin: "0 0 .5rem",
    },
    h4: {
      fontSize: "1.1rem",
      lineHeight: 1.2,
      fontWeight: 400,
      color: "#37373C",
      margin: "0 0 .5rem",
    },
    h5: {
      fontSize: "1rem",
      lineHeight: 1.2,
      fontWeight: 400,
      color: "#37373C",
      margin: "0 0 .5rem",
    },
    h6: {
      fontSize: ".875rem",
      lineHeight: 1.2,
      fontWeight: 400,
      color: "#37373C",
      margin: "0 0 .5rem",
    },
    body1: {
      fontSize: ".875rem",
    },
  },
  jumboComponents: {
    JumboNavbar: {
      nav: {
        action: {
          active: "#7DD3FC",
          hover: "#7DD3FC",
        },
        background: {
          active: "rgba(115, 82, 199, 0.15)",
          hover: "#E9ECEF",
        },
        tick: {
          active: "#7DD3FC",
          hover: "#ADB5BD",
        },
      },
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: `rgb(0, 0, 0, 0.1)`,
        },
        head: {
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.25,
          background: "#F6F6F6",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: "auto",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: `0 0.5rem 1.25rem rgba(115, 82, 199, 0.175)`,
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: `0 0.5rem 1.25rem rgba(115, 82, 199, 0.175)`,
          ":first-of-type": {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
          ":last-of-type": {
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "0 20px 20px",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          paddingInline: 20,
        },
        content: {
          marginBlock: 20,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "18px 24px",
        },
        title: {
          fontSize: "1.1rem",
          marginBottom: 0,
        },
        subheader: {
          margin: "4px 0 0",
        },
        action: {
          margin: 0,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "8px 24px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        sizeSmall: {
          height: 22,
          fontSize: 12,
        },
        labelMedium: {
          paddingInline: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          letterSpacing: 1,
        },
        sizeSmall: {
          fontSize: "12px",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 18,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        avatar: {
          fontSize: 16,
        },
      },
    },
  },
};
