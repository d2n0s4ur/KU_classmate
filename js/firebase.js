const firebaseConfig = {
	apiKey: "AIzaSyAwwhfkUCV4mZk6mEepAiWjT1DPf36THJs",
	authDomain: "devkor-hackathon.firebaseapp.com",
	databaseURL: "https://devkor-hackathon-default-rtdb.firebaseio.com",
	projectId: "devkor-hackathon",
	storageBucket: "devkor-hackathon.appspot.com",
	messagingSenderId: "274404098879",
	appId: "1:274404098879:web:2fda9eabfd5f892422898a",
	measurementId: "G-W0LFN6QVJ5"
};

firebase.initializeApp(firebaseConfig);
const DB = firebase.database();

const auth = firebase.auth();
const userRef = firebase.database().ref("user");
const subjectRef = firebase.database().ref("subject");
const tableRef = firebase.database().ref("table");
const conditionRef = firebase.database().ref("condition");
const requestRef = firebase.database().ref("request");

const semester = "2022-1"
