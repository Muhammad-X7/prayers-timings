import { useState, useEffect } from "react";
import "./App.css";
import MainContent from "./components/MainContent";
import { Container } from "@mui/material";

function App() {
	// Load saved dark mode or use default
	const [darkMode, setDarkMode] = useState(() => {
		const savedDarkMode = localStorage.getItem('prayerApp_darkMode');
		return savedDarkMode ? JSON.parse(savedDarkMode) : true;
	});
	// Apply theme to root element and body

	// Save dark mode in localStorage when it changes
	useEffect(() => {
		localStorage.setItem('prayerApp_darkMode', JSON.stringify(darkMode));
	}, [darkMode]);

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					width: "100vw",
					minHeight: "100vh",
					backgroundColor: darkMode ? "#1f1f1fff" : "#e9e9e9ff",
				}}
			>
				<Container maxWidth="xl">
					<MainContent darkMode={darkMode} setDarkMode={setDarkMode} />
				</Container>
			</div>
		</>
	);
}

export default App;