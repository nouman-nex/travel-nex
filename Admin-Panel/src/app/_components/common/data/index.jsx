import { ASSET_AVATARS, ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { Span } from "@jumbo/shared";
import { Typography } from "@mui/material";
import { getAssetPath } from "@app/_utilities/helpers";
export const friendsData = [
  {
    id: 1,
    profilePic: getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, "120x100"),
    color: "error",
    name: "Chelsea Johns",
  },
  {
    id: 2,
    profilePic: getAssetPath(`${ASSET_AVATARS}/domnic-harris.jpg`, "120x100"),
    color: "warning",
    name: "Domnic Harris",
  },
  {
    id: 3,
    profilePic: getAssetPath(`${ASSET_AVATARS}/avatar9.jpg`, "120x100"),
    color: "error",
    name: "Alexas",
  },
  {
    id: 4,
    profilePic: getAssetPath(`${ASSET_AVATARS}/avatar6.jpg`, "120x100"),
    color: "success",
    name: "Chelsea",
  },
  {
    id: 5,
    profilePic: getAssetPath(`${ASSET_AVATARS}/alex-dolgove.png`, "120x100"),
    color: "warning",
    name: "Alex Dolgove",
  },
];
const profileSkillsData = [
  {
    id: 1,
    title: "Full-Stack Developer (MERN)",
    date: "Since 2016",
    desc: "Working",
    skills: [
      "MongoDB",
      "ExpressJS",
      "React",
      "NodeJS",
      "Javascript",
      "Typescript",
    ],
  },
  {
    id: 2,
    title: "UI/UX Designer",
    date: "Since 2021",
    desc: "Advocate of UI/UX Principles",
    skills: ["Design Persona", "Figma", "After Effect", "Adobe Illustrator"],
  },
];

const licenseData = [
  {
    id: 1,
    name: "Business Analytics",
    profileImage: `${ASSET_IMAGES}/image(2).png`,
    desc: (
      <>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {"Cornell University"}
        </Typography>
        <Span>{"Issued Jan 2024"}</Span>
      </>
    ),
  },
  {
    id: 2,
    name: "Quantum Computing",
    profileImage: `${ASSET_IMAGES}/image(1).png`,
    desc: (
      <>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {"MIT"}
        </Typography>
        <Span>{"Issued 2024"}</Span>
      </>
    ),
  },
];

const experiencesData = [
  {
    id: 1,
    role: "Sr. Business System Analyst",
    company: "Charter Communications - Full-time",
    location: "California, United States",
    type: "",
    period: "Oct 2023 - Present",
    companyLogo: `${ASSET_IMAGES}/profiles/work-1.png`, // Replace with actual logo link
  },
  {
    id: 2,
    role: "Associate PM/Scrum Master",
    company: "Auxano Technology Consultants",
    location: "NJ, United States - Remote",
    type: "",
    period: "Apr 2022 - Sep 2023",
    companyLogo: `${ASSET_IMAGES}/profiles/work-2.png`, // Replace with actual logo link
  },
];

const paymentCardData = [
  {
    id: 124,
    cardNumber: "123456789123",
    cardName: "Visa",
    cardImage: `${ASSET_IMAGES}/etc/visa.png`,
    expiryDate: "07/2025",
    primary: true,
  },
  {
    id: 125,
    cardNumber: "123456789456",
    cardName: "Mastercard",
    expiryDate: "08/2027",
    cardImage: `${ASSET_IMAGES}/etc/mastercard.png`,
    primary: false,
  },
];

export { experiencesData, licenseData, paymentCardData, profileSkillsData };
