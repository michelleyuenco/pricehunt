export interface Badge {
  id: string;
  nameZh: string;
  nameEn: string;
  icon: string;
  requirement: string;
}

export const BADGES: Badge[] = [
  { id: 'first_record', nameZh: '首次記錄', nameEn: 'First Record', icon: '🌱', requirement: 'Record your first price' },
  { id: 'ten_records', nameZh: '格價達人', nameEn: 'Price Hunter', icon: '🔟', requirement: '10 records' },
  { id: 'fifty_records', nameZh: '格價專家', nameEn: 'Price Expert', icon: '⭐', requirement: '50 records' },
  { id: 'hundred_records', nameZh: '格價大師', nameEn: 'Price Master', icon: '👑', requirement: '100 records' },
  { id: 'helpful_ten', nameZh: '好幫手', nameEn: 'Helpful', icon: '👍', requirement: '10 helpful votes' },
  { id: 'multi_store', nameZh: '周圍走', nameEn: 'Store Explorer', icon: '🏪', requirement: 'Record in 5+ stores' },
  { id: 'consistent', nameZh: '可靠來源', nameEn: 'Reliable Source', icon: '✅', requirement: '90%+ accuracy' },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function computeEarnedBadges(
  totalRecords: number,
  helpfulVotes: number,
  accuracyScore: number,
  uniqueStores: number,
): string[] {
  const earned: string[] = [];
  if (totalRecords >= 1) earned.push('first_record');
  if (totalRecords >= 10) earned.push('ten_records');
  if (totalRecords >= 50) earned.push('fifty_records');
  if (totalRecords >= 100) earned.push('hundred_records');
  if (helpfulVotes >= 10) earned.push('helpful_ten');
  if (uniqueStores >= 5) earned.push('multi_store');
  if (accuracyScore >= 90) earned.push('consistent');
  return earned;
}
