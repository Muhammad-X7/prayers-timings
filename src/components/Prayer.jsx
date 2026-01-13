import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { memo } from "react";

function MediaCard({ name, time, image, darkMode = true, isPriority = false }) {
	const cardStyle = {
		backgroundColor: darkMode ? "#282828ff" : "#ffffff",
		color: darkMode ? "rgba(255, 255, 255, 0.87)" : "#242424",
		borderRadius: "6px",
		boxShadow: darkMode
			? "0 4px 7px rgba(0, 0, 0, 1)"
			: "0 4px 7px rgba(85, 85, 85, 0.38)",
		border: darkMode
			? "1px solid rgba(255,255,255,0.1)"
			: "1px solid rgba(0,0,0,0.1)",
		overflow: "hidden"
	};

	return (
		<Card style={cardStyle}>
			<img
				src={`/${image}_420.webp`}
				srcSet={`
          /${image}_420.webp 420w,
          /${image}_664.webp 664w,
          /${image}_1020.webp 1020w,
          /${image}_1327.webp 1327w
        `}
				sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
				alt={name}
				loading={isPriority ? "eager" : "lazy"}
				fetchPriority={isPriority ? "high" : "auto"}
				decoding="async"
				style={{
					width: "100%",
					height: "165px",
					objectFit: "cover",
					backgroundColor: darkMode ? "#1a1a1a" : "#f0f0f0"
				}}
			/>

			<CardContent style={{ padding: "12px" }}>
				<h2 style={{
					color: darkMode ? "#fff" : "#242424",
					margin: "10px 0 8px 0",
					fontSize: "1.5rem",
					fontWeight: 600
				}}>
					{name}
				</h2>

				<Typography
					variant="h2"
					style={{
						color: darkMode ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.6)",
						fontSize: "3.65rem",
						margin: "20px 0 8px 0",
						fontWeight: 400
					}}
				>
					{time}
				</Typography>
			</CardContent>
		</Card>
	);
}

MediaCard.propTypes = {
	name: PropTypes.string.isRequired,
	time: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	darkMode: PropTypes.bool,
	isPriority: PropTypes.bool
};

export default memo(MediaCard);