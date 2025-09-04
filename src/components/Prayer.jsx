import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

// PropTypes validation
MediaCard.propTypes = {
	name: PropTypes.string.isRequired,
	time: PropTypes.string.isRequired,
	image: PropTypes.string,
	darkMode: PropTypes.bool
};

// MediaCard component displays a prayer card with an image, name, and time
// Accepts props: name (prayer name), time (prayer time), image (image URL), darkMode (boolean)

export default function MediaCard({ name, time, image, darkMode = true }) {
	// Define dynamic styles based on darkMode
	const cardStyle = {
		backgroundColor: darkMode ? "#282828ff" : "#ffffff",
		color: darkMode ? "rgba(255, 255, 255, 0.87)" : "#242424",
		borderRadius: "6px",
		boxShadow: darkMode
			? "0 4px 7px rgba(0, 0, 0, 1)"
			: "0 4px 7px rgba(85, 85, 85, 0.38)",
		transition: "transform 0.3s ease, box-shadow 0.3s ease",
		border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)"
	};

	return (
		<Card style={cardStyle}>
			{/* Card image section */}
			<CardMedia sx={{ height: 130 }} image={image} title="prayer time" />

			{/* Card content section */}
			<CardContent>
				{/* Prayer name */}
				<h2 style={{ color: darkMode ? "rgba(255, 255, 255, 1)" : "#242424" }}>
					{name}
				</h2>

				{/* Prayer time */}
				<Typography
					variant="h2"
					style={{
						color: darkMode ? "rgba(255, 255, 255, 0.78)" : "rgba(0, 0, 0, 0.6)"
					}}
				>
					{time}
				</Typography>
			</CardContent>
		</Card>
	);
}

