import { FC, useContext } from "react";
import { AppContext } from "@app/context";

const Index: FC = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);

  return (
    <div>
      <ul>
        <li>{accessToken.value}</li>
        <li>---</li>
        <li>{encryptionKey.value}</li>
      </ul>
    </div>
  );
};

export default Index;
