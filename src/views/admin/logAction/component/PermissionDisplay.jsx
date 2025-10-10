import React from "react";
import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react";

const PermissionDisplay = ({ permission }) => {
  if (!permission) return null;

  const { added = [], modified = [], removed = [] } = permission;

  const renderActions = (actions, type, color) => {
    if (!actions || actions.length === 0) {
      return (
        <ListItem ml={6} color="gray.500" fontSize="sm">
          no actions updated
        </ListItem>
      );
    }

    return actions.map((a, i) => (
      <ListItem key={i} ml={6} fontSize="sm" color={color}>
        {a.actionKey} permission {type}
      </ListItem>
    ));
  };

  const renderModifiedAddedActions = (actions) => {
    if (!actions || actions.length === 0) {
      return (
        <ListItem ml={6} color="gray.500" fontSize="sm">
          no actions updated
        </ListItem>
      );
    }

    return actions.map((a, i) => (
      <ListItem key={i} ml={6} fontSize="sm" color={"green.600"}>
        {a.actionKey} permission added
      </ListItem>
    ));
  };

  const renderModifiedRemovedActions = (actions) => {
    if (!actions || actions.length === 0) {
      return (
        <ListItem ml={6} color="gray.500" fontSize="sm">
          no actions updated
        </ListItem>
      );
    }

    return actions.map((a, i) => (
      <ListItem key={i} ml={6} fontSize="sm" color={"red.500"}>
        {a.actionKey} permission removed
      </ListItem>
    ));
  };
  console.log("modified", modified);
  return (
    <Box fontSize="sm" lineHeight="taller">
      {/* Added Modules */}
      {added.length > 0 &&
        added.map((m, idx) => (
          <Box key={`added-${idx}`} mb={4}>
            <Text fontWeight="semibold" color="green.600">
              - {m.moduleName} added
            </Text>
            <UnorderedList>
              {renderActions(m.actions, "added", "green.500")}
            </UnorderedList>
          </Box>
        ))}

      {/* Modified Modules */}
      {modified.length > 0 &&
        modified.map((m, idx) => (
          <Box key={`mod-${idx}`} mb={4}>
            <Text fontWeight="semibold" color="blue.600">
              - {m.moduleName} modified
            </Text>
            <UnorderedList>
              {m.addedActions.length > 0 &&
                renderModifiedAddedActions(m.addedActions)}

              {m.removedActions.length > 0 &&
                renderModifiedRemovedActions(m.removedActions)}

              {m.addedActions.length === 0 && m.removedActions.length === 0 && (
                <ListItem ml={6} color="gray.500" fontSize="sm">
                  no actions updated
                </ListItem>
              )}
            </UnorderedList>
          </Box>
        ))}

      {/* Removed Modules */}
      {removed.length > 0 &&
        removed.map((m, idx) => (
          <Box key={`rem-${idx}`} mb={4}>
            <Text fontWeight="semibold" color="red.600">
              - {m.moduleName} removed
            </Text>
            <UnorderedList>
              {renderActions(m.actions, "removed", "red.500")}
            </UnorderedList>
          </Box>
        ))}
    </Box>
  );
};

export default PermissionDisplay;
