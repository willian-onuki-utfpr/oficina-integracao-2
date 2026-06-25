// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from "@react-pdf/renderer";
// import type { IUsuario } from "../../pages/Usuarios/interface";
// import type { IOficina } from "../../pages/Oficinas/interface";
// import type { ICertificado } from "../../pages/OficinasCadastradas/interface";


// interface Props {
//   usuario: Partial<IUsuario>;
//   oficina: Partial<IOficina>;
//   certificado: Partial<ICertificado>;
// }

// const styles = StyleSheet.create({
//   page: {
//     paddingTop: 90,
//     paddingHorizontal: 70,
//     paddingBottom: 50,
//     fontFamily: "Helvetica",
//   },

//   titulo: {
//     textAlign: "center",
//     fontSize: 24,
//     marginBottom: 60,
//     fontWeight: "bold",
//   },

//   conteudo: {
//     fontSize: 14,
//     lineHeight: 1.8,
//     textAlign: "center",
//   },

//   destaque: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   localData: {
//     marginTop: 40,
//     fontSize: 14,
//     textAlign: "center",
//   },

//   rodape: {
//     marginTop: 80,
//     fontSize: 9,
//     textAlign: "center",
//     color: "#666",
//   },
// });

// const formatarData = (
//   data?: string | Date,
// ): string => {
//   if (!data) return "";

//   const date = new Date(data);

//   if (Number.isNaN(date.getTime())) return "";

//   return date.toLocaleDateString("pt-BR");
// };

// export const CertificadoPDF = ({
//   usuario,
//   oficina,
//   certificado,
// }: Props) => {
//   const aulasOrdenadas =
//     oficina.aulas
//       ?.filter((a) => !!a.a_data)
//       ?.sort(
//         (a, b) =>
//           new Date(a.a_data as Date).getTime() -
//           new Date(b.a_data as Date).getTime(),
//       ) || [];

//   const dataInicial =
//     aulasOrdenadas[0]?.a_data;

//   const dataFinal =
//     aulasOrdenadas[aulasOrdenadas.length - 1]?.a_data;

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.titulo}>
//           DECLARAÇÃO
//         </Text>

//         <View style={styles.conteudo}>
//           <Text>
//             Declaramos que{" "}
//             <Text style={styles.destaque}>
//               {usuario?.usu_nome || ""}
//             </Text>{" "}
//             participou da{" "}
//             {oficina?.tema?.t_nome || ""}, realizada
//             pela Universidade Tecnológica Federal
//             do Paraná - Câmpus Cornélio Procópio,
//             de {formatarData(dataInicial)} a{" "}
//             {formatarData(dataFinal)}, com carga
//             horária de{" "}
//             {oficina?.of_carga_horaria || 0} horas.
//           </Text>
//         </View>

//         <Text style={styles.localData}>
//           Cornélio Procópio,{" "}
//           {formatarData(
//             certificado?.c_data_emissao,
//           )}
//           .
//         </Text>

//         <Text style={styles.rodape}>
//           Documento emitido eletronicamente pelo
//           Sistema de Controle de Oficinas.
//         </Text>
//       </Page>
//     </Document>
//   );
// };
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { IUsuario } from "../../pages/Usuarios/interface";
import type { IOficina } from "../../pages/Oficinas/interface";
import type { ICertificado } from "../../pages/OficinasCadastradas/interface";

interface Props {
  usuario: Partial<IUsuario>;
  oficina: Partial<IOficina>;
  certificado: Partial<ICertificado>;
}

const formatarData = (data?: Date | string) => {
  if (!data) return "";

  return new Date(data).toLocaleDateString("pt-BR");
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    position: "relative",
  },

  border: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    border: "2 solid #000",
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logo: {
    width: 120,
    height: 60,
    objectFit: "contain",
    marginBottom: 10,
  },

  university: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  campus: {
    fontSize: 10,
    marginTop: 4,
  },

  title: {
    marginTop: 35,
    marginBottom: 40,
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 3,
  },

  assinatura: {
    marginTop: 35,
    marginBottom: 40,
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 3,
  },

  participantName: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
  },

  content: {
    fontSize: 14,
    textAlign: "justify",
    lineHeight: 1.8,
    marginBottom: 40,
  },

  cityDate: {
    marginTop: 30,
    textAlign: "left",
    fontSize: 12,
  },

  signatures: {
    marginTop: 70,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signatureBox: {
    width: "40%",
    alignItems: "center",
  },

  signatureLine: {
    width: "100%",
    borderTop: "1 solid #000",
    marginBottom: 6,
  },

  signatureText: {
    fontSize: 10,
    textAlign: "center",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    textAlign: "center",
    color: "#555",
  },
});

export const CertificadoPDF = ({
  usuario,
  oficina,
  certificado,
}: Props) => {
  const aulas = [...(oficina.aulas || [])].sort(
    (a, b) =>
      new Date(a.a_data as Date).getTime() -
      new Date(b.a_data as Date).getTime(),
  );

  const dataInicio = aulas?.[0]?.a_data;
  const dataFim = aulas?.[aulas.length - 1]?.a_data;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border} />

        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="/images/logo-utfpr.png"
          />

          <Text style={styles.university}>
            UNIVERSIDADE TECNOLÓGICA FEDERAL DO PARANÁ
          </Text>

          <Text style={styles.campus}>
            Câmpus Cornélio Procópio
          </Text>
        </View>

        <Text style={styles.title}>DECLARAÇÃO</Text>

        <Text style={styles.content}>
          Declaramos que{" "}
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {usuario.usu_nome}
          </Text>{" "}
          participou da oficina{" "}
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {oficina.tema?.t_nome}
          </Text>
          , realizada pela Universidade Tecnológica Federal do Paraná –
          Câmpus Cornélio Procópio, no período de{" "}
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {formatarData(dataInicio)}
          </Text>{" "}
          a{" "}
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {formatarData(dataFim)}
          </Text>
          , totalizando carga horária de{" "}
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {oficina.of_carga_horaria} horas
          </Text>
          .
        </Text>

        <Text style={styles.cityDate}>
          Cornélio Procópio,{" "}
          {formatarData(certificado.c_data_emissao)}
        </Text>

        <Text style={styles.assinatura}>Commissão Organizadora</Text>

        {/* <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />

            <Text style={styles.signatureText}>
              Coordenação da Oficina
            </Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />

            <Text style={styles.signatureText}>
              Universidade Tecnológica Federal do Paraná
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Certificado emitido eletronicamente pelo Sistema de Controle de
          Oficinas da UTFPR.
        </Text> */}
      </Page>
    </Document>
  );
};