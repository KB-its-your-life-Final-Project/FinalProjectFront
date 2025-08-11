import { ref } from "vue";

export function useModalState() {
  const showModal_financial = ref(false);
  const showModal_building = ref(false);
  const showNoDataModal = ref(false);
  const showNoBuildingDataModal = ref(false);
  const showHighRatioModal = ref(false);
  const showNoDataAndBuildingModal = ref(false);

  const resetModals = () => {
    showModal_financial.value = false;
    showModal_building.value = false;
    showNoDataModal.value = false;
    showNoBuildingDataModal.value = false;
    showHighRatioModal.value = false;
    showNoDataAndBuildingModal.value = false;
  };

  const openFinancialModal = () => {
    showModal_financial.value = true;
  };

  const closeFinancialModal = () => {
    showModal_financial.value = false;
  };

  const openBuildingModal = () => {
    showModal_building.value = true;
  };

  const closeBuildingModal = () => {
    showModal_building.value = false;
  };

  const openNoDataModal = () => {
    showNoDataModal.value = true;
  };

  const closeNoDataModal = () => {
    showNoDataModal.value = false;
  };

  const openNoBuildingDataModal = () => {
    showNoBuildingDataModal.value = true;
  };

  const closeNoBuildingDataModal = () => {
    showNoBuildingDataModal.value = false;
  };

  const openHighRatioModal = () => {
    showHighRatioModal.value = true;
  };

  const closeHighRatioModal = () => {
    showHighRatioModal.value = false;
  };

  const openNoDataAndBuildingModal = () => {
    showNoDataAndBuildingModal.value = true;
  };

  const closeNoDataAndBuildingModal = () => {
    showNoDataAndBuildingModal.value = false;
  };

  return {
    // 상태
    showModal_financial,
    showModal_building,
    showNoDataModal,
    showNoBuildingDataModal,
    showHighRatioModal,
    showNoDataAndBuildingModal,

    // 메서드
    resetModals,
    openFinancialModal,
    closeFinancialModal,
    openBuildingModal,
    closeBuildingModal,
    openNoDataModal,
    closeNoDataModal,
    openNoBuildingDataModal,
    closeNoBuildingDataModal,
    openHighRatioModal,
    closeHighRatioModal,
    openNoDataAndBuildingModal,
    closeNoDataAndBuildingModal,
  };
}
