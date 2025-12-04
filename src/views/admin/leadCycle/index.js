import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import { Box } from "@chakra-ui/react";
import LeadHistoryTimeline from "./components/LeadHistoryTimeline";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useStateContext } from "contexts/store";
import CardShimmer from "components/loading/CardShimmer";
import { useModalColors } from "hooks/useModalColors";

class TimelineItem {
  constructor(type, updatedAt, updatedBy, updatedData, role) {
    this.type = type;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.updatedData = updatedData;
    this.role = role;
  }
}

const LeadCycle = ({ isLeadCycle, setIsLeadCycle }) => {
  console.log("check isLeadCycle", isLeadCycle);
  const [data, setData] = useState([]);
  const [leadName, setLeadName] = useState("");
  const [loading, setLoading] = useState(false);
  // const [] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  // const { isLeadCycle, setIsLeadCycle } = useStateContext();

  const { headerBg, headerText } = useModalColors();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getApi(`api/lead/cycle/${isLeadCycle?.id}`);
      const response = data?.data;
      setLeadName(response.lead.leadName);

      let timelineData = [];
      let createdByName = "Web";
      if (response.lead?.createBy?.fullName) {
        createdByName = response.lead.createBy.fullName;
      }
      const leadCreatedItem = new TimelineItem(
        "creation",
        new Date(response.lead.createdDate)?.toUTCString(),
        createdByName,
        ""
      );
      timelineData.push(leadCreatedItem);
      if (response?.data?.length) {
        const newItems = response?.data?.map(
          (updated) =>
            new TimelineItem(
              updated.type,
              updated.updatedAt,
              updated.updatedBy?.fullName,
              updated.updatedData,
              updated.updatedBy?.roles[0]?.roleName
            )
        );

        timelineData = [...timelineData, ...newItems].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      }

      setData(timelineData);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user?._id && isLeadCycle?.isOpen) {
      fetchData();
    }
  }, [isLeadCycle]);

  return (
    <>
      <Modal
        size="3xl"
        onClose={() => setIsLeadCycle({ isOpen: false, id: null })}
        isOpen={isLeadCycle?.isOpen}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent mx="2" borderRadius="xl" boxShadow="xl">
          <ModalHeader
            bg={headerBg}
            color={headerText}
            borderTopRadius="xl"
            py={4}
            w="100%"
          >
            Lead Cycle Test 2
          </ModalHeader>
          <ModalCloseButton _focus={{ outline: "none" }} />
          <ModalBody overflow="hidden" width="100%">
            <Box
              width="100%"
              p="2"
              maxH={{ base: "50vh", md: "70vh" }}
              scrollBehavior="smooth"
              overflowY="scroll"
            >
              {loading ? (
                <CardShimmer
                  count={6}
                  height="100px"
                  columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, "2xl": 1 }}
                />
              ) : (
                <>
                  <LeadHistoryTimeline timelineData={data} />
                </>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeadCycle;
