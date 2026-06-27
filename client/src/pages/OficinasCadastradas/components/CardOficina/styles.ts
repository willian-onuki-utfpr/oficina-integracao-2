import { Card } from "react-bootstrap";
import styled from "styled-components";

function colorFromId(id: number) {
  const hue = (id * 137.508) % 360;
  return `hsl(${hue}, 70%, 80%)`;
}

export const Container = styled(Card)`
  height: 220px;
  width: 400px;
`;

export const WallPaper = styled.div<{ id: number }>`
  background-color: ${({ id }) => colorFromId(id)};
  height: 40px;
  width: 100%;
`;
