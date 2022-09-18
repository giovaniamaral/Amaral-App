import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { VStack, Text, HStack, useTheme, ScrollView, Box } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  ClipboardText,
  AddressBook,
  User,
  Phone,
} from "phosphor-react-native";

import { dateFormat } from "../utils/firestoreDateFormat";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import { Loading } from "../components/Loading";
import { CardDetails } from "../components/CardDetails";


type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
  andress: string;
  phone: number;
};

export function Details() {
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);


  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const { orderId } = route.params as RouteParams;

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe o oque foi realizado no cliente"
      );
    }

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação");
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          andress,
          phone,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          andress,
          status,
          solution,
          phone,
          when: dateFormat(created_at),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="cliente"
          phone={null}
          description={` ${order.patrimony}`}
          icon={User}
          andress=""
        />
         <CardDetails
          title="telefone"
          phone={null}
          description={`${order.phone}`}
          andress={""}
          icon={Phone}
          footer={`Registrado em ${order.when}`}      />

        <CardDetails
          title="descrição do serviço"
          phone={null}
          andress=""
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />
         <CardDetails
          title="Endereço"
          phone={null}
          andress=""
          icon={AddressBook}
          description={order.andress}
          footer={order.closed && ``}
        >
        </CardDetails>
        
        <CardDetails
          title="Serviço executado"
          phone={null}
          andress=""
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}>
          {
            order.status === 'open' &&
            <Input
              placeholder="Descrição do serviço"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          }
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  );
}
