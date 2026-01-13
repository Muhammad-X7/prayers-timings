import { useState } from "react";
import MainContent from "./components/MainContent";
import { Container } from "@mui/material";

function App() {
	// استخدام React state فقط بدون localStorage
	const [darkMode, setDarkMode] = useState(true);

	return (
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
	);
}

export default App;