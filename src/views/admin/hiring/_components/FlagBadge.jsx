// import { Image, Tooltip } from "@chakra-ui/react";
// import React from "react";

// const FlagBadge = ({ item }) => {
//   return (
//     <div style={{ width: "fit-content" }}>
//       {item.country?.flags?.png && (
//         <Tooltip
//           label={item.nationality}
//           hasArrow
//           placement="top"
//           cursor={"pointer"}
//         >
//           <Image
//             rounded="sm"
//             src={item.country?.flags.png}
//             alt={item.country?.flags.alt}
//             h="12px"
//             w="auto"
//             objectFit="cover"
//             shadow="md"
//             cursor="pointer"
//           />
//         </Tooltip>
//       )}
//     </div>
//   );
// };

// export default FlagBadge;

import { Image, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";

const FlagBadge = ({ item }) => {
  const [imgError, setImgError] = useState(false);

  // Get both PNG and SVG URLs
  const pngUrl = item.country?.flags?.png;
  const svgUrl = item.country?.flags?.svg;

  // Determine which image to show: PNG if available and no error, otherwise SVG
  const imageUrl = pngUrl && !imgError ? pngUrl : svgUrl;

  // Don't render if no image URL is available
  if (!imageUrl) {
    return null;
  }

  return (
    <div style={{ width: "fit-content" }}>
      <Tooltip
        label={item.nationality}
        hasArrow
        placement="top"
        cursor={"pointer"}
      >
        <Image
          rounded="sm"
          src={imageUrl}
          alt={item.country?.flags?.alt || item.nationality}
          h="12px"
          w="auto"
          objectFit="cover"
          shadow="md"
          cursor="pointer"
          onError={() => {
            // If PNG fails, try SVG
            if (!imgError && pngUrl) {
              setImgError(true);
            }
          }}
        />
      </Tooltip>
    </div>
  );
};

export default FlagBadge;
