import { FunctionComponent } from "react";

interface Props {
  children: React.ReactNode;
}

const Menu: FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <h1>Duuu</h1>
      {children}
    </>
  );
};

export default Menu;