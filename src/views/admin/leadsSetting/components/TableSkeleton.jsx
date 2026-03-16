import React from "react";
import { Tr, Td, Skeleton } from "@chakra-ui/react";

const TableSkeleton = ({ columns, rowCount = 5 }) => (
  <>
    {[...Array(rowCount)].map((_, index) => (
      <Tr key={index}>
        {columns.map((col, colIndex) => (
          <Td key={colIndex} textAlign="center">
            <Skeleton
              height="20px"
              width={col.width ? `${col.width - 40}px` : "80px"}
              mx="auto"
            />
          </Td>
        ))}
      </Tr>
    ))}
  </>
);

export default TableSkeleton;
