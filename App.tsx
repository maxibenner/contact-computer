import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import { Search } from "./components/search/Search";
import { Wrapper } from "./components/wrapper/Wrapper";

export default function App() {
  return (
    <Wrapper>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("./assets/world.gif")}
            style={{ width: 300, height: 300 }}
          />
          <View style={{maxWidth: 450, marginLeft: 50, marginTop: 30}}>
            <Text style={styles.heroText}>The global address book</Text>
            <Search />
          </View>
          s
        </View>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // maxWidth: 450,
    marginHorizontal: "auto",
  },
  heroText: {
    fontSize: 70,
    lineHeight: 75,
    color: "#454ef7",
    fontWeight: "bold",
    marginBottom: 20,
  },
});
