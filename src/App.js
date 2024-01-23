import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { modelURI } from "./modelHandler";
import CameraView from "./CameraView";
import { posText } from "./utils/renderBox/index.web";
import { onTap } from "./utils/renderBox/index.web";

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState("back");
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [inputTensor, setInputTensor] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // model configuration
  const configurations = { threshold: 0.75 };


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      tf.ready().then(async () => {
        const yolov5 = await tf.loadGraphModel(modelURI, {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions });
          },
        });

        const dummyInput = tf.ones(yolov5.inputs[0].shape);
        await yolov5.executeAsync(dummyInput);
        tf.dispose(dummyInput);

        setInputTensor(yolov5.inputs[0].shape);
        setModel(yolov5);
        setLoading({ loading: false, progress: 1 });
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
    })();
  }, []);

  return (
    <View className="flex-1 ">
      {hasPermission ? (
        <>
          {loading.loading ? (
            <View
              style={{
                backgroundColor: "#EBF7EF",
                alignItems: "center",
                position: "relative",
                height: "100%",
                gap: 20,
                paddingTop: 150,
              }}
            >
              <View className="h-[50px] bg-[#CE5E56] w-[136px] rounded-[10px] justify-center items-center mb-[39px] mt-32">
                <Text style={styles.atencao}>Atenção!</Text>
              </View>
              <Text style={styles.text} className="mb-[80px]">
                Não coloque a <Text style={styles.span}>mão</Text> ou{" "}
                <Text style={styles.span}>objetos</Text>{" "}
                <Text style={styles.text}>na sua frente,</Text>{" "}
                <Text style={styles.span}>limpe</Text>{" "}
                <Text style={styles.text}>
                  a lente da câmera e deixe seu dispositivo{" "}
                </Text>{" "}
                <Text style={styles.span}>estável</Text>.
              </Text>
              <ActivityIndicator size="large" color="#39B061" />
            </View>
          ) : (
            <TouchableHighlight
              className="flex-1 w-full h-full"
              onPress={() => onTap()}
              style={{ backgroundColor: "#EBF7EF" }}
            >
              <View className="flex-1 w-full h-full items-center justify-center">
                <CameraView
                  type={type}
                  model={model}
                  inputTensorSize={inputTensor}
                  config={configurations}
                >
                  <View className="absolute left-0 top-0 w-full h-full flex justify-end items-center bg-transparent z-20">
                    <TouchableOpacity
                      className="flex flex-row items-center bg-transparent border-2 border-white p-3 mb-10 rounded-lg relative"
                      onPress={() =>
                        setType((current) =>
                          current === "back" ? "front" : "back"
                        )
                      }
                    >
                      {showAlert && (
                        <View
                          style={{
                            position: "absolute",
                            top: -150,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "#FFF",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 220,
                            height: 140,
                            borderRadius: 10,
                          }}
                        >
                          <Image
                            source={require("../assets/imgs/Touch Hand Gesture.png")}
                            style={{width: 60, height: 60}}
                          />
                          <Text style={{ color: "black", fontSize: 16, textAlign: "center" }}>
                            Clica na tela para ver mais informações.
                          </Text>
                        </View>
                      )}
                      <MaterialCommunityIcons
                        className="mx-2"
                        name="camera-flip"
                        size={30}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </CameraView>
              </View>
            </TouchableHighlight>
          )}
        </>
      ) : (
        <View
          className="justify-center items-center h-full"
          style={{ backgroundColor: "#EBF7EF" }}
        >
          <Text className="text-lg">Permissão não concedida!</Text>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  span: {
    color: "#CE5E56",
    fontWeight: "600",
    fontSize: 14,
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
    width: 294,
  },
  atencao: {
    fontWeight: "700",
    color: "#FFF",
  },
});
