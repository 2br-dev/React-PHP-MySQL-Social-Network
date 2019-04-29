import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#1976d2' }, 
    secondary: { main: '#ff4800' },
  },
  typography: { useNextVariants: true },
  overrides: {
    MuiSnackbar: { 
      root: { 
        bottom: window.innerWidth < 600 ? '60px !important' : '0', 
      },
    },
    MuiModal: {
      root: {
        bottom: window.innerWidth < 600 ? '60px !important' : '0', 
        maxWidth: `${window.innerWidth}px !important`
      },
    },
    MuiBackdrop: {
      root: {
        bottom: window.innerWidth < 600 ? 'display: none' : 'display: block', 
      },
    },
    MuiFab: {
      root: {
        bottom: window.innerWidth < 600 ? '76px' : '0', 
        zIndex: 10
      }
    },
    MuiList: {
      padding: {
        padding: '0 !important'
      }
    },
    MuiGrid: {
      container: {
        height: '100% !important'
      }
    },
    MuiTableCell: {
      root: {
        pointerEvents: 'none'
      }
    },
    Layout: {
      title: {
        marginLeft: '-40px'
      }
    },
    VerticalAppointment: {
      content: {
        fontSize: '1.1rem'
      },
      title: {
        fontWeight: '500',
        fontSize: '1.2rem'
      },
      textContainer: {
        lineHeight: '20px',
        opacity: '.75'
      }
    },
    MuiTab: {
      label: {
        fontSize: window.innerWidth < 600 ? '8px' : '0.875rem'
      }
    }
  },
});

export default theme;