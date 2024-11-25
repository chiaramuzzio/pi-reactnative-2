import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet, TextInput } from "react-native";
import { auth } from "../firebase/config"; 

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: [],
    };
  }
  
  componentDidMount(){
    auth.onAuthStateChanged((user)=>{
        if (user){
            this.props.navigation.navigate("HomeMenu")
        }
    })
}

  login = () => {
    const { email, password } = this.state;

    auth.signInWithEmailAndPassword(email, password)
      .then(response => {
        console.log("Login exitoso: ", response);
        this.props.navigation.navigate("HomeMenu");
      })
      .catch(error => {
        console.error("Error en el login: ", error);

        const errors = [];
        if (!email.includes("@")) {
          errors.push("El email debe ser válido.");
        }
        if (password.length < 6) {
          errors.push("La contraseña debe tener al menos 6 caracteres.");
        }
        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          errors.push("Credenciales incorrectas.");
        }

        this.setState({ errors });
      });
  };

  render() {
    const { email, password, errors } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ingresar</Text>

        <TextInput
          style={styles.fieldinput}
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={text => this.setState({ email: text })}
          value={email}
        />

        <TextInput
          style={styles.fieldinput}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={text => this.setState({ password: text })}
          value={password}
        />

        {errors.length > 0 && (
          <View style={styles.errorContainer}>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                {error}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.fieldbutton} onPress={this.login}>
          <Text style={styles.textbutton}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkbutton}
          onPress={() => this.props.navigation.navigate("Register")}
        >
          <Text style={styles.linktext}>No tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#14171a",
    marginBottom: 20,
  },
  fieldinput: {
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginVertical: 10,
    width: "80%",
    backgroundColor: "#fff",
  },
  fieldbutton: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  textbutton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkbutton: {
    marginVertical: 5,
  },
  linktext: {
    color: "#1DA1F2",
    fontSize: 16,
  },
  errorContainer: {
    marginVertical: 10,
    width: "80%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
});

export default Login;
