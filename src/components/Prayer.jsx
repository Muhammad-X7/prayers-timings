import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { memo } from "react";

function MediaCard({ name, time, image, darkMode = true }) {
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
			{/* Image with srcset */}
			<img
				src={`/${image}_420.webp`}
				srcSet={`
          /${image}_420.webp 420w,
          /${image}_664.webp 664w,
          /${image}_908.webp 908w,
          /${image}_1020.webp 1020w,
          /${image}_1327.webp 1327w
        `}
				sizes="
          (max-width: 600px) 100vw,
          (max-width: 900px) 50vw,
          (max-width: 1200px) 33vw,
          20vw
        "
				alt={name}
				loading="lazy"
				decoding="async"
				style={{
					width: "100%",
					height: "130px",
					objectFit: "cover"
				}}
			/>

			<CardContent>
				<h2 style={{ color: darkMode ? "#fff" : "#242424" }}>
					{name}
				</h2>

				<Typography
					variant="h2"
					style={{
						color: darkMode
							? "rgba(255,255,255,0.78)"
							: "rgba(0,0,0,0.6)"
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
	darkMode: PropTypes.bool
};

export default memo(MediaCard);
