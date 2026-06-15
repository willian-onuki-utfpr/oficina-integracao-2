import type { ReactNode } from "react";
import { Container, Content } from "./styles";
import { Header } from "../Header";

interface Props {
  children: ReactNode;
}

export const GenericPage = ({ children }: Props) => {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
    </Container>
  );
};
