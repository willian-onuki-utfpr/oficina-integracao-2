import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { IOficinaRelatorio } from "../../interfaces";

interface Props {
  oficinas: IOficinaRelatorio[];
  geradoEm: string;
}

const COL_WIDTHS = {
  oficina: "30%",
  professor: "25%",
  tutores: "30%",
  alunos: "15%",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  geradoEm: {
    fontSize: 9,
    textAlign: "center",
    color: "#555",
    marginBottom: 24,
  },
  table: {
    width: "100%",
    borderTop: "0.5 solid #999",
    borderLeft: "0.5 solid #999",
  },
  row: {
    flexDirection: "row",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
  },
  cell: {
    padding: 6,
    borderRight: "0.5 solid #999",
    borderBottom: "0.5 solid #999",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 9,
  },
  cellText: {
    fontSize: 9,
    color: "#1a1a1a",
  },
  cellTextMuted: {
    fontSize: 9,
    color: "#777",
  },
  colOficina: { width: COL_WIDTHS.oficina },
  colProfessor: { width: COL_WIDTHS.professor },
  colTutores: { width: COL_WIDTHS.tutores },
  colAlunos: { width: COL_WIDTHS.alunos, textAlign: "center" },
});

const formatarTutores = (
  tutores: IOficinaRelatorio["tutores"],
): string => {
  if (!tutores || tutores.length === 0) return "Sem tutores";
  return tutores.map((t) => t.usuario.usu_nome).join(", ");
};

export const RelatorioOficinasPDF = ({ oficinas, geradoEm }: Props) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Relatório de Oficinas</Text>
      <Text style={styles.geradoEm}>Gerado em: {geradoEm}</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <View style={[styles.cell, styles.colOficina]}>
            <Text style={styles.headerText}>Oficina</Text>
          </View>
          <View style={[styles.cell, styles.colProfessor]}>
            <Text style={styles.headerText}>Professor responsável</Text>
          </View>
          <View style={[styles.cell, styles.colTutores]}>
            <Text style={styles.headerText}>Tutores</Text>
          </View>
          <View style={[styles.cell, styles.colAlunos]}>
            <Text style={styles.headerText}>Alunos matriculados</Text>
          </View>
        </View>

        {oficinas.map((oficina) => {
          const tutores = formatarTutores(oficina.tutores);
          const isSemTutores = tutores === "Sem tutores";

          return (
            <View key={oficina.of_id} style={styles.row}>
              <View style={[styles.cell, styles.colOficina]}>
                <Text style={styles.cellText}>
                  {oficina.tema?.t_nome ?? "—"}
                </Text>
              </View>
              <View style={[styles.cell, styles.colProfessor]}>
                <Text style={styles.cellText}>
                  {oficina.professor?.usu_nome ?? "—"}
                </Text>
              </View>
              <View style={[styles.cell, styles.colTutores]}>
                <Text
                  style={
                    isSemTutores ? styles.cellTextMuted : styles.cellText
                  }
                >
                  {tutores}
                </Text>
              </View>
              <View style={[styles.cell, styles.colAlunos]}>
                <Text style={styles.cellText}>
                  {oficina.matriculas?.length ?? 0}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);
