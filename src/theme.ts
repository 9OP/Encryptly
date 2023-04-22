import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";

const AlertStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {
    container: {
      borderWidth: "3px",
      borderRadius: "6px",
      borderColor: "black",
      boxShadow: "-4px 4px 0px 0px #000",
    },
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    toast: (P: any) => {
      return {
        container: {
          ...P.theme.components.Alert.variants.solid(P).container,
          borderWidth: "3px",
          borderRadius: "6px",
          borderColor: "black",
          boxShadow: "-4px 4px 0px 0px #000!important",
        },
      };
    },
  },
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
