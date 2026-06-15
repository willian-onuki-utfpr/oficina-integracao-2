import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-grow: 1;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const ListaOficinas = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  gap: 16px;

  padding: 16px 24px;

  overflow-y: auto;
`;
