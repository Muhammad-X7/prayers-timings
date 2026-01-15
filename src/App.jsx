import { useEffect } from "react";
import MainContent from "./components/MainContent";
import Container from "@mui/material/Container";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
	const [darkMode, setDarkMode] = useLocalStorage("darkMode", true);

	// حفظ darkMode في localStorage عند التغيير
	useEffect(() => {
		localStorage.setItem("darkMode", darkMode);
	}, [darkMode]);

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
