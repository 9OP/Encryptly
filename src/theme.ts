import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";

const AlertStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {
    container: {
      borderWidth: "3px",
      borderRadius: "6px",
      borderColor: "black",
      // maxWidth: "25rem",
      padding: "1rem",
      boxShadow: "none",
    },
    title: {
      fontWeight: "bold",
      fontSize: "lg",
      marginBottom: ".8rem",
    },
    description: {
      fontSize: "sm",
      fontWeight: "medium",
      lineHeight: "1rem",
    },
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {},
  // default values for 'size', 'variant' and 'colorScheme'
  defaultProps: {
    variant: "solid",
  },
};

const ButtonStyle: ComponentStyleConfig = {
  baseStyle: {},
  sizes: {},
  variants: {
    solid: {
      borderRadius: "0",
      borderWidth: "3px",
      borderColor: "black",
      boxShadow: "-8px 8px 0px 0px #000",
      _hover: {
        boxShadow: "none",
      },
    },
  },
  defaultProps: {},
};

const InputStyle: ComponentStyleConfig = {
  baseStyle: {
    field: {
      borderRadius: "10px",
      borderWidth: "3px!important",
      borderColor: "black",
      boxShadow: "-4px 4px 0px 0px #000",
      _hover: { boxShadow: "none" },
    },
    addon: {
      border: "3px solid",
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {},
};

const CardStyle: ComponentStyleConfig = {
  baseStyle: {
    padding: "1.5rem",
    borderWidth: "3px",
    borderRadius: "10px",
    borderColor: "black",
    boxShadow: "-4px 4px 0px 0px #000",
  },
  sizes: {},
  variants: {},
  defaultProps: {},
};

const ModalStyle: ComponentStyleConfig = {
  baseStyle: {
    dialog: {
      color: "white",
      borderWidth: "3px",
      borderRadius: "10px",
      borderColor: "black",
      boxShadow: "-4px 4px 0px 0px #000",
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {},
};

const theme = extendTheme({
  fonts: {
    heading: `'Cispeo'`,
    body: `'Cispeo'`,
  },
  components: {
    Alert: AlertStyle,
    Button: ButtonStyle,
    Input: InputStyle,
    Card: CardStyle,
    Modal: ModalStyle,
  },
});

export default theme;
