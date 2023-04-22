import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";

const AlertStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {
    container: {
      borderWidth: "3px",
      borderRadius: "6px",
      borderColor: "black",
      maxWidth: "25rem",
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

const theme = extendTheme({
  fonts: {
    heading: `'Cispeo'`,
    body: `'Cispeo'`,
  },
  components: {
    Alert: AlertStyle,
  },
});

export default theme;
