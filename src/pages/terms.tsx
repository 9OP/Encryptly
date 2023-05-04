import { Box } from "@chakra-ui/react";
import { marked } from "marked";
import { FC, useEffect, useState } from "react";
import "./index.css";

const Terms: FC = () => {
  const [md, setMd] = useState("");
  const url = "/TERMS.MD";

  useEffect(() => {
    const fetchMd = async () => {
      const res = await fetch(url);
      const data = await res.text();
      setMd(data);
    };

    fetchMd();
  });

  const getMarkdown = () => {
    var rawMarkup = marked.parse(md);
    return { __html: rawMarkup };
  };

  return (
    <Box padding="2rem" width={{ base: "100%", md: "80%", lg: "70%", xl: "60%" }} margin="auto">
      <div dangerouslySetInnerHTML={getMarkdown()} />
    </Box>
  );
};

export default Terms;
