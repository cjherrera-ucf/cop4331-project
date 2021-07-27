import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Button, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

function PasswordChange() {
  var Email;

  const [message, setMessage] = useState("");

  const doPassReset = async (event) => {

    if (Email === null) {
      setMessage("Please enter your information");
    }
    else {
      const urlPR = bp.buildPath("api/account/letmein/" + Email);
      try {
        const response = await fetch(urlPR, { method: 'get', body: js, headers: { "Content-Type": "application/json" } });
        var res = JSON.parse(await response.text());
        if (res.err_code) {
          setMessage(res.description);
        }

      } catch (e) {
        setMessage(' ' + e.message);
      }
    }
  };

  const goBack = async (event) =>{
    window.location.href='Login';
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../images/gradient.png")}
      >
        {/*Break*/}
        <Text>{"\n"}</Text>
        <View style={styles.blanck}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.title}> Password Reset </Text>
            <TouchableOpacity
              color="black"
              style={styles.button}
              onPress={goBack}
            >
              <View style={styles.button_pack}>
                <Text style={styles.button}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*Break*/}
          <Text>{"\n"}</Text>

          {/* Email */}
          <View style={styles.email_pack}>
            <Feather name="mail" size={30} color="black" />
            <TextInput
              style={styles.email}
              placeholder="Enter Your Email"
              onChangeText={(val) => {
                Email = val;
              }}
            />
          </View>
          {/*Break*/}
          <Text>{"\n"}</Text>

          {/* Status */}
          <View>
            <Text style={styles.status}>{message}</Text>
          </View>
          {/*Break*/}
          <Text>{"\n"}</Text>

          {/* Reset */}
          <TouchableOpacity
            color="black"
            title="LOGIN"
            style={styles.button}
            onPress={doPassReset}
          >
            <View style={styles.button_pack}>
              <Text style={styles.button}>Reset</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "-apple-system, BlinkMacSystemFont Segoe UI",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
  email: {
    textAlign: "left",
    fontSize: 20,
    backgroundColor: "lightgrey",
    borderRadius: 5,
    height: 50,
    width: "80%",
  },
  button: {
    textAlign: "center",
    fontSize: 30,
    backgroundColor: "#14CCA4",
    borderRadius: 5,
    fontWeight: "bold",
    height: 40,
    color: "white",
  },
  status: {
    fontSize: 20,
    textAlign: "center",
    color: "#BC3908",
    fontWeight: "bold",
  },
  blanck: {
    padding: 20,
    backgroundColor: "black",
    borderRadius: 5,
    width: "75%",
  },
  email_pack: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "lightgrey",
    borderRadius: 5,
  },
  button_pack: {
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#14CCA4",
    borderRadius: 5,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
  },
});

export default PasswordChange;
