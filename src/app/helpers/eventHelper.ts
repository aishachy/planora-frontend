export const getParticipationType = (event: {
  isPublic: boolean;
  isPaid: boolean;
}) => {
  if (event.isPublic && !event.isPaid) {
    return "FREE_PUBLIC";
  }

  if (event.isPublic && event.isPaid) {
    return "PAID_PUBLIC";
  }

  if (!event.isPublic && !event.isPaid) {
    return "PRIVATE_FREE";
  }

  return "PRIVATE_PAID";
};