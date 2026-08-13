import { useState } from 'react';

export function useListingModals() {
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  return {
    showHeroModal,
    openHeroModal: () => setShowHeroModal(true),
    closeHeroModal: () => setShowHeroModal(false),

    showReportModal,
    openReportModal: () => setShowReportModal(true),
    closeReportModal: () => setShowReportModal(false),

    reportSent,
    markReportSent: () => setReportSent(true),

    showAnalyticsModal,
    openAnalyticsModal: () => setShowAnalyticsModal(true),
    closeAnalyticsModal: () => setShowAnalyticsModal(false),
  };
}
