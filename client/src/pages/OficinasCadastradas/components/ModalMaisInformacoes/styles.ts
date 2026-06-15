import styled from "styled-components";

export const TableContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  overflow-x: auto;

  table {
    margin-bottom: 0;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  }
`;