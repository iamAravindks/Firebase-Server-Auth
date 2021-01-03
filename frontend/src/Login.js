import React from "react";
import { auth, firebase } from "./Firebase";
import axios from 'axios'
const url =
  "https://us-central1-rocketauth-d71f0.cloudfunctions.net/loggedin";

export default function Login() {
  async function googleLogin() {
    //1 - init Google Auth Provider
    const provider = new firebase.auth.GoogleAuthProvider();
    //2 - create the popup signIn
    await auth.signInWithPopup(provider).then(
      async (result) => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());
        console.log(token);
        const headers = new Headers()
        headers.append('Content-Type', 'application/json');
        headers.append("Authorization", `Bearer ${token}`)
        headers.append("Access-Control-Allow-Origin", "*")
        headers.append("Access-Control-Allow-Headers", "authorization")
        headers.append("Access-Control-Allow-Credentials", true)
        const bodyParameters = {
          key: "value"
        };
        axios.post(url, bodyParameters, headers)
          .then(res => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error)
          });

      },
    );
  }
  return (
    <div>
      <button onClick={googleLogin} className='login-button'>
        GOOGLE
      </button>
    </div>
  );
}
