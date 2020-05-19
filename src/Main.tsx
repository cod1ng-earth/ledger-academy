import React from "react";
import { useWeb3Context } from "web3-react";

const Main: React.FC = () => {
  const context = useWeb3Context();

  return (
    <div>
      <p>oh hai {context.account}</p>
    </div>
  );
};

export default Main;
